import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface Business {
  id: number;
  name: string;
  description: string;
}

interface BusinessPlanGeneratorProps {
  business: Business | null;
}

export function BusinessPlanGenerator({ business }: BusinessPlanGeneratorProps) {
  return (
    <Card className="dark:bg-gray-800 shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="dark:text-gray-100">Business Plan Generator</CardTitle>
        <CardDescription className="dark:text-gray-400">Create a professional business plan in minutes.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <Input type="text" placeholder="Business Name" value={business?.name || ""} readOnly className="w-full dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-white" />
          <Textarea placeholder="Business Description" value={business?.description || ""} readOnly className="w-full dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-white" rows={4} />
          <Button className="dark:text-white dark:bg-blue-700 dark:hover:bg-blue-800">Generate Plan</Button>
        </div>
      </CardContent>
    </Card>
  );
}


