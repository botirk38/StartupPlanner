"use client";

import { useState } from "react";
import Link from "next/link";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import BriefcaseIcon from "../icons/briefcase-icon";
import FilePenIcon from "../icons/filepen-icon";
import BrushIcon from "../icons/brush-icon";
import DashboardSettings from "./dashboard-settings";

const NAV_ITEMS = [
  { href: "#", icon: BriefcaseIcon, label: "Business Plan Creator" },
  { href: "#", icon: FilePenIcon, label: "Marketing Content Creator" },
  { href: "#", icon: BrushIcon, label: "Logo Creator" },
];

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <aside className={`hidden md:flex flex-col border-r bg-background dark:bg-gray-900 z-50 ${sidebarOpen ? "w-48" : "w-14"} transition-all duration-300`}>
      <nav className="flex flex-col items-start gap-4 px-2 sm:py-5">
        <TooltipProvider>
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => (
            <Tooltip key={label}>
              <TooltipTrigger asChild>
                <Link
                  href={href}
                  className="flex items-center justify-start w-full rounded-lg dark:text-gray-100 transition-colors hover:bg-accent hover:text-accent-foreground dark:hover:bg-gray-700 p-2"
                >
                  <Icon className="h-5 w-5" />
                  {sidebarOpen && <span className="ml-2">{label}</span>}
                </Link>
              </TooltipTrigger>
              {!sidebarOpen && (
                <TooltipContent side="right" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                  {label}
                </TooltipContent>
              )}
            </Tooltip>
          ))}
          <DashboardSettings sidebarOpen={sidebarOpen} />
        </TooltipProvider>
      </nav>

      <Button
        variant="ghost"
        className="absolute bottom-0 left-0 text-gray-900 dark:text-gray-100"
        onClick={toggleSidebar}
        aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        {sidebarOpen ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
      </Button>
    </aside>
  );
}

