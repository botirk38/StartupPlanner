"use client"

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";

const securitySchema = z.object({
  current_password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  new_password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirm_password: z.string().min(6, { message: "Password must be at least 6 characters." }),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

type SecurityFormValues = z.infer<typeof securitySchema>;

const SecurityForm: React.FC = () => {
  const { toast } = useToast();

  const form = useForm<SecurityFormValues>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const onSubmit: SubmitHandler<SecurityFormValues> = async (data) => {
    try {
      const response = await fetch("/api/security", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error("Failed to update security settings");
      }

      toast({
        title: "Security settings updated",
        description: "Your security settings have been updated successfully.",
      });
      form.reset();
    } catch (err) {
      toast({
        title: "Security settings failed to update.",
        description: "Please make sure that all the details entered are correct and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mt-6 dark:bg-gray-800 dark:text-white">
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>Update your password and two-factor authentication.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {["current_password", "new_password", "confirm_password"].map((fieldName) => (
              <FormField
                key={fieldName}
                control={form.control}
                name={fieldName as keyof SecurityFormValues}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{fieldName.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`Enter ${fieldName.split('_').join(' ')}`}
                        type="password"
                        {...field}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button
              type="submit"
              className="w-full dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Updating..." : "Update Security Settings"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SecurityForm;

