"use client";

import React from 'react';
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import MountainIcon from "../icons/mountain-icon";
import MenuIcon from "../icons/menu-icon";
import BriefcaseIcon from "../icons/briefcase-icon";
import FilePenIcon from "../icons/filepen-icon";
import { ContactIcon } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const homeNavItems: NavItem[] = [
  { href: "#features", label: "Features", icon: BriefcaseIcon },
  { href: "#about", label: "About", icon: FilePenIcon },
  { href: "/contact", label: "Contact", icon: ContactIcon },
];

const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const goToLogin = () => router.push("/login");

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-white dark:bg-gray-800 p-2 md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="text-gray-900 dark:bg-transparent dark:text-gray-100">
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs dark:bg-gray-900">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <nav className="grid gap-6 text-lg font-medium text-gray-900 dark:text-gray-100">
            <Link
              href="/"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-blue-500 dark:bg-blue-700 text-lg font-semibold text-white md:text-base"
            >
              <MountainIcon className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">StartupPlanner</span>
            </Link>

            {pathname === '/' && homeNavItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-4 px-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <Button onClick={goToLogin}>Log in</Button>
    </header>
  );
};

export default MobileNav;

