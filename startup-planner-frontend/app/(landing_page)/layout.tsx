import type { Metadata } from "next";
import { Bricolage_Grotesque } from 'next/font/google'
import { Syne } from 'next/font/google'
import { cn } from '@/lib/utils'
import '../globals.css'
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/landing-page/navbar";
import MobileNav from "@/components/landing-page/mobile-nav";

const fontHeading = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
})

const fontBody = Syne({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: "Startup Planner - AI-Driven Tool for Entrepreneurs",
  description: "Discover Startup Planner, the AI-driven tool designed for entrepreneurs and small business owners to streamline business planning, branding, and marketing. Sign up today to elevate your startup success.",
  keywords: ["Startup Planner", "AI-driven tool", "business planning", "entrepreneurs", "small business", "branding", "marketing", "business tools"],
}

export default function RootLayout({
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
        <Navbar />
        <MobileNav />


        {children}
        <Toaster />
      </body>
    </html>
  );
}
