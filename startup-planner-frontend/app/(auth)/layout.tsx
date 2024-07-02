import { Bricolage_Grotesque } from 'next/font/google'
import { cn } from '@/lib/utils'
import '../globals.css'
import { Toaster } from "@/components/ui/toaster";
import Logo from '@/components/ui/logo';
import { Metadata } from 'next';

const fontHeading = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
})

export const metadata: Metadata = {
  title: "Auth - Startup Planner",
  description: "Access your Startup Planner account to streamline your business planning and management, or create a new account to start using our AI-driven tools.",
  keywords: ["Login", "Register", "Startup Planner", "business planning", "entrepreneurs", "small business", "account access"],
};


export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'antialiased',
          fontHeading.className,
        )}
      >
        <Logo />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
