"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import MountainIcon from "../icons/mountain-icon";
import MenuIcon from "../icons/menu-icon";
import BriefcaseIcon from "../icons/briefcase-icon";
import FilePenIcon from "../icons/filepen-icon";
import BrushIcon from "../icons/brush-icon";
import DashboardSettings from "./dashboard-settings";
import { AccountData } from '@/utils/types';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { getFallBackName } from '@/utils/client-functions';

const NAV_ITEMS = [
  { href: "#", icon: BriefcaseIcon, label: "Business Plan Creator" },
  { href: "#", icon: FilePenIcon, label: "Copywrite Creator" },
  { href: "#", icon: BrushIcon, label: "Branding Creator" },
];
interface MobileNavDashboardProps {
  accountData: AccountData
}


function MobileNavDashboard({ accountData }: MobileNavDashboardProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const goToProfile = () => router.push("/dashboard/user-profile");

  const logout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      const response = await fetch("/api/logout", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      toast({ title: "Logout successful", description: "Redirecting to logout page." });
      router.push("/logout");
    } catch (err: any) {
      console.error("Logout failed:", err);
      toast({ title: "Logout failed", description: err.message || "Please try again later." });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-white dark:bg-gray-800 px-4 md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="text-gray-900 dark:bg-transparent dark:text-gray-100">
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs dark:bg-gray-900">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetDescription className="sr-only">Navigation tab for the dashboard.</SheetDescription>

          <nav className="grid gap-6 text-lg font-medium text-gray-900 dark:text-gray-100">
            <Link
              href="/dashboard"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-blue-500 dark:bg-blue-700 text-lg font-semibold text-white md:text-base"
            >
              <MountainIcon className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">StartupPlanner</span>
            </Link>
            {NAV_ITEMS.map(({ href, icon: Icon, label }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center gap-4 px-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            ))}
            <DashboardSettings sidebarOpen={true} />
          </nav>
        </SheetContent>
      </Sheet>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar>
            <AvatarImage src={accountData.avatar} className='w-10' />
            <AvatarFallback>
              {getFallBackName(accountData)}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator className="border-gray-200 dark:border-gray-700" />
          <DropdownMenuItem onClick={goToProfile}>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator className="border-gray-200 dark:border-gray-700" />
          <DropdownMenuItem onClick={logout} disabled={isLoggingOut}>
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

export default MobileNavDashboard;

