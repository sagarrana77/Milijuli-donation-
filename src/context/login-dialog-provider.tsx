
'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { LoginDialog } from '@/components/layout/login-dialog';

interface LoginDialogContextType {
  isOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
}

const LoginDialogContext = createContext<LoginDialogContextType | undefined>(undefined);

export function LoginDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = useCallback(() => setIsOpen(true), []);
  const closeDialog = useCallback(() => setIsOpen(false), []);

  const value = {
    isOpen,
    openDialog,
    closeDialog,
  };

  return (
    <LoginDialogContext.Provider value={value}>
      {children}
      <LoginDialog />
    </LoginDialogContext.Provider>
  );
}

export function useLoginDialog() {
  const context = useContext(LoginDialogContext);
  if (context === undefined) {
    throw new Error('useLoginDialog must be used within a LoginDialogProvider');
  }
  return context;
}
