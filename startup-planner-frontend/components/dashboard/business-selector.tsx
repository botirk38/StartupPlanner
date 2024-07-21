// BusinessSelector.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import ChevronDownIcon from "../icons/chevron-down-icon";
import HomeIcon from "../icons/home-icon";
import { Business } from "@/utils/types";

interface BusinessSelectorProps {
  businesses: Business[];
  selectedBusiness: Business | null;
  onSelect: (business: Business) => void;
}

export function BusinessSelector({ businesses, selectedBusiness, onSelect }: BusinessSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBusinesses = businesses.filter(business =>
    business.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex items-center gap-4">
      <h1 className="text-lg font-semibold dark:text-white">{selectedBusiness?.name}</h1>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-2 dark:bg-gray-700 dark:text-white" name="switch-button">
            <ChevronDownIcon className="h-4 w-4" />
            Switch Business
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[200px] dark:bg-gray-700">
          <Input
            type="text"
            placeholder="Search businesses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-2 dark:bg-gray-700 dark:placeholder:text-white dark:text-white"
          />
          {filteredBusinesses.map((business) => (
            <DropdownMenuItem key={business.id} onSelect={() => onSelect(business)} className="dark:text-white">
              <HomeIcon className="mr-2 h-4 w-4" />
              <p className="dark:text-white">{business.name}</p>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

