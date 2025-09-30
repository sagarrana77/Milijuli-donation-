

'use client';

import { useState, useEffect, ReactNode, createContext, useContext, useMemo } from 'react';
import type { Project, Update, Donation, PhysicalDonation } from '@/lib/data';
import { DonationDialog } from '@/components/projects/donation-dialog';
import { useToast } from '@/hooks/use-toast';
import { sendThankYouEmail } from '@/ai/flows/send-thank-you-email';
import { currentUser, allDonations as initialDonations, users, physicalDonations as initialPhysicalDonations } from '@/lib/data';

interface DonationContextType {
  raisedAmount: number;
  donors: number;
  percentage: number;
  isClient: boolean;
  isDonationOpen: boolean;
  setIsDonationOpen: (open: boolean) => void;
  project: Project;
  allUpdates: Update[];
  donations: Donation[];
  physicalDonations: PhysicalDonation[];
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
  const [allDonations, setAllDonations] = useState<Donation[]>(() => (initialDonations.filter(d => d.project === project.name) || []));
  const [physicalDonations, setPhysicalDonations] = useState<PhysicalDonation[]>(() => initialPhysicalDonations);
  const [isClient, setIsClient] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const { toast } = useToast();

 useEffect(() => {
    setIsClient(true);
    // This effect re-syncs state when the underlying mutable mock data changes (e.g., from an admin action)
    setRaisedAmount(project.raisedAmount);
    setDonors(project.donors);
    setAllDonations(initialDonations.filter(d => d.project === project.name) || [])
    setPhysicalDonations(initialPhysicalDonations);

    const initialCombinedUpdates = [...project.updates].sort((a, b) => {
        // Complex sorting logic will be handled in useMemo
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    setAllUpdates(initialCombinedUpdates);
    
    if (typeof window !== 'undefined') {
        const interval = setInterval(() => {
        if(document.hidden) return;
        const totalSpent = project.expenses.reduce((acc, exp) => acc + exp.amount, 0);
        const availableFunds = raisedAmount - totalSpent;
        const isDonation = Math.random() > 0.7; // 30% chance of donation
        if (isDonation && availableFunds < project.targetAmount) {
            const newAmount = Math.floor(Math.random() * 150) + 20;
            
            setRaisedAmount((prev) => Math.min(prev + newAmount, project.targetAmount));
            setDonors((prev) => prev + 1);
            
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

            const newDonationEntry: Donation = {
                id: Date.now(),
                donor: donor,
                project: project.name,
                amount: newAmount,
                date: new Date().toISOString(),
                isAnonymous: true,
            }
            setAllDonations(prev => [newDonationEntry, ...prev]);
        }
        }, 4000);

        return () => clearInterval(interval);
    }
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

    setRaisedAmount((prev) => prev + amount);
    setDonors((prev) => prev + 1);

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
    project.raisedAmount += amount;
    project.donors += 1;
    project.updates.unshift(newDonationUpdate);
    
    const newDonationEntry: Donation = {
        id: Date.now(),
        donor: donor,
        project: project.name,
        amount: amount,
        date: new Date().toISOString(),
        isAnonymous: isAnonymous,
    }
    initialDonations.unshift(newDonationEntry);
    setAllDonations(prev => [newDonationEntry, ...prev]);


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
  
  const totalSpent = project.expenses.reduce((acc, exp) => acc + exp.amount, 0);
  const availableFunds = raisedAmount - totalSpent;
  const percentage = Math.round(
    (availableFunds / project.targetAmount) * 100
  );
  
  const sortedUpdates = useMemo(() => {
    return [...allUpdates].sort((a, b) => {
        const aDate = new Date(a.date).getTime();
        const bDate = new Date(b.date).getTime();

        // Pinned updates first
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;

        // Image updates second
        if (a.imageUrl && !b.imageUrl) return -1;
        if (!a.imageUrl && b.imageUrl) return 1;

        // In-kind donations third
        if (a.isInKindDonation && !b.isInKindDonation) return -1;
        if (!a.isInKindDonation && b.isInKindDonation) return 1;

        // Then sort by date
        return bDate - aDate;
    });
  }, [allUpdates]);

  const contextValue = {
    raisedAmount: availableFunds,
    donors,
    percentage,
    isClient,
    isDonationOpen,
    setIsDonationOpen,
    project,
    allUpdates: sortedUpdates,
    donations: allDonations,
    physicalDonations,
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
