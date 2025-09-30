

'use client';

import { useState, useEffect, ReactNode, createContext, useContext, useMemo } from 'react';
import type { Project, Update, Donation, PhysicalDonation } from '@/lib/data';
import { DonationDialog } from '@/components/projects/donation-dialog';
import { useToast } from '@/hooks/use-toast';
import { sendThankYouEmail } from '@/ai/flows/send-thank-you-email';
import { currentUser, allDonations as initialDonations, users, physicalDonations as initialPhysicalDonations } from '@/lib/data';
import { useNotifications } from '@/context/notification-provider';

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
  users: typeof users;
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
  const [donations, setDonations] = useState<Donation[]>(() => (initialDonations.filter(d => d.project === project.name) || []));
  const [physicalDonations, setPhysicalDonations] = useState<PhysicalDonation[]>(() => initialPhysicalDonations);
  const [isClient, setIsClient] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const { toast } = useToast();
  const { addNotification } = useNotifications();


 useEffect(() => {
    setIsClient(true);
    // This effect re-syncs state when the underlying mutable mock data changes (e.g., from an admin action)
    const confirmedDonations = initialDonations.filter(d => d.project === project.name && d.status === 'confirmed') || [];
    setRaisedAmount(confirmedDonations.reduce((acc, d) => acc + d.amount, 0));
    setDonors(new Set(confirmedDonations.map(d => d.donor.id)).size);

    setDonations(initialDonations.filter(d => d.project === project.name) || []);
    setPhysicalDonations(initialPhysicalDonations);

    const initialCombinedUpdates = [...project.updates].sort((a, b) => {
        // Complex sorting logic will be handled in useMemo
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    setAllUpdates(initialCombinedUpdates);
    
    // This simulation is for demonstration and doesn't affect the actual data state used by the admin panel.
    if (typeof window !== 'undefined') {
        const interval = setInterval(() => {
        if(document.hidden) return;
        const totalSpent = project.expenses.reduce((acc, exp) => acc + exp.amount, 0);
        const currentRaised = initialDonations
            .filter(d => d.project === project.name && d.status === 'confirmed')
            .reduce((acc, d) => acc + d.amount, 0);
        const availableFunds = currentRaised - totalSpent;

        const isDonation = Math.random() > 0.7;
        if (isDonation && availableFunds < project.targetAmount) {
            const newAmount = Math.floor(Math.random() * 150) + 20;
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
                donorId: donor.id,
                amount: newAmount,
              },
            };
            setAllUpdates(prev => [newDonationUpdate, ...prev]);

             const newDonationEntry: Donation = {
              id: Date.now().toString(),
              donor: donor,
              project: project.name,
              amount: newAmount,
              date: new Date().toISOString(),
              isAnonymous: true,
              status: 'confirmed',
              paymentMethod: 'Card',
            }
            setDonations(prev => [newDonationEntry, ...prev]);
            setRaisedAmount(prev => prev + newAmount);
            // This is just a visual update for the donor count on the client
            setDonors(prev => prev + 1);
        }
        }, 8000);

        return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.id, project.raisedAmount, project.donors, project.updates]);


  const handleDonation = async (amount: number, isAnonymous: boolean, paymentMethod: 'QR' | 'Card' | 'Bank') => {
    // This function is now mostly for showing the initial "pending" toast.
    // The actual state update will happen when an admin confirms the donation.
    if (!currentUser) {
        toast({
            variant: "destructive",
            title: "Please Log In",
            description: "You must be logged in to make a donation.",
        });
        return;
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
    donations: donations,
    physicalDonations,
    users,
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
