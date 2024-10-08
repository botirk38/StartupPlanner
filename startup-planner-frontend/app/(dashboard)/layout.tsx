import DashboardNav from "@/components/dashboard/navbar";
import { Bricolage_Grotesque } from 'next/font/google';
import { Syne } from 'next/font/google';
import { cn } from '@/lib/utils';
import Sidebar from "@/components/dashboard/sidebar";
import "../globals.css";
import MobileNavDashboard from "@/components/dashboard/mobile-nav-dashboard";
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
}

const fontHeading = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
});

const fontBody = Syne({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

import { getAccountData } from "@/utils/functions";
import { BusinessProvider } from "@/context/business-context";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const accountData = await getAccountData();


  return (
    <html lang="en">
      <body
        className={cn(
          'antialiased',
          fontHeading.className,
          ' dark:bg-gray-900'
        )}
      >
        <div className="flex min-h-screen w-full flex-col bg-muted/40 dark:bg-gray-900">
          <DashboardNav accountData={accountData} />
          <MobileNavDashboard accountData={accountData} />
          <div className="flex flex-1 ">
            <Sidebar />
            <div className="flex flex-1 flex-col p-4">
              <BusinessProvider>
                {children}
              </BusinessProvider>
            </div>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}

