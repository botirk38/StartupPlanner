import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(1, 'Message is required'),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const formFields = [
  { name: 'name', label: 'Name', type: 'text', placeholder: 'Enter your name' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter your email' },
  { name: 'message', label: 'Message', type: 'textarea', placeholder: 'Enter your message' },
] as const;

export default function ContactPage() {
  const { toast } = useToast();
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    try {
      const response = await fetch('/api/contact-us', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      toast({
        title: 'Success',
        description: 'Message sent successfully!',
        variant: 'default',
      });
      form.reset();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send the message. Please try again later.',
        variant: 'destructive',
      });
    }
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container grid items-center gap-6 px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Get in touch</h1>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Have a question or need assistance? Fill out the form below, and our team will get back to you as soon as possible.
          </p>
        </div>
        <div className="mx-auto w-full max-w-md">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
              {formFields.map((field) => (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name}
                  render={({ field: fieldProps }) => (
                    <FormItem>
                      <FormLabel>{field.label}</FormLabel>
                      <FormControl>
                        {field.type === 'textarea' ? (
                          <Textarea
                            placeholder={field.placeholder}
                            {...fieldProps}
                            className="min-h-[150px]"
                          />
                        ) : (
                          <Input
                            type={field.type}
                            placeholder={field.placeholder}
                            {...fieldProps}
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}

