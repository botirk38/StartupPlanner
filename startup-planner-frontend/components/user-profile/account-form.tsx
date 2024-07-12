"use client"

import React, { useState, useCallback } from "react";
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const accountSchema = z.object({
  display_name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  bio: z.string().max(500, { message: "Bio must not exceed 500 characters." }),
  avatar: z
    .any()
    .refine((file) => !file || (file instanceof File && file.size <= MAX_FILE_SIZE), {
      message: "Max file size is 5MB.",
    })
    .refine((file) => !file || (file instanceof File && ACCEPTED_IMAGE_TYPES.includes(file.type)), {
      message: "Only .jpg, .jpeg, .png and .webp formats are supported.",
    })
    .optional(),
});

type AccountFormValues = z.infer<typeof accountSchema>;

interface AccountFormProps {
  accountData: AccountData;
}

const AccountForm: React.FC<AccountFormProps> = ({ accountData }) => {
  const { toast } = useToast();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(accountData.avatar);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);



  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      display_name: accountData.display_name,
      email: accountData.email,
      bio: accountData.bio,
      avatar: undefined,
    },
  });

  const handleAvatarChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const onSubmit: SubmitHandler<AccountFormValues> = async (data) => {
    setIsSubmitting(true);
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
      setAvatarPreview(updatedData.avatar);

      toast({
        title: "Account settings updated",
        description: "Your account settings have been updated successfully.",
      });
      setIsDialogOpen(false);

    } catch (error: any) {
      toast({
        title: "Account settings update failed.",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
                <AvatarImage src={avatarPreview} alt="User avatar" />
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
                        accept={ACCEPTED_IMAGE_TYPES.join(",")}
                        onChange={(e) => {
                          handleAvatarChange(e);
                          field.onChange(e.target.files?.[0]);
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
                          placeholder={`Enter your display name`}
                          className="dark:bg-gray-700 dark:border-gray-600 dark:placeholder:text-white"
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button type="button" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  Save Changes
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will update your account settings. Are you sure you want to continue?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
                    {isSubmitting ? "Updating..." : "Confirm"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AccountForm;

