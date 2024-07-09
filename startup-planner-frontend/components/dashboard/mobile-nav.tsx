"use client";

import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import MountainIcon from "../icons/mountain-icon"
import MenuIcon from "../icons/menu-icon"
import Link from "next/link"
import BriefcaseIcon from "../icons/briefcase-icon"
import FilePenIcon from "../icons/filepen-icon"
import BrushIcon from "../icons/brush-icon"
import DashboardSettings from "./dashboard-settings";

function MobileNav() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-white dark:bg-gray-800 px-4 static h-auto border-0 bg-transparent dark:bg-transparent px-6 md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="text-gray-900 dark:bg-transparent dark:text-gray-100">
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetTitle className="hidden">Navigation</SheetTitle>
        <SheetContent side="left" className="sm:max-w-xs dark:bg-gray-900">
          <nav className="grid gap-6 text-lg font-medium text-gray-900 dark:text-gray-100">
            <Link
              href="#"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-blue-500 dark:bg-blue-700 text-lg font-semibold text-white md:text-base"
              prefetch={false}
            >
              <MountainIcon className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">Acme Inc</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-4 px-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              prefetch={false}
            >
              <BriefcaseIcon className="h-5 w-5" />
              Business Plan
            </Link>
            <Link
              href="#"
              className="flex items-center gap-4 px-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              prefetch={false}
            >
              <FilePenIcon className="h-5 w-5" />
              Copywriting
            </Link>
            <Link
              href="#"
              className="flex items-center gap-4 px-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              prefetch={false}
            >
              <BrushIcon className="h-5 w-5" />
              Branding
            </Link>

            <DashboardSettings sidebarOpen={true} />


          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}

export default MobileNav;

