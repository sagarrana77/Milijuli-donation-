
'use client';

import { useState, useEffect, ReactNode } from 'react';
import type { Project } from '@/lib/data';
import { DonationDialog } from '@/components/projects/donation-dialog';
import { useToast } from '@/hooks/use-toast';

interface DonationDialogWrapperProps {
  project: Project;
  initialRaised: number;
  initialDonors: number;
  children: (props: {
    raisedAmount: number;
    donors: number;
    percentage: number;
    isClient: boolean;
    isDonationOpen: boolean;
    setIsDonationOpen: (open: boolean) => void;
  }) => ReactNode;
}

export function DonationDialogWrapper({
  project,
  initialRaised,
  initialDonors,
  children,
}: DonationDialogWrapperProps) {
  const [raisedAmount, setRaisedAmount] = useState(initialRaised);
  const [donors, setDonors] = useState(initialDonors);
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
      setDonors((prev) => prev + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, [project, raisedAmount]);

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

  return (
    <>
      <DonationDialog
        isOpen={isDonationOpen}
        onOpenChange={setIsDonationOpen}
        projectName={project.name}
        onDonate={handleDonation}
      />
      {children({
        raisedAmount,
        donors,
        percentage,
        isClient,
        isDonationOpen,
        setIsDonationOpen,
      })}
    </>
  );
}
