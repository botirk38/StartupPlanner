

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
});

interface SecurityFormProps {

}

const SecurityForm: React.FC<SecurityFormProps> = () => {
  const { toast } = useToast();

  const securityForm = useForm({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const onSubmitSecurity: SubmitHandler<typeof securitySchema._type> = async (data) => {

    try {

      const response = await fetch("/api/security", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {

        toast({
          title: "Security settings failed to update.",
          description: "Please make sure that all the details entered are correct.",
        });
        return;
      }

      toast({
        title: "Security settings updated",
        description: "Your security settings have been updated successfully.",
      });
    } catch (err: any) {
      toast({
        title: "Security settings failed to update.",
        description: "Please try again later.",
      });


    }
  };

  return (
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
              name="current_password"
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
              name="new_password"
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
              name="confirm_password"
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
            <Button type="submit" className="dark:bg-gray-700 dark:border-gray-600 dark:placeholder:text-white">
              Update Security Settings
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SecurityForm;

