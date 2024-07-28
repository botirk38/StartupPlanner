from django.test import TestCase
from unittest.mock import patch, MagicMock
from datetime import datetime
from ..models import Business, Competitor
from ..services.competitor_research_service import CompetitorResearchService


class CompetitorResearchServiceTestCase(TestCase):
    def setUp(self):
        self.business = Business.objects.create(
            name="Test Business",
            industry="Test Industry",
            description="Test Description"
        )
        self.service = CompetitorResearchService()

    @patch('openai.OpenAI')
    def test_get_or_create_assistant(self, mock_openai):
        mock_client = MagicMock()
        mock_openai.return_value = mock_client
        mock_assistant = MagicMock(name="Competitor Researcher")
        mock_client.beta.assistants.list.return_value = [mock_assistant]

        assistant = self.service._get_or_create_assistant()

        self.assertEqual(assistant, mock_assistant)
        mock_client.beta.assistants.list.assert_called_once()

    @patch('openai.OpenAI')
    def test_create_assistant(self, mock_openai):
        mock_client = MagicMock()
        mock_openai.return_value = mock_client
        mock_assistant = MagicMock()
        mock_client.beta.assistants.create.return_value = mock_assistant

        assistant = self.service._create_assistant()

        self.assertEqual(assistant, mock_assistant)
        mock_client.beta.assistants.create.assert_called_once()

    @patch('duckduckgo_search.DDGS')
    def test_internet_search(self, mock_ddgs):
        mock_ddgs_instance = MagicMock()
        mock_ddgs.return_value.__enter__.return_value = mock_ddgs_instance
        mock_results = [
            {
                'title': 'Test Result',
                'body': 'Test Body',
                'href': 'https://test.com',
                'published': '2023-01-01'
            }
        ]
        mock_ddgs_instance.text.return_value = mock_results

        results = self.service.internet_search("test query", recent_days=7)

        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['title'], 'Test Result')
        mock_ddgs_instance.text.assert_called_once_with(
            keywords="test query",
            timelimit='w',
            max_results=5
        )

    @patch.object(CompetitorResearchService, '_create_message')
    @patch.object(CompetitorResearchService, '_create_and_wait_for_run')
    @patch.object(CompetitorResearchService, '_process_response')
    def test_research_competitors(self, mock_process, mock_create_run, mock_create_message):
        mock_thread = MagicMock(id='thread_id')
        mock_messages = MagicMock()
        mock_competitors = [MagicMock()]

        with patch('openai.OpenAI') as mock_openai:
            mock_client = MagicMock()
            mock_openai.return_value = mock_client
            mock_client.beta.threads.create.return_value = mock_thread
            mock_create_run.return_value = mock_messages
            mock_process.return_value = mock_competitors

            result = self.service.research_competitors(self.business)

            mock_client.beta.threads.create.assert_called_once()
            mock_create_message.assert_called_once_with(
                'thread_id', self.business)
            mock_create_run.assert_called_once_with('thread_id')
            mock_process.assert_called_once_with(mock_messages, self.business)
            self.assertEqual(result, mock_competitors)

    def test_process_response(self):
        mock_messages = MagicMock()
        mock_message = MagicMock(
            role='assistant',
            content=[MagicMock(text=MagicMock(
                value='```json\n[{"name": "Competitor 1"}]\n```'))]
        )
        mock_messages.data = [mock_message]

        with patch.object(CompetitorResearchService, '_create_competitors') as mock_create:
            mock_create.return_value = [MagicMock()]
            result = self.service._process_response(
                mock_messages, self.business)

            mock_create.assert_called_once_with(
                [{"name": "Competitor 1"}], self.business)
            self.assertEqual(len(result), 1)

    def test_create_competitors(self):
        competitor_data = [
            {
                "name": "Competitor 1",
                "industry": "Test Industry",
                "product": "Test Product",
                "market_share": 10.5,
                "strengths": [{"description": "Strength 1"}],
                "weaknesses": [{"description": "Weakness 1"}],
                "website": "https://competitor1.com",
                "customer_reviews": 4,
                "growth_trend": "Increasing"
            }
        ]

        result = self.service._create_competitors(
            competitor_data, self.business)

        self.assertEqual(len(result), 1)
        self.assertIsInstance(result[0], Competitor)
        self.assertEqual(result[0].name, "Competitor 1")
        self.assertEqual(result[0].business, self.business)


if __name__ == '__main__':
    unittest.main()
