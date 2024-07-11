"use client"

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { AccountData } from "@/utils/types";

const accountSchema = z.object({
  display_name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  bio: z.string(),
  avatar: z.any().optional(),
});

type AccountFormValues = z.infer<typeof accountSchema>;

interface AccountFormProps {
  accountData: AccountData;
}

const AccountForm: React.FC<AccountFormProps> = ({ accountData }) => {
  const { toast } = useToast();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState(accountData.avatar);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      display_name: accountData.display_name,
      email: accountData.email,
      bio: accountData.bio,
      avatar: undefined,
    },
  });

  const onSubmit: SubmitHandler<AccountFormValues> = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    try {
      const response = await fetch("/api/account", {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update account settings");
      }

      const updatedData = await response.json();
      setAvatarUrl(updatedData.avatar);

      toast({
        title: "Account settings updated",
        description: "Your account settings have been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Account settings update failed.",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mt-6 dark:bg-gray-800 dark:text-white">
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription className="dark:text-white">Update your personal information and preferences.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex items-center space-x-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarUrl} alt="User avatar" />
                <AvatarFallback>{accountData.display_name.charAt(0)}</AvatarFallback>
              </Avatar>
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Avatar</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setAvatarFile(file);
                            field.onChange(file);
                          }
                        }}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:placeholder:text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {['display_name', 'email', 'bio'].map((fieldName) => (
              <FormField
                key={fieldName}
                control={form.control}
                name={fieldName as keyof AccountFormValues}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{fieldName === 'display_name' ? 'Name' : fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}</FormLabel>
                    <FormControl>
                      {fieldName === 'bio' ? (
                        <Textarea
                          {...field}
                          placeholder={`Enter your ${fieldName}`}
                          className="min-h-[120px] dark:bg-gray-700 dark:border-gray-600 dark:placeholder:text-white"
                        />
                      ) : (
                        <Input
                          {...field}
                          placeholder={`Enter your ${fieldName}`}
                          className="dark:bg-gray-700 dark:border-gray-600 dark:placeholder:text-white"
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button type="submit" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AccountForm;

