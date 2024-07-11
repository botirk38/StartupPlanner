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
  title: "Contact Us - Startup Planner",
  description: "Get in touch with the Startup Planner team for any inquiries, support, or feedback. We're here to help you streamline your business planning.",
  keywords: ["Contact", "Startup Planner", "Support", "Feedback", "Inquiries", "Business Planning"],
};


export default function ContactLayout({
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
