
'use client';

import { useState, useEffect, ReactNode, createContext, useContext } from 'react';
import type { Project, Donation } from '@/lib/data';
import { DonationDialog } from '@/components/projects/donation-dialog';
import { useToast } from '@/hooks/use-toast';
import { sendThankYouEmail } from '@/ai/flows/send-thank-you-email';
import { currentUser, allDonations as initialDonations } from '@/lib/data';

interface DonationContextType {
  raisedAmount: number;
  donors: number;
  percentage: number;
  isClient: boolean;
  isDonationOpen: boolean;
  setIsDonationOpen: (open: boolean) => void;
  project: Project;
  donations: Donation[];
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
  const [donations, setDonations] = useState(() => initialDonations.filter(d => d.project === project.name));
  const [isClient, setIsClient] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    // Simulate real-time donations
    const interval = setInterval(() => {
      const isDonation = Math.random() > 0.3; // 70% chance of donation
      if (isDonation && raisedAmount < project.targetAmount) {
        const newAmount = Math.floor(Math.random() * 150) + 20;
        setRaisedAmount((prev) => Math.min(prev + newAmount, project.targetAmount));
        setDonors((prev) => prev + 1);
        
        // Add a new donation to the list for real-time feel
        const newDonation: Donation = {
            id: Date.now(),
            donor: {
                id: 'user-anonymous',
                name: 'Anonymous',
                avatarUrl: 'https://images.unsplash.com/photo-1705975848221-d73d53c0119d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHBlcnNvbnxlbnwwfHx8fDE3NTg4Mzc1MTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
                profileUrl: '/profile/user-anonymous',
                bio: 'An anonymous donor making a difference.'
            },
            project: project.name,
            amount: newAmount,
            date: new Date().toISOString(),
        };
        setDonations(prev => [newDonation, ...prev]);

      }
    }, 4000);

    return () => clearInterval(interval);
  }, [project.targetAmount, raisedAmount, project.name]);


  const handleDonation = async (amount: number) => {
    if (!currentUser) {
        toast({
            variant: "destructive",
            title: "Please Log In",
            description: "You must be logged in to make a donation.",
        });
        return;
    }
    setRaisedAmount((prev) => prev + amount);
    setDonors((prev) => prev + 1);

    const newDonation: Donation = {
        id: Date.now(),
        donor: currentUser,
        project: project.name,
        amount: amount,
        date: new Date().toISOString(),
    };
    setDonations(prev => [newDonation, ...prev]);

    // This would be a database update in a real app
    const donationIndex = initialDonations.findIndex(d => d.project === project.name);
    if (donationIndex !== -1) {
        initialDonations.splice(donationIndex, 0, newDonation);
    } else {
        initialDonations.unshift(newDonation);
    }
    
    project.raisedAmount += amount;
    project.donors += 1;


    toast({
      title: 'Thank You for Your Support!',
      description: `Your generous donation of Rs.${amount.toLocaleString()} will help us continue our mission.`,
      variant: 'default',
    });

    if (currentUser?.email) {
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

  const contextValue = {
    raisedAmount,
    donors,
    percentage,
    isClient,
    isDonationOpen,
    setIsDonationOpen,
    project,
    donations,
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
