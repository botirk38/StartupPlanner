import React from "react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Business } from "@/utils/types";
import { Menu } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface BusinessActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  onCreateNew: () => void;
  selectedBusiness: Business | null;
}

export function BusinessActions({ onEdit, onDelete, onCreateNew, selectedBusiness }: BusinessActionsProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {/* Mobile view */}
      <div className="sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {selectedBusiness && (
              <>
                <DropdownMenuItem onClick={onEdit}>Edit Business</DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="text-red-600">Delete Business</DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem onClick={onCreateNew}>Create New Business</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop view */}
      <div className="hidden sm:flex items-center gap-2">
        {selectedBusiness && (
          <>
            <Button variant="outline" size="sm" onClick={onEdit}>
              Edit Business
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  Delete Business
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the business and all its data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
        <Button variant="outline" size="sm" onClick={onCreateNew}>
          Create New Business
        </Button>
      </div>
    </div>
  );
}

