"use client";

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
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';
import CanvaIcon from '@/components/icons/canva-icon';
import { handleCanvaLogin } from '@/utils/client-functions';
import { useRouter } from 'next/navigation';

const RegisterFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirm_password: z.string(),
  display_name: z.string().min(4, "Display name must be at least 4 characters."),
  rememberMe: z.boolean().optional(),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

type RegisterFormValues = z.infer<typeof RegisterFormSchema>;

const formFields = [
  { name: 'email', label: 'Email address', type: 'email', placeholder: 'you@example.com' },
  { name: 'password', label: 'Password', type: 'password', placeholder: 'Password' },
  { name: 'confirm_password', label: 'Confirm Password', type: 'password', placeholder: 'Confirm Password' },
  { name: 'display_name', label: 'Display Name', type: 'text', placeholder: 'Your Name' }
] as const;

export default function RegisterPage() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      email: '',
      password: '',
      confirm_password: '',
      display_name: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (user_data: RegisterFormValues) => {
    try {
      console.log('Form values:', user_data);

      const response = await fetch("/api/auth/register", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',

        },
        body: JSON.stringify(user_data)
      })

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Error registering: ", errorData);
        toast({
          title: 'Failure registering',
          description: 'Your account has not been created, make sure all fields are filled out correctly.',
        });

        return;

      }

      toast({
        title: 'Success',
        description: 'Your account has been created!',
        variant: 'default',
      });

      router.push('/business/create')
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Error',
        description: 'Failed to create account. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
            Sign up to StartupPlanner
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:text-primary/90">
              Log in
            </Link>
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {formFields.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name}
                render={({ field: fieldProps }) => (
                  <FormItem>
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl>
                      <Input
                        type={field.type}
                        placeholder={field.placeholder}
                        {...fieldProps}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="h-4 w-4 rounded text-primary focus:ring-primary"
                    />
                  </FormControl>
                  <FormLabel htmlFor="rememberMe" className="ml-2 block text-sm text-muted-foreground">
                    Remember me
                  </FormLabel>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Sign up
            </Button>
          </form>
        </Form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <Button className='w-full gap-2' onClick={() => handleCanvaLogin(router)} variant="outline">
          <CanvaIcon />
          Sign up with Canva
        </Button>
      </div>
    </div>
  );
}

