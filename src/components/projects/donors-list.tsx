
'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { useDonationContext } from './donation-dialog-wrapper';
import { Pagination } from '../ui/pagination';
import type { Donation } from '@/lib/data';

interface DonorsListProps {
    donations?: Donation[];
}

const ITEMS_PER_PAGE = 5;

export function DonorsList({ donations: donationsProp }: DonorsListProps) {
  const context = useDonationContext();
  // Use donations from props if provided, otherwise fall back to context
  const donations = donationsProp || context.donations;

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(donations.length / ITEMS_PER_PAGE);
  const paginatedDonations = donations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <Card className="bg-blue-500/5 border-blue-500/10">
        <CardHeader>
            <CardTitle>All Donors</CardTitle>
        </CardHeader>
        <CardContent>
            {paginatedDonations.length > 0 ? (
            <ul className="space-y-4">
                {paginatedDonations.map((donation) => (
                <li key={donation.id} className="flex items-center justify-between gap-4 rounded-md border bg-card p-3">
                    <Link href={donation.donor.profileUrl} className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border">
                            <AvatarImage src={donation.donor.avatarUrl} alt={donation.donor.name} />
                            <AvatarFallback>{donation.donor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
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
                ))}
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
  );
}
