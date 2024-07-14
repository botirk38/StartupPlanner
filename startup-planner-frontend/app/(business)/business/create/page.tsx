"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
  name: z.string().min(1, "Business name is required"),
  industry: z.string().min(1, "Industry is required"),
  description: z.string().min(1, "Business description is required"),
  long_description: z.string().optional(),
  stage: z.enum(["Idea", "MVP", "Growth", "Maturity"], {
    required_error: "Please select a stage",
  }),
  stage_description: z.string().optional(),
  funding_amount: z.number().min(0, "Funding amount must be positive").optional(),
  team_size: z.number().int().positive("Team size must be a positive integer"),
  founding_date: z.string().optional(), // You might want to use a date picker component
})

type FormValues = z.infer<typeof formSchema>;

const stageOptions = ["Idea", "MVP", "Growth", "Maturity"]

export default function BusinessStartupForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      industry: "",
      description: "",
      long_description: "",
      stage: "Idea",
      stage_description: "",
      funding_amount: undefined,
      team_size: undefined,
      founding_date: undefined,
    },
  })

  const onSubmit = async (values: FormValues) => {
    console.log("Values:", values)
    setIsLoading(true)
    try {
      const response = await fetch("/api/businesses/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })
      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: 'Failed to create business.',
          description: errorData.error,
          variant: 'destructive',
        });
        return;
      }
      toast({
        title: 'Successfully created business.',
        description: "Redirecting to the dashboard."
      });
      router.push("/dashboard");
    } catch (error: any) {
      console.error('Submission error:', error)
      toast({
        title: 'Failed to create business.',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false)
    }
  }


  const handleNext = () => {
    let fieldsToValidate: (keyof FormValues)[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = ['name', 'industry'];
        break;
      case 2:
        fieldsToValidate = ['description', 'long_description'];
        break;
      case 3:
        fieldsToValidate = ['stage', 'stage_description'];
        break;
    }

    form.trigger(fieldsToValidate).then((isValid) => {
      if (isValid) setCurrentStep(prev => prev + 1);
    });
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.handleSubmit(onSubmit)(e);
  }

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>New Business Startup</CardTitle>
        <CardDescription>Please fill out the following steps to create your new business.</CardDescription>
      </CardHeader>
      <div className="p-6">
        <Progress value={(currentStep / 4) * 100} className="w-full" />
      </div>
      <Form {...form}>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-6">
              {currentStep === 1 && (
                <>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your business name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your industry" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              {currentStep === 2 && (
                <>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Briefly describe your business"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="long_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Long Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide a detailed description of your business"
                            className="min-h-[200px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              {currentStep === 3 && (
                <>
                  <FormField
                    control={form.control}
                    name="stage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Stage</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a stage" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {stageOptions.map((stage) => (
                              <SelectItem key={stage} value={stage}>
                                {stage}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="stage_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stage Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Describe your current stage" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              {currentStep === 4 && (
                <>
                  <FormField
                    control={form.control}
                    name="funding_amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Funding Amount</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter funding amount" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="team_size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team Size</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter team size" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="founding_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Founding Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            {currentStep > 1 && (
              <Button type="button" variant="outline" onClick={handlePrevious} disabled={isLoading}>
                Previous
              </Button>
            )}
            {currentStep < 4 ? (
              <Button type="button" onClick={handleNext} disabled={isLoading}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Submit'}
              </Button>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}

