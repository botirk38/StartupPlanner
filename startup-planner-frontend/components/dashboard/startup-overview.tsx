import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon } from 'lucide-react';
import { Business } from "@/utils/types";

interface StartupOverviewProps {
  business: Business;
}

export function StartupOverview({ business }: StartupOverviewProps) {
  const getStagePercentage = (stage: string) => {
    const stages = ['Idea', 'MVP', 'Growth', 'Maturity'];
    const index = stages.indexOf(stage);
    return ((index + 1) / stages.length) * 100;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <Card className="w-full bg-white dark:bg-gray-800">
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4">
        <div className="space-y-2">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">{business.name}</CardTitle>
          <CardDescription className="text-muted-foreground dark:text-gray-400">{business.description}</CardDescription>
        </div>
        <div className="flex items-center gap-4">
          <time className="flex items-center gap-1 text-sm text-muted-foreground dark:text-gray-400">
            <CalendarIcon className="w-4 h-4" />
            <span>Founded: {business.founding_date}</span>
          </time>
          <Badge variant="outline" className="rounded-full px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            {business.stage}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-6">
              <article className="bg-muted dark:bg-gray-700 rounded-lg p-4 flex flex-col items-start justify-center gap-2">
                <h2 className="text-sm font-medium text-muted-foreground dark:text-gray-400">Funding Status</h2>
                <p className="text-2xl font-bold text-gray-900 dark:text-white truncate w-full">
                  ${formatNumber(business.funding_amount)}
                </p>
                <p className="text-sm text-muted-foreground dark:text-gray-400">Raised</p>
              </article>
              <article className="bg-muted dark:bg-gray-700 rounded-lg p-4 flex flex-col items-start gap-2">
                <h2 className="text-sm font-medium text-muted-foreground dark:text-gray-400">Team Size</h2>
                <p className="text-2xl font-bold text-gray-900 dark:text-white truncate w-full">
                  {formatNumber(business.team_size)}
                </p>
                <p className="text-sm text-muted-foreground dark:text-gray-400">Employees</p>
              </article>
            </div>
            <article className="bg-muted dark:bg-gray-700 rounded-lg p-4 flex flex-col items-start gap-2">
              <h2 className="text-sm font-medium text-muted-foreground dark:text-gray-400">Current Stage</h2>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{business.stage}</p>
              <p className="text-sm text-muted-foreground dark:text-gray-400">{business.stage_description}</p>
            </article>
          </div>
          <article className="bg-muted dark:bg-gray-700 rounded-lg p-4 flex flex-col items-start gap-4">
            <h2 className="text-sm font-medium text-muted-foreground dark:text-gray-400">Progress</h2>
            <div className="w-full h-4 bg-background dark:bg-gray-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary dark:bg-blue-500"
                style={{ width: `${getStagePercentage(business.stage)}%` }}
                role="progressbar"
                aria-valuenow={getStagePercentage(business.stage)}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <ul className="flex justify-between w-full text-sm text-muted-foreground dark:text-gray-400">
              <li>Idea</li>
              <li>MVP</li>
              <li>Growth</li>
              <li>Maturity</li>
            </ul>
          </article>
        </section>
        <Separator className="my-6 bg-gray-200 dark:bg-gray-600" />
        <section className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">About {business.name}</h2>
          <p className="text-muted-foreground dark:text-gray-400">
            {business.long_description}
          </p>
        </section>
      </CardContent>
    </Card>
  );
}

