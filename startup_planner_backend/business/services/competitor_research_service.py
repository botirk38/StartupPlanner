from dataclasses import dataclass
from openai import OpenAI
from ..models import Competitor, Business
import json
from ..serializers import CompetitorSerializer
import logging
from duckduckgo_search import DDGS
import time
from django.db import transaction
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

client = OpenAI()


class Tool(BaseModel):
    type: str


class Assistant(BaseModel):
    id: str
    object: str
    created_at: datetime = Field(..., alias="created_at")
    name: str
    description: Optional[str] = None
    model: str
    instructions: str
    tools: List[Tool]
    metadata: dict = {}
    top_p: float
    temperature: float
    response_format: str = "auto"

    class Config:
        allow_population_by_field_name = True


@dataclass
class CompetitorResearchService:
    assistant: Assistant = None

    def __post_init__(self):
        if self.assistant is None:
            self.assistant = self._get_or_create_assistant()

    def _get_or_create_assistant(self):
        assistants = client.beta.assistants.list()
        for assistant in assistants:
            if assistant.name == "Competitor Researcher":
                return assistant
        return self._create_assistant()

    def _create_assistant(self):
        return client.beta.assistants.create(
            name="Competitor Researcher",
            instructions="""
            You are an excellent researcher for the client that researches competitors.
            Your task is to find and analyze competitors based on the given business information.
            Return the results as a JSON array of competitor objects with the following structure:

            [
                {
                    "name": "Competitor Name",
                    "industry": "Industry (max 30 characters)",
                    "product": "Main Product (max 50 characters)",
                    "market_share": 0.0 (decimal between 0 and 100, with 2 decimal places),
                    "strengths": [
                        {"description": "Strength 1 (max 100 characters)"},
                        {"description": "Strength 2 (max 100 characters)"}
                    ],
                    "weaknesses": [
                        {"description": "Weakness 1 (max 100 characters)"},
                        {"description": "Weakness 2 (max 100 characters)"}
                    ],
                    "website": "https://example.com",
                    "customer_reviews": 0 (positive integer),
                    "growth_trend": "Steady" or "Decreasing" or "Increasing"
                },
                ...
            ]

            Ensure that:
            1. The "industry" field is no longer than 30 characters.
            2. The "product" field is no longer than 50 characters.
            3. The "market_share" is a decimal field between 0 and 100 with up to 2 decimal places.
            4. Each strength and weakness description is no longer than 100 characters.
            5. The "customer_reviews" is a positive integer out of 5 stars.
            6. The "growth_trend" is exactly one of: "Steady", "Decreasing", or "Increasing".

            Remember only return the JSON, nothing else, and return 3 competitors in each response.

            """,
            model="gpt-4o-mini",
            tools=[self._get_internet_search_tool()]
        )

    def internet_search(self, query: str, recent_days: int = None):
        with DDGS() as ddgs:
            results = []
            timelimit = None

            if recent_days:
                if recent_days <= 1:
                    timelimit = 'd'
                elif recent_days <= 7:
                    timelimit = 'w'
                elif recent_days <= 30:
                    timelimit = 'm'
                else:
                    timelimit = 'y'

            search_results = ddgs.text(
                keywords=query,
                timelimit=timelimit,
                max_results=5
            )

            for r in search_results:
                results.append({
                    'title': r['title'],
                    'body': r['body'],
                    'href': r['href'],
                    'published': r.get('published', '')
                })
                if len(results) >= 5:
                    break

            return results

    @staticmethod
    def _get_internet_search_tool():
        return {
            "type": "function",
            "function": {
                "name": "internet_search",
                "description": (
                    "DuckDuckGo internet search API, returns top results to query\n"
                    "- Use search when information newer than pretraining is needed"
                ),
                "parameters": {
                    "type": "object",
                    "properties": {
                        "query": {"type": "string", "description": "long natural language allowed"},
                        "recent_days": {"type": "number", "description": "how many days back from today"},
                    },
                    "required": ["query"]
                },
            },
        }

    def research_competitors(self, business: Business) -> List[Competitor]:
        existing_competitors = Competitor.objects.filter(
            business=business).values_list('name', flat=True)
        thread = client.beta.threads.create()
        self._create_message(thread.id, business, existing_competitors)
        messages = self._create_and_wait_for_run(thread.id)
        return self._process_response(messages, business)

    def _create_message(self, thread_id: str, business: Business, existing_competitors: List[str]):
        existing_competitors_str = ", ".join(existing_competitors)
        prompt = f"""
        Research new competitors for the following business that are not the existing competitors:
        Name: {business.name}
        Industry: {business.industry}
        Description: {business.description}
        Existing Competitors: {existing_competitors_str}
        """
        client.beta.threads.messages.create(
            thread_id=thread_id,
            role="user",
            content=prompt
        )

    def _create_and_wait_for_run(self, thread_id: str):
        run = client.beta.threads.runs.create(
            thread_id=thread_id,
            assistant_id=self.assistant.id,
        )

        while True:
            run = client.beta.threads.runs.retrieve(
                thread_id=thread_id, run_id=run.id)

            if run.status == 'completed':
                messages = client.beta.threads.messages.list(
                    thread_id=thread_id)
                logger.info(f"Messages: {messages}")
                return messages

            elif run.status == 'requires_action':
                tool_calls = run.required_action.submit_tool_outputs.tool_calls
                tool_outputs = []

                for tool_call in tool_calls:
                    if tool_call.function.name == 'internet_search':
                        function_args = json.loads(
                            tool_call.function.arguments)
                        search_results = self.internet_search(
                            query=function_args['query'],
                            recent_days=function_args.get('recent_days')
                        )
                        tool_outputs.append({
                            "tool_call_id": tool_call.id,
                            "output": json.dumps(search_results)
                        })

                client.beta.threads.runs.submit_tool_outputs(
                    thread_id=thread_id,
                    run_id=run.id,
                    tool_outputs=tool_outputs
                )

            elif run.status in ['failed', 'cancelled', 'expired']:
                logger.error(f"Run failed with status: {run.status}")
                return None

            else:
                logger.info(f"Run Status: {run.status}")
                time.sleep(1)  # Wait for a second before checking again

    def _process_response(self, messages, business: Business) -> List[Competitor]:
        if not messages:
            return []

        assistant_message = next(
            (msg for msg in messages.data if msg.role == 'assistant'), None)
        if not assistant_message:
            logger.error("No assistant message found")
            return []

        try:
            content = assistant_message.content[0].text.value
            json_str = content.strip().lstrip('```json').rstrip('```').strip()
            competitor_data = json.loads(json_str)

            logger.info(f"Competitor Data: {competitor_data}")
            return self._create_competitors(competitor_data, business)
        except json.JSONDecodeError as e:
            logger.error(
                f"Failed to parse competitor data from assistant's response {e}")
            return []

    @transaction.atomic
    def _create_competitors(self, competitor_data: List[dict], business: Business) -> List[Competitor]:
        competitors = []
        for comp in competitor_data:
            comp['business'] = business.id

            try:
                existing_competitor = Competitor.objects.filter(
                    business=business, name=comp['name']).first()

                if existing_competitor:
                    serializer = CompetitorSerializer(
                        existing_competitor, data=comp)
                else:
                    serializer = CompetitorSerializer(data=comp)

                if serializer.is_valid():
                    competitor = serializer.save()
                    competitors.append(competitor)
                else:
                    logger.error(
                        f"Invalid competitor data: {serializer.errors}")
            except Exception as e:
                logger.error(
                    f"Error creating/updating competitor: {str(e)}")

            logger.info(f"Competitors processed: {len(competitors)}")
            return competitors
