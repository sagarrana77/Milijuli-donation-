
'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { PricingDialog } from '@/components/ui/pricing-dialog';

interface PricingDialogContextType {
  isOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  onPurchase: (credits: number) => void;
}

const PricingDialogContext = createContext<PricingDialogContextType | undefined>(undefined);

export function PricingDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  // This is a dummy state to trigger re-renders on purchase
  const [, setPurchaseCount] = useState(0);

  const openDialog = useCallback(() => setIsOpen(true), []);
  const closeDialog = useCallback(() => setIsOpen(false), []);

  const onPurchase = useCallback(() => {
    // This will force components consuming the credits to re-render
    setPurchaseCount(prev => prev + 1);
  }, []);

  const value = {
    isOpen,
    openDialog,
    closeDialog,
    onPurchase,
  };

  return (
    <PricingDialogContext.Provider value={value}>
      {children}
      <PricingDialog />
    </PricingDialogContext.Provider>
  );
}

export function usePricingDialog() {
  const context = useContext(PricingDialogContext);
  if (context === undefined) {
    throw new Error('usePricingDialog must be used within a PricingDialogProvider');
  }
  return context;
}
