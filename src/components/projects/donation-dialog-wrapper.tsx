
'use client';

import { useState, useEffect, ReactNode, createContext, useContext } from 'react';
import type { Project } from '@/lib/data';
import { DonationDialog } from '@/components/projects/donation-dialog';
import { useToast } from '@/hooks/use-toast';

interface DonationContextType {
  raisedAmount: number;
  donors: number;
  percentage: number;
  isClient: boolean;
  isDonationOpen: boolean;
  setIsDonationOpen: (open: boolean) => void;
  project: Project;
}

const DonationContext = createContext<DonationContextType | null>(null);

export function useDonationContext() {
    const context = useContext(DonationContext);
    if (!context) {
        throw new Error('useDonationContext must be used within a DonationDialogWrapper');
    }
    return context;
}

interface DonationDialogWrapperProps {
  project: Project;
  children: ReactNode;
}

export function DonationDialogWrapper({
  project,
  children,
}: DonationDialogWrapperProps) {
  const [raisedAmount, setRaisedAmount] = useState(project.raisedAmount);
  const [donors, setDonors] = useState(project.donors);
  const [isClient, setIsClient] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    if (raisedAmount >= project.targetAmount) {
      return;
    }

    const interval = setInterval(() => {
      setRaisedAmount((prev) => {
        const newAmount = prev + Math.floor(Math.random() * 150) + 20;
        return Math.min(newAmount, project.targetAmount);
      });
       if (Math.random() > 0.5) {
        setDonors((prev) => prev + 1);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [project.targetAmount, raisedAmount]);

  const handleDonation = (amount: number) => {
    setRaisedAmount((prev) => prev + amount);
    setDonors((prev) => prev + 1);
    toast({
      title: 'Thank You for Your Support!',
      description: `Your generous donation of $${amount} will help us continue our mission.`,
      variant: 'default',
    });
  };

  const percentage = Math.round(
    (raisedAmount / project.targetAmount) * 100
  );

  const contextValue = {
    raisedAmount,
    donors,
    percentage,
    isClient,
    isDonationOpen,
    setIsDonationOpen,
    project,
  };

  return (
    <DonationContext.Provider value={contextValue}>
      <DonationDialog
        isOpen={isDonationOpen}
        onOpenChange={setIsDonationOpen}
        projectName={project.name}
        onDonate={handleDonation}
      />
      {children}
    </DonationContext.Provider>
  );
}
