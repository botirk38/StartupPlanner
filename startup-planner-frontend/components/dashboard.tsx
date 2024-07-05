"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function Dashboard() {
  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Business Plan Generator</CardTitle>
          <CardDescription>Create a professional business plan in minutes.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Input type="text" placeholder="Business Name" className="w-full" />
            <Textarea placeholder="Business Description" className="w-full" rows={4} />
            <Button>Generate Plan</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}







