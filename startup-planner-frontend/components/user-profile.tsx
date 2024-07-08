"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { AccountData } from "@/utils/types";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, Label } from "@radix-ui/react-dropdown-menu";

// Schema for Account Form
const accountSchema = z.object({
  display_name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  bio: z.string().optional(),
});

// Schema for Billing Form
const billingSchema = z.object({
  cardNumber: z.string().min(16, {
    message: "Card number must be at least 16 characters.",
  }),
  cardExpiry: z.string().min(5, {
    message: "Invalid expiry date.",
  }),
  cardCVC: z.string().min(3, {
    message: "Invalid CVC.",
  }),
  cardZip: z.string().min(5, {
    message: "Invalid zip code.",
  }),
});

// Schema for Security Form
const securitySchema = z.object({
  currentPassword: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  newPassword: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  confirmPassword: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});


interface UserProfileProps {
  accountData: AccountData;
}

export function UserProfile({ accountData }: UserProfileProps) {
  const { toast } = useToast();

  const accountForm = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      display_name: accountData.display_name,
      email: accountData.email,
      bio: accountData.bio
    },
  });

  const billingForm = useForm({
    resolver: zodResolver(billingSchema),
    defaultValues: {
      cardNumber: "4111 1111 1111 1111",
      cardExpiry: "12/24",
      cardCVC: "123",
      cardZip: "90210"
    },
  });

  const securityForm = useForm({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmitAccount: SubmitHandler<typeof accountSchema._type> = async (data) => {
    console.log("Account Data Submitted:", data);

    try {

      const response = await fetch("/api/account", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json();

        toast({
          title: "Account settings update failed.",
          description: errorData,
        });
      }

      toast({
        title: "Account settings updated",
        description: "Your account settings have been updated successfully.",
      });
    }
    catch (error: any) {
      toast({
        title: "Account settings update failed.",
        description: "Please try again later.",
      });

      console.log("Error: ", error);
    }
  };

  const onSubmitBilling: SubmitHandler<typeof billingSchema._type> = (data) => {
    console.log("Billing Data Submitted:", data);
    toast({
      title: "Billing information updated",
      description: "Your billing information has been updated successfully.",
    });
  };

  const onSubmitSecurity: SubmitHandler<typeof securitySchema._type> = (data) => {
    console.log("Security Data Submitted:", data);
    toast({
      title: "Security settings updated",
      description: "Your security settings have been updated successfully.",
    });
  };

  return (
    <div className="flex flex-col min-h-dvh dark:bg-gray-900 dark:text-white">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b dark:border-gray-700 px-4 sm:static sm:h-auto sm:border-0 sm:px-6">
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-9 w-9">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>JP</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className="dark:bg-white dark:text-gray-800 rounded-lg p-1 ml-6 mt-4">
                <Label>
                  <span>Upload Avatar</span>
                </Label>
                <Input id="avatar-upload" type="file" accept="image/*" className="sr-only" />

              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="grid gap-0.5">
            <div className="font-medium">{accountData.display_name}</div>
            <div className="text-xs text-muted-foreground dark:text-gray-400">{accountData.email}</div>
          </div>
        </div>
      </header>
      <main className="flex-1 p-3 md:p-8">
        <Tabs defaultValue="account" className="w-full max-w-3xl mx-auto py-8">
          <TabsList className="border-b dark:border-gray-700 dark:bg-gray-700">
            <TabsTrigger value="account" className="dark:text-gray-200 dark:hover:bg-white dark:hover:text-black dark:active:hover:text-white">Account</TabsTrigger>
            <TabsTrigger value="billing" className="dark:text-gray-200 dark:hover:bg-white dark:hover:text-black dark:active:hover:text-white">Billing</TabsTrigger>
            <TabsTrigger value="security" className="dark:text-gray-200 dark:hover:bg-white dark:hover-text-black dark:active:hover:text-white">Security</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card className="mt-6 dark:bg-gray-800 dark:text-white">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription className="dark:text-white">Update your personal information and preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Form {...accountForm}>
                  <form onSubmit={accountForm.handleSubmit(onSubmitAccount)} className="space-y-8">
                    <FormField
                      control={accountForm.control}
                      name="display_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Name" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:placeholder:text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={accountForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Email" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:placeholder:text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={accountForm.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Bio" {...field} className="min-h-[120px] dark:bg-gray-700 dark:border-gray-600 dark:placeholder:text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">Save Changes</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="billing">
            <Card className="mt-6 dark:bg-gray-800 dark:text-white">
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
                <CardDescription className="text-white">Update your payment method and billing details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Form {...billingForm}>
                  <form onSubmit={billingForm.handleSubmit(onSubmitBilling)} className="space-y-8">
                    <FormField
                      control={billingForm.control}
                      name="cardNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Card Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Card Number" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:placeholder:text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={billingForm.control}
                      name="cardExpiry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiry Date</FormLabel>
                          <FormControl>
                            <Input placeholder="MM/YY" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:placeholder:text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={billingForm.control}
                      name="cardCVC"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CVC</FormLabel>
                          <FormControl>
                            <Input placeholder="CVC" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:placeholder:text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={billingForm.control}
                      name="cardZip"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zip Code</FormLabel>
                          <FormControl>
                            <Input placeholder="Zip Code" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:placeholder:text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">Update Payment Method</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="security">
            <Card className="mt-6 dark:bg-gray-800 dark:text-white">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription className="text-white">Update your password and two-factor authentication.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Form {...securityForm}>
                  <form onSubmit={securityForm.handleSubmit(onSubmitSecurity)} className="space-y-8">
                    <FormField
                      control={securityForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input placeholder="Current Password" type="password" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:placeholder:text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={securityForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input placeholder="New Password" type="password" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:placeholder:text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={securityForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input placeholder="Confirm Password" type="password" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:placeholder:text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="dark:bg-gray-700 dark:border-gray-600 dark:placeholder:text-white">Update Security Settings</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default UserProfile;

