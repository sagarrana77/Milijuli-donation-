
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import Link from 'next/link';
import { Sparkles, Award } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { useDonationContext } from './donation-dialog-wrapper';
import type { Donation, Donor } from '@/lib/data';
import { Pagination } from '../ui/pagination';
import { HallOfFameDonors } from './hall-of-fame-donors';

interface DonorsListProps {
    donations?: Donation[];
}

const ITEMS_PER_PAGE = 10;

// A small helper hook to safely use the context.
const useSafeDonationContext = () => {
    try {
        return useDonationContext();
    } catch (e) {
        return null;
    }
}

export function DonorsList({ donations: donationsProp }: DonorsListProps) {
  const context = useSafeDonationContext();
  // Use donations from props if provided, otherwise fall back to context
  const donations = donationsProp || context?.donations || [];
  const [currentPage, setCurrentPage] = useState(1);
  
  const topDonorIds = useMemo(() => {
    const donationTotals: Record<string, number> = {};

    donations.forEach(donation => {
        if (!donation.donor || donation.donor.id === 'user-anonymous') return;

        if (donationTotals[donation.donor.id]) {
            donationTotals[donation.donor.id] += donation.amount;
        } else {
            donationTotals[donation.donor.id] = donation.amount;
        }
    });

    const sortedDonors = Object.keys(donationTotals).sort((a, b) => donationTotals[b] - donationTotals[a]);
    return sortedDonors.slice(0, 5);
  }, [donations]);


  const totalPages = Math.ceil(donations.length / ITEMS_PER_PAGE);
  const paginatedDonations = donations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
        <HallOfFameDonors donations={donations} />
        <Card className="bg-blue-500/5 border-blue-500/10">
            <CardHeader>
                <CardTitle>All Donors</CardTitle>
            </CardHeader>
            <CardContent>
                {donations.length > 0 ? (
                <ul className="space-y-4">
                    {paginatedDonations.map((donation) => {
                        const isTopDonor = topDonorIds.includes(donation.donor.id);
                        return (
                            <li key={donation.id} className="flex items-center justify-between gap-4 rounded-md border bg-card p-3">
                                <Link href={donation.donor.profileUrl} className="flex items-center gap-3">
                                    <div className="relative">
                                        <Avatar className="h-10 w-10 border">
                                            <AvatarImage src={donation.donor.avatarUrl} alt={donation.donor.name} />
                                            <AvatarFallback>{donation.donor.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                         {isTopDonor && (
                                            <div className="absolute -bottom-1 -right-1 rounded-full bg-amber-500 p-0.5 text-white border border-background">
                                                <Award className="h-3 w-3" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1.5">
                                        <p className="font-semibold">{donation.donor.name}</p>
                                        {donation.donor.isProMember && (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <Sparkles className="h-4 w-4 text-primary" />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Pro Member</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                        )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">{format(new Date(donation.date), 'PPP')}</p>
                                    </div>
                                </Link>
                                <p className="font-bold text-lg text-primary">Rs.{donation.amount.toLocaleString()}</p>
                            </li>
                        )
                    })}
                </ul>
                ) : (
                <p className="text-center text-muted-foreground">
                    No donations for this project yet. Be the first!
                </p>
                )}
            </CardContent>
            {totalPages > 1 && (
                <CardFooter>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </CardFooter>
            )}
        </Card>
    </div>
  );
}
