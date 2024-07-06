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
import { useRouter } from 'next/navigation';

const loginFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { toast } = useToast();
  const router = useRouter();

  const onSubmit = (values: LoginFormValues) => {
    // Handle form submission, e.g., call API
    toast({
      title: 'Success',
      description: 'You are now signed in!',
      variant: 'default',
    });
    // Reset form fields if needed
    form.reset();
  };

  const handleCanvaLogin = () => {
    console.log(process.env.NEXT_PUBLIC_API_URL);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const canvaAuthUrl = `${baseUrl}/canva/auth`;
    if (baseUrl) {
      router.push(canvaAuthUrl);
    } else {
      toast({
        title: 'Error',
        description: 'Canva login URL is not configured',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="#" className="font-medium text-primary hover:text-primary/90" prefetch={false}>
              Register
            </Link>
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox
                  id="remember-me"
                  name="remember-me"
                  className="h-4 w-4 rounded text-primary focus:ring-primary"
                />
                <FormLabel htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground">
                  Remember me
                </FormLabel>
              </div>
              <div className="text-sm">
                <Link href="#" className="font-medium text-primary hover:text-primary/90" prefetch={false}>
                  Forgot your password?
                </Link>
              </div>
            </div>
            <Button
              type="submit"
              className="flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Sign in
            </Button>
          </form>
        </Form>

        <div>
          <Button className='gap-2' onClick={handleCanvaLogin}>
            Login with
            <CanvaIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}

