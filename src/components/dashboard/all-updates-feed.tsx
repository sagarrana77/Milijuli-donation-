
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Project, Update, User, Donation } from '@/lib/data';
import { getUsers } from '@/services/donations-service';
import { Skeleton } from '../ui/skeleton';
import { ArrowRight, Gift, ShoppingCart, Award } from 'lucide-react';
import { usePhotoDialog } from '@/context/image-dialog-provider';
import { allDonations as initialAllDonations } from '@/lib/data';

type UpdateWithProject = Update & {
    projectName: string;
    projectId: string;
};

interface AllUpdatesFeedProps {
    allProjects: Project[];
}

export function AllUpdatesFeed({ allProjects }: AllUpdatesFeedProps) {
  const [allUpdates, setAllUpdates] = useState<UpdateWithProject[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const { openPhoto } = usePhotoDialog();

  const topDonorIds = useMemo(() => {
    const donationTotals: Record<string, number> = {};
    initialAllDonations.forEach(donation => {
        if (!donation.donor || donation.donor.id === 'user-anonymous') return;
        if (donationTotals[donation.donor.id]) {
            donationTotals[donation.donor.id] += donation.amount;
        } else {
            donationTotals[donation.donor.id] = donation.amount;
        }
    });
    const sortedDonors = Object.keys(donationTotals).sort((a, b) => donationTotals[b] - donationTotals[a]);
    return sortedDonors.slice(0, 5);
  }, []);

  useEffect(() => {
    async function loadUsers() {
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
    }
    loadUsers();

    // Aggregate updates from all projects
    if (allProjects && Array.isArray(allProjects)) {
      const updates = allProjects.flatMap(project =>
        (project.updates || []).map(update => ({
          ...update,
          projectName: project.name,
          projectId: project.id,
        }))
      );
      // Sort by date, most recent first
      updates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setAllUpdates(updates);
    }
    setIsClient(true);
    
  }, [allProjects]);

  useEffect(() => {
    if (users.length === 0 || !allProjects || allProjects.length === 0) return;

    // Simulate real-time updates
    const interval = setInterval(() => {
        if (document.hidden) return;

        const randomProject = allProjects[Math.floor(Math.random() * allProjects.length)];
        const randomDonor = users.find(u => u.id === 'user-anonymous')!;
        const randomAmount = Math.floor(Math.random() * (5000 - 100 + 1)) + 100;
        
        if (!randomProject || !randomDonor) return;

        const newDonationUpdate: UpdateWithProject = {
            id: `rt-donation-${Date.now()}`,
            title: `New Anonymous Donation!`,
            description: `${randomDonor.name} generously donated Rs.${randomAmount.toLocaleString()}.`,
            date: new Date().toISOString(),
            isMonetaryDonation: true,
            monetaryDonationDetails: {
                donorName: randomDonor.name,
                donorAvatarUrl: randomDonor.avatarUrl,
                donorProfileUrl: randomDonor.profileUrl,
                donorId: randomDonor.id,
                amount: randomAmount,
            },
            projectName: randomProject.name,
            projectId: randomProject.id,
        };

        setAllUpdates(prev => [newDonationUpdate, ...prev].slice(0, 50)); // Keep the list from growing indefinitely

    }, 5000); // Add a new donation every 5 seconds

    return () => clearInterval(interval);
  }, [allProjects, users]);

  if (!isClient) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Live Activity Feed</CardTitle>
                <CardDescription>A real-time feed of all platform activity.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-4/5" />
                                <Skeleton className="h-3 w-1/3" />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Activity Feed</CardTitle>
        <CardDescription>A real-time feed of all platform activity.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {allUpdates.length > 0 ? (
            allUpdates.slice(0, 7).map(update => (
              <div key={update.id} className="flex items-start gap-4">
                <div className="w-10 flex-shrink-0">
                   {update.isMonetaryDonation && update.monetaryDonationDetails && (
                        <Link href={update.monetaryDonationDetails.donorProfileUrl} className="relative inline-block">
                            <Avatar className="h-10 w-10 border">
                                <AvatarImage src={update.monetaryDonationDetails.donorAvatarUrl} alt={update.monetaryDonationDetails.donorName} />
                                <AvatarFallback>{update.monetaryDonationDetails.donorName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {topDonorIds.includes(update.monetaryDonationDetails.donorId) && (
                                <div className="absolute -bottom-1 -right-1 rounded-full bg-amber-500 p-0.5 text-white border border-background">
                                    <Award className="h-3 w-3" />
                                </div>
                            )}
                        </Link>
                   )}
                   {update.isTransfer && (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <ArrowRight className="h-5 w-5" />
                        </div>
                   )}
                    {update.isExpense && (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10 text-orange-600">
                            <ShoppingCart className="h-5 w-5" />
                        </div>
                   )}
                   {update.isInKindDonation && (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 text-green-600">
                            <Gift className="h-5 w-5" />
                        </div>
                   )}
                   {update.imageUrl && (
                        <Image
                            src={update.imageUrl}
                            alt={update.title}
                            width={40}
                            height={40}
                            className="rounded-md object-cover h-10 w-10 cursor-pointer"
                            data-ai-hint={update.imageHint}
                            onClick={() => openPhoto({ imageUrl: update.imageUrl!, title: update.title })}
                        />
                   )}
                   {(!update.isMonetaryDonation && !update.isTransfer && !update.isExpense && !update.isInKindDonation && !update.imageUrl) && (
                        <Avatar className="h-10 w-10 border">
                            <AvatarFallback>{update.projectName.charAt(0)}</AvatarFallback>
                        </Avatar>
                   )}
                </div>
                <div className="flex-1">
                    <p className="text-sm">
                       {update.isMonetaryDonation && update.monetaryDonationDetails ? (
                            <>
                                <Link href={update.monetaryDonationDetails.donorProfileUrl} className="font-semibold hover:underline">{update.monetaryDonationDetails.donorName}</Link>
                                {' '}donated <span className="font-bold text-primary">Rs.{update.monetaryDonationDetails.amount.toLocaleString()}</span> to <Link href={`/projects/${update.projectId}`} className="font-semibold hover:underline">{update.projectName}</Link>.
                            </>
                       ) : (
                            <>
                                <span className="font-semibold">{update.title}</span> on <Link href={`/projects/${update.projectId}`} className="font-semibold hover:underline">{update.projectName}</Link>
                            </>
                       )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(update.date), { addSuffix: true })}
                    </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground">No platform activity yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
