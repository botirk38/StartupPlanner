import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Business, NewBusiness } from "@/utils/types";

interface BusinessFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  business: Business | null;
  onUpdate: (business: Business) => void;
  onCreate: (business: NewBusiness) => void;
}

const formSchema = z.object({
  name: z.string().min(1, "Business name is required"),
  description: z.string().min(1, "Business description is required"),
  long_description: z.string().optional(),
  industry: z.string().min(1, "Industry is required"),
  stage: z.enum(["Idea", "MVP", "Growth", "Maturity"], {
    required_error: "Please select a stage",
  }),
  stage_description: z.string().optional(),
  funding_amount: z.number().min(0, "Funding amount must be positive"),
  team_size: z.number().int().positive("Team size must be a positive integer"),
  founding_date: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function BusinessFormDialog({ isOpen, onClose, business, onUpdate, onCreate }: BusinessFormDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: business?.name || "",
      description: business?.description || "",
      long_description: business?.long_description || "",
      industry: business?.industry || "",
      stage: business?.stage || "Idea",
      stage_description: business?.stage_description || "",
      funding_amount: business?.funding_amount || 0,
      team_size: business?.team_size || 1,
      founding_date: business?.founding_date || "",
    },
  });

  function onSubmit(values: FormValues) {
    console.log("Calling")
    if (business) {
      onUpdate({ ...business, ...values });
    } else {
      onCreate(values);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm md:max-w-[95vw] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{business ? "Edit Business" : "Create New Business"}</DialogTitle>
          <DialogDescription>
            {business ? "Make changes to your business details here." : "Enter details for your new business."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex flex-col flex-grow overflow-y-auto">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter business name" {...field} />
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
                      <Input placeholder="Enter industry" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter short business description" {...field} />
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
                    <Textarea placeholder="Enter detailed business description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                        {["Idea", "MVP", "Growth", "Maturity"].map((stage) => (
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
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            </div>

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


            <div className="flex flex-col-reverse sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-4 mt-auto">
              <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">Cancel</Button>
              <Button type="submit" className="w-full sm:w-auto">
                {business ? "Save changes" : "Create Business"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

