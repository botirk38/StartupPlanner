"use client";

import { useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "../ui/use-toast";
import MountainIcon from "../icons/mountain-icon";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AccountData } from '@/utils/types';
import { Avatar, AvatarImage } from '../ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { getFallBackName } from '@/utils/client-functions';

const NAV_ITEMS = [
  { href: "/dashboard", label: "Business Plan Creator" },
  { href: "#", label: "Marketing Content Creator" },
  { href: "#", label: "Logo Creator" },
];

interface DashboardNavProps {
  accountData: AccountData
}

function DashboardNav({ accountData }: DashboardNavProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
    <header className="hidden md:flex z-30 h-14 items-center justify-between border-b bg-background dark:bg-gray-900 px-4 md:px-6">
      <Link href="/dashboard" className="flex items-center gap-2">
        <MountainIcon className="h-6 w-6 dark:text-gray-100" />
        <span className="text-lg font-semibold dark:text-gray-100">BizPlanner</span>
      </Link>

      <nav className="flex items-center gap-4 dark:text-gray-100">
        {NAV_ITEMS.map(({ href, label }) => (
          <Link
            key={label}
            href={href}
            className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground dark:hover:bg-gray-700 dark:text-gray-100"
          >
            {label}
          </Link>
        ))}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage src={accountData.avatar} />
              <AvatarFallback>{getFallBackName(accountData)}</AvatarFallback>
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
      </nav>
    </header>
  );
}

export default DashboardNav;

