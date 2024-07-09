import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
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

interface AccountFormProps {
  accountData: AccountData;
}

const AccountForm: React.FC<AccountFormProps> = ({ accountData }) => {
  const { toast } = useToast();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState(accountData.avatar);

  const accountForm = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      display_name: accountData.display_name,
      email: accountData.email,
      bio: accountData.bio,
      avatar: undefined,
    },
  });

  const onSubmitAccount: SubmitHandler<typeof accountSchema._type> = async (data) => {
    const formData = new FormData();
    formData.append("display_name", data.display_name);
    formData.append("email", data.email);
    formData.append("bio", data.bio);
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
        toast({ title: "Account settings update failed.", description: errorData });
        return;
      }

      const updatedData = await response.json();
      setAvatarUrl(updatedData.avatar);

      toast({
        title: "Account settings updated",
        description: "Your account settings have been updated successfully.",
      });
    } catch (error: any) {
      toast({ title: "Account settings update failed.", description: "Please try again later." });
    }
  };

  return (
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
            <FormField
              control={accountForm.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Avatar</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
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

