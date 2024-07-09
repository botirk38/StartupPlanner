
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { BillingData } from "@/utils/types";


const billingSchema = z.object({
  card_number: z.string().min(16, { message: "Card number must be at least 16 characters." }),
  card_expiry: z.string().min(5, { message: "Invalid expiry date." }),
  card_cvc: z.string().min(3, { message: "Invalid CVC." }),
  card_zip: z.string().min(5, { message: "Invalid zip code." }),
});
interface BillingFormProps {
  billingData: BillingData
}
const BillingForm: React.FC<BillingFormProps> = ({ billingData }) => {

  const { toast } = useToast();

  const billingForm = useForm({
    resolver: zodResolver(billingSchema),
    defaultValues: {
      card_number: billingData.card_number,
      card_expiry: billingData.card_expiry,
      card_cvc: billingData.card_cvc,
      card_zip: billingData.card_zip,
    },
  });

  const onSubmitBilling: SubmitHandler<typeof billingSchema._type> = async (data) => {

    try {

      const response = await fetch(`/api/billing`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json();
        toast({ title: "Billing settings update failed.", description: errorData.message });
        return;

      }
      toast({
        title: "Billing information updated",
        description: "Your billing information has been updated successfully.",
      });


    } catch (err: any) {
      toast({ title: "Billing settings update failed.", description: "Please try again later." });


    }
  };

  return (
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
              name="card_number"
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
              name="card_expiry"
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
              name="card_cvc"
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
              name="card_zip"
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
            <Button type="submit" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              Update Payment Method
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BillingForm;

