"use client";

import React, { useState, useEffect } from "react";
import { BusinessSelector } from "./dashboard/business-selector";
import { BusinessActions } from "./dashboard/business-action";
import { BusinessFormDialog } from "./dashboard/business-form-dialog";

import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Business, NewBusiness } from "@/utils/types";
import { StartupOverview } from "./dashboard/startup-overview";
import { QuickActions } from "./dashboard/quick-actions";
import { useBusinessContext } from "@/context/business-context";

export function Dashboard() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const { selectedBusiness, setSelectedBusiness } = useBusinessContext();




  useEffect(() => {

    console.log("Selected Business: ", selectedBusiness);
  }, [selectedBusiness])

  useEffect(() => {
    loadBusinesses();
  }, []);


  const loadBusinesses = async () => {
    try {
      const response = await fetch('/api/businesses');
      if (!response.ok) throw new Error('Failed to fetch businesses');
      const fetchedBusinesses: Business[] = await response.json();
      setBusinesses(fetchedBusinesses);
      console.log("Businesses", businesses);
      if (fetchedBusinesses.length > 0) {
        setSelectedBusiness(fetchedBusinesses[0]);
      }
      console.log("loading false")
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch businesses:", error);
      toast({ title: "Error", description: "Failed to load businesses.", variant: "destructive" });
      setIsLoading(false);
      setError("Failed to load businesses.")
    }
  };

  const handleBusinessSelect = (business: Business) => {
    setSelectedBusiness(business);
  };

  const handleBusinessUpdate = async (updatedBusiness: Business) => {
    try {
      const id = updatedBusiness.id;
      const response = await fetch(`/api/businesses/${id}`, {

        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBusiness),
      });
      if (!response.ok) throw new Error('Failed to update business');
      const result: Business = await response.json();
      setBusinesses(businesses.map(b => b.id === result.id ? result : b));
      setSelectedBusiness(result);
      setIsFormDialogOpen(false);
      toast({ title: "Success", description: "Business details updated successfully." });
    } catch (error) {
      console.error("Failed to update business:", error);
      toast({ title: "Error", description: "Failed to update business.", variant: "destructive" });
    }
  };

  const handleBusinessCreate = async (newBusiness: NewBusiness) => {
    try {
      const response = await fetch('/api/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBusiness),
      });
      if (!response.ok) throw new Error('Failed to create business');
      const createdBusiness: Business = await response.json();
      setBusinesses([...businesses, createdBusiness]);
      setSelectedBusiness(createdBusiness);
      setIsFormDialogOpen(false);
      toast({ title: "Success", description: "New business created successfully." });
    } catch (error) {
      console.error("Failed to create business:", error);
      toast({ title: "Error", description: "Failed to create business.", variant: "destructive" });
    }
  };

  const handleBusinessDelete = async () => {
    if (selectedBusiness) {
      try {
        const response = await fetch(`/api/businesses/${selectedBusiness.id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete business');
        const updatedBusinesses = businesses.filter(b => b.id !== selectedBusiness.id);
        setBusinesses(updatedBusinesses);
        setSelectedBusiness(updatedBusinesses[0] || null);
        toast({ title: "Success", description: "Business deleted successfully." });
      } catch (error) {
        console.error("Failed to delete business:", error);
        toast({ title: "Error", description: "Failed to delete business.", variant: "destructive" });
      }
    }
  };




  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <main className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 dark:bg-gray-900">
      <div className="flex flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 md:gap-10 mb-6">
        <BusinessSelector
          businesses={businesses}
          selectedBusiness={selectedBusiness}
          onSelect={handleBusinessSelect}
        />
        <BusinessActions
          onEdit={() => setIsFormDialogOpen(true)}
          onDelete={handleBusinessDelete}
          onCreateNew={() => {
            setSelectedBusiness(null);
            setIsFormDialogOpen(true);
          }}
          selectedBusiness={selectedBusiness}
        />
      </div>

      {selectedBusiness ? (
        <div className="space-y-6 sm:space-y-8">
          <QuickActions business={selectedBusiness} />
          <StartupOverview business={selectedBusiness} />
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-8">
          <QuickActions business={selectedBusiness} />
        </div>


      )}

      <BusinessFormDialog
        isOpen={isFormDialogOpen}
        onClose={() => setIsFormDialogOpen(false)}
        business={selectedBusiness}
        onUpdate={handleBusinessUpdate}
        onCreate={handleBusinessCreate}
      />
    </main>
  );
}
