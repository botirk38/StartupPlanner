"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Business } from '@/utils/types';

interface BusinessContextType {
  selectedBusiness: Business | null;
  setSelectedBusiness: (business: Business | null) => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'selectedBusiness';

function getInitialBusiness(): Business | null {
  if (typeof window === 'undefined') {
    return null; // Return null if running on the server side
  }

  try {
    const storedBusiness = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedBusiness) {
      console.log('Found stored business:', storedBusiness);
      return JSON.parse(storedBusiness) as Business;
    }
  } catch (error) {
    console.error('Failed to load business from localStorage:', error);
  }
  return null;
}

export function BusinessProvider({ children }: { children: ReactNode }) {
  const [selectedBusiness, setSelectedBusinessState] = useState<Business | null>(() => getInitialBusiness());

  useEffect(() => {
    console.log('Current selected business:', selectedBusiness);
  }, [selectedBusiness]);

  const setSelectedBusiness = (business: Business | null) => {
    console.log('Setting new business:', business);
    setSelectedBusinessState(business);
    try {
      if (business) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(business));
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to save business to localStorage:', error);
    }
  };

  const isLocalStorageAvailable = () => {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    if (!isLocalStorageAvailable()) {
      console.warn('localStorage is not available. Business selection will not persist across sessions.');
    }
  }, []);

  return (
    <BusinessContext.Provider value={{ selectedBusiness, setSelectedBusiness }}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusinessContext() {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error('useBusinessContext must be used within a BusinessProvider');
  }
  return context;
}

