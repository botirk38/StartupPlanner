"use client";

import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import Link from "next/link";
import BriefcaseIcon from "../icons/briefcase-icon";
import FilePenIcon from "../icons/filepen-icon";
import BrushIcon from "../icons/brush-icon";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import DashboardSettings from "./dashboard-settings";

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <aside className={`hidden md:flex flex-col border-r bg-background dark:bg-gray-900 z-50 ${sidebarOpen ? "w-48" : "w-14"} transition-all duration-300`}>
      <nav className="flex flex-col items-start gap-4 px-2 sm:py-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex items-center justify-start w-full rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors  dark:bg-blue-700 dark:text-white dark:hover:bg-blue-800 p-2"
              >
                <BriefcaseIcon className="h-5 w-5" />
                {sidebarOpen && <span className="ml-2 dark:text-white">Business Plan Creator</span>}
              </Link>
            </TooltipTrigger>
            {!sidebarOpen && <TooltipContent side="right" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">Business Plan Creator</TooltipContent>}
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex items-center justify-start w-full rounded-lg dark:text-gray-100 transition-colors hover:bg-accent hover:text-accent-foreground dark:hover:bg-gray-700 p-2"
              >
                <FilePenIcon className="h-5 w-5" />
                {sidebarOpen && <span className="ml-2">Marketing Content Creator</span>}
              </Link>
            </TooltipTrigger>
            {!sidebarOpen && <TooltipContent side="right" className="bg-white dark:bg-gray-800 dark:text-gray-100">Marketing Content Creator</TooltipContent>}
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex items-center justify-start w-full rounded-lg dark:text-gray-100 transition-colors hover:bg-accent hover:text-accent-foreground dark:hover:bg-gray-700 p-2"
              >
                <BrushIcon className="h-5 w-5" />
                {sidebarOpen && <span className="ml-2">Logo Creator</span>}
              </Link>
            </TooltipTrigger>
            {!sidebarOpen && <TooltipContent side="right" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">Logo Creator</TooltipContent>}
          </Tooltip>

          <DashboardSettings sidebarOpen={sidebarOpen} />
        </TooltipProvider>
      </nav>

      <Button
        variant="ghost"
        className="absolute bottom-0 left-0 text-gray-900 dark:text-gray-100"
        onClick={toggleSidebar}
      >
        {sidebarOpen ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
      </Button>
    </aside>
  );
}

