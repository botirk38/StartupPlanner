"use client"

import React, { useState, useMemo, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, Lightbulb } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";


type MarketGap = string;
type SellingProposition = string;
type UnderservedNeed = string;

type ChartData = {
  date: string;
  desktop: number;
  mobile: number;
};

const chartData: ChartData[] = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 97, mobile: 180 },
  // ... (include all the data points from the example)
];

type ChartConfig = {
  [key: string]: { label: string; color: string };
};

const chartConfig: ChartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
};

const MarketGapAnalysis: React.FC = () => {
  const [activeChart, setActiveChart] = useState<keyof typeof chartConfig>("desktop");
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<{
    chartData: ChartData[];
    marketGaps: MarketGap[];
    sellingPropositions: SellingProposition[];
    underservedNeeds: UnderservedNeed[];
  }>({
    chartData: [],
    marketGaps: [],
    sellingPropositions: [],
    underservedNeeds: [],
  });

  const total = useMemo(
    () => ({
      desktop: chartData.reduce((acc, curr) => acc + curr.desktop, 0),
      mobile: chartData.reduce((acc, curr) => acc + curr.mobile, 0),
    }),
    []
  );

  const marketGaps: MarketGap[] = [
    "Lack of personalized customer support",
    "Limited integration with third-party tools",
    "Lack of advanced analytics and reporting",
    "Absence of mobile-first design"
  ];

  const sellingPropositions: SellingProposition[] = [
    "24/7 live customer support with dedicated account managers",
    "Open API and seamless integrations with popular tools",
    "Advanced analytics and custom reporting capabilities",
    "Fully responsive and optimized for mobile devices"
  ];

  const underservedNeeds: UnderservedNeed[] = [
    "Customizable subscription models and pricing tiers",
    "Multi-language support and localization",
    "Augmented reality (AR) product visualization",
    "Blockchain-based security and transparency"
  ];

  useEffect(() => {
    const socket = new WebSocket('ws://your-websocket-endpoint-url');

    socket.onopen = () => {
      console.log('WebSocket connection established');
      socket.send(JSON.stringify({ type: 'fetchMarketData' }));
    };

    socket.onmessage = (event) => {
      const receivedData = JSON.parse(event.data);
      setData(receivedData);
      setIsLoading(false);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsLoading(false);
    };

    return () => {
      socket.close();
    };
  }, []);

  const renderLoadingSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Market Gap Analysis</h1>
        {renderLoadingSkeleton()}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Market Gap Analysis</h1>
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Market Gaps and Opportunities</CardTitle>
            <CardDescription>
              Our analysis has identified the following potential market gaps and opportunities for differentiation:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {marketGaps.map((gap, index) => (
                <li key={index}>{gap}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Unique Selling Propositions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-2">
              {sellingPropositions.map((proposition, index) => (
                <li key={index} className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  {proposition}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
            <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
              <CardTitle>Market Trends</CardTitle>
              <CardDescription>
                Showing total visitors for the last 3 months
              </CardDescription>
            </div>
            <div className="flex">
              {Object.keys(chartConfig).map((key) => (
                <button
                  key={key}
                  data-active={activeChart === key}
                  className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                  onClick={() => setActiveChart(key as keyof typeof chartConfig)}
                >
                  <span className="text-xs text-muted-foreground">
                    {chartConfig[key].label}
                  </span>
                  <span className="text-lg font-bold leading-none sm:text-3xl">
                    {total[key as keyof typeof total].toLocaleString()}
                  </span>
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="px-2 sm:p-6">
            <div className="aspect-auto h-[250px] w-full">
              <BarChart
                width={800}
                height={250}
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <Tooltip
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
                <Bar dataKey={activeChart} fill={chartConfig[activeChart].color} />
              </BarChart>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Underserved Market Needs</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-2">
              {underservedNeeds.map((need, index) => (
                <li key={index} className="flex items-center">
                  <Lightbulb className="mr-2 h-4 w-4 text-yellow-500" />
                  {need}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Share Your Ideas</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4">
              <Textarea
                placeholder="Describe your product idea or unique selling proposition..."
                className="min-h-[150px]"
              />
              <Button type="submit">Compare to Market Data</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default MarketGapAnalysis;

