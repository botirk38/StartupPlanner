"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function Dashboard() {
  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 dark:bg-gray-900">
      <Card className="dark:bg-gray-800 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="dark:text-gray-100">Business Plan Generator</CardTitle>
          <CardDescription className=" dark:text-gray-400">Create a professional business plan in minutes.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Input type="text" placeholder="Business Name" className="w-full dark:bg-gray-700  dark:text-gray-100 dark:placeholder:text-white" />
            <Textarea placeholder="Business Description" className="w-full dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-white" rows={4} />
            <Button className="dark:text-white dark:bg-blue-700 dark:hover:bg-blue-800">Generate Plan</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

