import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star, TrendingUp, TrendingDown, Minus } from 'lucide-react';

type PricingPlan = {
  plan: string;
  price: number;
};

type Competitor = {
  name: string;
  product: string;
  market: string;
  strengths: string[];
  weaknesses: string[];
  marketShare: number;
  pricing: PricingPlan[];
  customerReviews: number;
  growthTrend: 'Steady' | 'Increasing' | 'Decreasing';
};

const CompetitorResearch: React.FC = () => {
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null);

  const competitors: Competitor[] = [
    {
      name: "Acme Innovations",
      product: "AI-Powered Project Management",
      market: "Startups & Small Businesses",
      strengths: ["User-friendly interface", "Automated task tracking"],
      weaknesses: ["Limited integrations", "High pricing"],
      marketShare: 12.5,
      pricing: [
        { plan: "Basic", price: 19.99 },
        { plan: "Pro", price: 49.99 },
        { plan: "Enterprise", price: 99.99 },
      ],
      customerReviews: 4.2,
      growthTrend: "Steady",
    },
    {
      name: "Startup Wizard",
      product: "Startup Planning Software",
      market: "Entrepreneurs & Founders",
      strengths: ["Comprehensive planning tools", "Large template library"],
      weaknesses: ["Steep learning curve", "Limited customization"],
      marketShare: 8.7,
      pricing: [
        { plan: "Starter", price: 9.99 },
        { plan: "Professional", price: 24.99 },
        { plan: "Enterprise", price: 59.99 },
      ],
      customerReviews: 3.8,
      growthTrend: "Increasing",
    },
  ];

  const renderCompetitorDetails = (competitor: Competitor) => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{competitor.name}</CardTitle>
        <p className="text-muted-foreground">{competitor.product}</p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="strengths">Strengths</TabsTrigger>
            <TabsTrigger value="weaknesses">Weaknesses</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Market Share</h4>
              <Progress value={competitor.marketShare} className="h-2" />
              <p className="text-sm text-muted-foreground mt-1">{competitor.marketShare}%</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Customer Reviews</h4>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.floor(competitor.customerReviews) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">{competitor.customerReviews.toFixed(1)}</span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Growth Trend</h4>
              <Badge variant="outline" className="flex items-center gap-1">
                {competitor.growthTrend === 'Increasing' && <TrendingUp className="w-4 h-4 text-green-500" />}
                {competitor.growthTrend === 'Decreasing' && <TrendingDown className="w-4 h-4 text-red-500" />}
                {competitor.growthTrend === 'Steady' && <Minus className="w-4 h-4 text-blue-500" />}
                {competitor.growthTrend}
              </Badge>
            </div>
          </TabsContent>
          <TabsContent value="strengths">
            <ul className="list-disc pl-5 space-y-1">
              {competitor.strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="weaknesses">
            <ul className="list-disc pl-5 space-y-1">
              {competitor.weaknesses.map((weakness, index) => (
                <li key={index}>{weakness}</li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
        <div>
          <h4 className="font-semibold mb-2">Pricing</h4>
          <div className="grid grid-cols-3 gap-2">
            {competitor.pricing.map((price, index) => (
              <Card key={index} className="p-2 text-center">
                <p className="font-medium">{price.plan}</p>
                <p className="text-lg font-bold">${price.price}</p>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
  return (
    <div className="min-h-screen w-full flex-col bg-muted/40 p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Competitor Research</h1>
      <BentoGrid className="mb-8">
        {competitors.map((competitor, index) => (
          <BentoGridItem
            key={index}
            title={competitor.name}
            description={
              <div className='space-y-8'>
                <p>{competitor.product}</p>
                < Button size="sm" onClick={() => setSelectedCompetitor(competitor)}>View Details</Button>
              </div>

            }
            className={selectedCompetitor === competitor ? "ring-2 ring-primary" : ""}
            icon={
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                {index + 1}
              </div>
            }
            header={
              <div className="flex justify-between items-center">
                <Badge className=''>{competitor.market}</Badge>
              </div>
            }
          />
        ))}
      </BentoGrid>
      <div className='py-6'>
        {selectedCompetitor && (
          renderCompetitorDetails(selectedCompetitor)
        )}

      </div>

      <div className="flex justify-center">
        <Button size="lg">Find gaps in the market.</Button>
      </div>
    </div>
  );
}

export default CompetitorResearch;

