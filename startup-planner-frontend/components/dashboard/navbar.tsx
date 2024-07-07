"use client";

import MountainIcon from "../icons/mountain-icon";
import Link from "next/link";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";



function DashboardNav() {
  const router = useRouter();

  function goToProfile() {
    router.push("/dashboard/user-profile");

  }

  return (
    <header className="hidden md:flex sticky top-0 z-30 h-14 items-center justify-between border-b bg-background dark:bg-gray-900 px-4 md:px-6">
      <Link href="#" className="flex items-center gap-2">
        <MountainIcon className="h-6 w-6 dark:text-gray-100" />
        <span className="text-lg font-semibold dark:text-gray-100">BizPlanner</span>
      </Link>
      <nav className="flex items-center gap-4 dark:text-gray-100">
        <Link
          href="#"
          className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground dark:hover:bg-gray-700 dark:text-gray-100"
        >
          Business Plan Creator
        </Link>
        <Link
          href="#"
          className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground dark:hover:bg-gray-700 dark:text-gray-100"
        >
          Marketing Content Creator
        </Link>
        <Link
          href="#"
          className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground  dark:hover:bg-gray-700 dark:text-gray-100"
        >
          Logo Creator
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
              <Image
                src="/avatar-1.jpg"
                width={36}
                height={36}
                alt="Avatar"
                className="overflow-hidden rounded-full"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
            <DropdownMenuLabel className="text-gray-900 dark:text-gray-100">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="border-gray-200 dark:border-gray-700" />
            <DropdownMenuItem className="text-gray-900 dark:text-gray-100 dark:hover:bg-gray-700" onClick={() => goToProfile()}>Settings</DropdownMenuItem>
            <DropdownMenuItem className="text-gray-900 dark:text-gray-100 dark:hover:bg-gray-700">Support</DropdownMenuItem>
            <DropdownMenuSeparator className="border-gray-200 dark:border-gray-700" />
            <DropdownMenuItem className="text-gray-900 dark:text-gray-100 dark:hover:bg-gray-700">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
}

export default DashboardNav;

