

'use client';

import { useState, useEffect, ReactNode, createContext, useContext, useMemo } from 'react';
import type { Project, Update } from '@/lib/data';
import { DonationDialog } from '@/components/projects/donation-dialog';
import { useToast } from '@/hooks/use-toast';
import { sendThankYouEmail } from '@/ai/flows/send-thank-you-email';
import { currentUser, allDonations as initialDonations, users } from '@/lib/data';

interface DonationContextType {
  raisedAmount: number;
  donors: number;
  percentage: number;
  isClient: boolean;
  isDonationOpen: boolean;
  setIsDonationOpen: (open: boolean) => void;
  project: Project;
  allUpdates: Update[];
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
  const [allUpdates, setAllUpdates] = useState<Update[]>(() => [...project.updates].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  const [isClient, setIsClient] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const { toast } = useToast();

 useEffect(() => {
    setIsClient(true);
    // This effect re-syncs state when the underlying mutable mock data changes (e.g., from an admin action)
    setRaisedAmount(project.raisedAmount);
    setDonors(project.donors);

    const initialCombinedUpdates = [...project.updates].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setAllUpdates(initialCombinedUpdates);
    
    // The real-time simulation is now client-only
    const interval = setInterval(() => {
      const isDonation = Math.random() > 0.7; // 30% chance of donation
      if (isDonation && raisedAmount < project.targetAmount) {
        const newAmount = Math.floor(Math.random() * 150) + 20;
        const newDonorsCount = donors + 1;
        
        setRaisedAmount((prev) => Math.min(prev + newAmount, project.targetAmount));
        setDonors(newDonorsCount);
        
        const donor = users.find(u => u.id === 'user-anonymous')!;
        
        const newDonationUpdate: Update = {
          id: `update-donation-${Date.now()}`,
          title: `New Anonymous Donation!`,
          description: `${donor.name} generously donated Rs.${newAmount.toLocaleString()}.`,
          date: new Date().toISOString(),
          isMonetaryDonation: true,
          monetaryDonationDetails: {
            donorName: donor.name,
            donorAvatarUrl: donor.avatarUrl,
            donorProfileUrl: donor.profileUrl,
            amount: newAmount,
          },
        };
        
        setAllUpdates(prev => [newDonationUpdate, ...prev]);
      }
    }, 4000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.id, project.raisedAmount, project.donors, project.updates]);


  const handleDonation = async (amount: number, isAnonymous: boolean) => {
    if (!currentUser) {
        toast({
            variant: "destructive",
            title: "Please Log In",
            description: "You must be logged in to make a donation.",
        });
        return;
    }
    const newRaisedAmount = raisedAmount + amount;
    const newDonorsCount = donors + 1;
    setRaisedAmount(newRaisedAmount);
    setDonors(newDonorsCount);

    const donor = isAnonymous ? users.find(u => u.id === 'user-anonymous')! : currentUser;

    const newDonationUpdate: Update = {
      id: `update-donation-${Date.now()}`,
      title: 'New Donation Received!',
      description: `${donor.name} generously donated Rs.${amount.toLocaleString()}.`,
      date: new Date().toISOString(),
      isMonetaryDonation: true,
      monetaryDonationDetails: {
        donorName: donor.name,
        donorAvatarUrl: donor.avatarUrl,
        donorProfileUrl: donor.profileUrl,
        amount: amount,
      },
    };
    
    setAllUpdates(prev => [newDonationUpdate, ...prev]);

    // This would be a database update in a real app
    project.raisedAmount = newRaisedAmount;
    project.donors = newDonorsCount;
    project.updates.unshift(newDonationUpdate);

    toast({
      title: 'Thank You for Your Support!',
      description: `Your generous donation of Rs.${amount.toLocaleString()} will help us continue our mission.`,
      variant: 'default',
    });

    if (currentUser?.email && !isAnonymous) {
      try {
        await sendThankYouEmail({
          donorName: currentUser.name,
          amount: amount,
          projectName: project.name,
          donorEmail: currentUser.email,
        });
        toast({
          title: 'Confirmation Email Sent',
          description: 'A thank-you note has been sent to your email.',
        });
      } catch (error) {
        console.error("Failed to send thank you email:", error);
        toast({
            variant: 'destructive',
            title: 'Email Failed',
            description: 'There was an issue sending the thank-you email.',
        });
      }
    }
  };

  const percentage = Math.round(
    (raisedAmount / project.targetAmount) * 100
  );
  
  const sortedUpdates = useMemo(() => {
    return [...allUpdates].sort((a, b) => {
        if (a.isInKindDonation && !b.isInKindDonation) return -1;
        if (!a.isInKindDonation && b.isInKindDonation) return 1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [allUpdates]);

  const contextValue = {
    raisedAmount,
    donors,
    percentage,
    isClient,
    isDonationOpen,
    setIsDonationOpen,
    project,
    allUpdates: sortedUpdates,
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
