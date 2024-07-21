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

  return (
    <Card className="w-full bg-white dark:bg-gray-800">
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4">
        <div className="space-y-2">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">{business.name}</CardTitle>
          <CardDescription className="text-muted-foreground dark:text-gray-400">{business.description}</CardDescription>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm text-muted-foreground dark:text-gray-400">
            <CalendarIcon className="w-4 h-4" />
            <span>Founded: {business.founding_date}</span>
          </div>
          <Badge variant="outline" className="rounded-full px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            {business.stage}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted dark:bg-gray-700 rounded-lg p-4 flex flex-col items-start gap-2">
                <div className="text-sm font-medium text-muted-foreground dark:text-gray-400">Funding Status</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">${business.funding_amount.toLocaleString() ?? 'N/A'}</div>
                <div className="text-sm text-muted-foreground dark:text-gray-400">Raised</div>
              </div>
              <div className="bg-muted dark:bg-gray-700 rounded-lg p-4 flex flex-col items-start gap-2">
                <div className="text-sm font-medium text-muted-foreground dark:text-gray-400">Team Size</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{business.team_size}</div>
                <div className="text-sm text-muted-foreground dark:text-gray-400">Employees</div>
              </div>
            </div>
            <div className="bg-muted dark:bg-gray-700 rounded-lg p-4 flex flex-col items-start gap-2">
              <div className="text-sm font-medium text-muted-foreground dark:text-gray-400">Current Stage</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{business.stage}</div>
              <div className="text-sm text-muted-foreground dark:text-gray-400">{business.stage_description}</div>
            </div>
          </div>
          <div className="bg-muted dark:bg-gray-700 rounded-lg p-4 flex flex-col items-start gap-4">
            <div className="text-sm font-medium text-muted-foreground dark:text-gray-400">Progress</div>
            <div className="w-full h-4 bg-background dark:bg-gray-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary dark:bg-blue-500"
                style={{ width: `${getStagePercentage(business.stage)}%` }}
                role="progressbar"
              />
            </div>
            <div className="flex justify-between w-full text-sm text-muted-foreground dark:text-gray-400">
              <span>Idea</span>
              <span>MVP</span>
              <span>Growth</span>
              <span>Maturity</span>
            </div>
          </div>
        </div>
        <Separator className="my-6 bg-gray-200 dark:bg-gray-600" />
        <div className="space-y-4">
          <div className="text-lg font-medium text-gray-900 dark:text-white">About {business.name}</div>
          <div className="text-muted-foreground dark:text-gray-400">
            {business.long_description}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

