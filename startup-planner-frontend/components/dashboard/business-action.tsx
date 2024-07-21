import React from "react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Business } from "@/utils/types";
import { Menu, Edit, Trash2, Plus } from "lucide-react";
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
            <Button variant="outline" size="icon" className="dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
              <Menu className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:text-white">
            {selectedBusiness && (
              <>
                <DropdownMenuItem onClick={onEdit} className="dark:hover:bg-gray-700">
                  <Edit className="mr-2 h-4 w-4" /> Edit Business
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="text-red-600 dark:text-red-400 dark:hover:bg-gray-700">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Business
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem onClick={onCreateNew} className="dark:hover:bg-gray-700">
              <Plus className="mr-2 h-4 w-4" /> Create New Business
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop view */}
      <div className="hidden sm:flex items-center gap-2">
        {selectedBusiness && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            >
              <Edit className="mr-2 h-4 w-4" /> Edit Business
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Business
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="dark:bg-gray-800 dark:text-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription className="dark:text-gray-300">
                    This action cannot be undone. This will permanently delete the business and all its data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete} className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600">Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={onCreateNew}
          className="dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
        >
          <Plus className="mr-2 h-4 w-4" /> Create New Business
        </Button>
      </div>
    </div>
  );
}

