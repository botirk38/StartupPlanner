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
      <h1 className="text-lg font-semibold">{selectedBusiness?.name}</h1>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-2" name="switch-button">
            <ChevronDownIcon className="h-4 w-4" />
            Switch Business
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[200px]">
          <Input
            type="text"
            placeholder="Search businesses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-2"
          />
          {filteredBusinesses.map((business) => (
            <DropdownMenuItem key={business.id} onSelect={() => onSelect(business)}>
              <HomeIcon className="mr-2 h-4 w-4" />
              {business.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

