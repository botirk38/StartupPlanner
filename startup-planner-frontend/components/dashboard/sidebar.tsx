"use client";

import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import Link from "next/link";
import BriefcaseIcon from "../icons/briefcase-icon";
import FilePenIcon from "../icons/filepen-icon";
import BrushIcon from "../icons/brush-icon";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <aside className={`hidden md:flex flex-col border-r bg-background z-50 ${sidebarOpen ? "w-48" : "w-14"} transition-all duration-300`}>
      <nav className="flex flex-col items-start gap-4 px-2 sm:py-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex items-center justify-start w-full rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground p-2"
              >
                <BriefcaseIcon className="h-5 w-5" />
                {sidebarOpen && <span className="ml-2">Business Plan Creator</span>}
              </Link>
            </TooltipTrigger>
            {!sidebarOpen && <TooltipContent side="right">Business Plan Creator</TooltipContent>}
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex items-center justify-start w-full rounded-lg text-muted-foreground transition-colors hover:text-foreground p-2"
              >
                <FilePenIcon className="h-5 w-5" />
                {sidebarOpen && <span className="ml-2">Marketing Content Creator</span>}
              </Link>
            </TooltipTrigger>
            {!sidebarOpen && <TooltipContent side="right">Marketing Content Creator</TooltipContent>}
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex items-center justify-start w-full rounded-lg text-muted-foreground transition-colors hover:text-foreground p-2"
              >
                <BrushIcon className="h-5 w-5" />
                {sidebarOpen && <span className="ml-2">Logo Creator</span>}
              </Link>
            </TooltipTrigger>
            {!sidebarOpen && <TooltipContent side="right">Logo Creator</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
      </nav>

      <Button
        variant="ghost"
        className="absolute bottom-0 left-0"
        onClick={toggleSidebar}
      >
        {sidebarOpen ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
      </Button>
    </aside>
  );
}

