
'use client';

import { useMemo } from 'react';
import type { User, PhysicalDonation } from '@/lib/data';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';

interface AllInKindDonorsProps {
  donors: User[];
  allDonations: PhysicalDonation[];
}

export function AllInKindDonors({ donors, allDonations }: AllInKindDonorsProps) {
  const donorStats = useMemo(() => {
    return donors.map(donor => {
      const donations = allDonations.filter(d => d.donorId === donor.id);
      const totalItems = donations.reduce((acc, d) => acc + d.quantity, 0);
      const lastDonationDate = donations.length > 0
        ? new Date(Math.max(...donations.map(d => new Date(d.date).getTime())))
        : null;

      return {
        ...donor,
        totalItems,
        lastDonationDate
      };
    }).sort((a, b) => b.totalItems - a.totalItems);
  }, [donors, allDonations]);

  if (donorStats.length === 0) {
    return (
      <div className="py-24 text-center text-muted-foreground">
        <p>No one has made an in-kind donation yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {donorStats.map(donor => (
        <Card key={donor.id} className="p-4 transition-all hover:shadow-md">
            <Link href={donor.profileUrl} className="flex items-center gap-4">
                 <div className="relative">
                    <Avatar className="h-16 w-16 border">
                        <AvatarImage src={donor.avatarUrl} alt={donor.name} />
                        <AvatarFallback>{donor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                </div>
                <div className="flex-1">
                    <p className="font-bold text-lg">{donor.name}</p>
                    <p className="text-sm text-muted-foreground">
                        Donated <span className="font-semibold text-primary">{donor.totalItems}</span> {donor.totalItems > 1 ? 'items' : 'item'}
                    </p>
                    {donor.lastDonationDate && (
                        <p className="text-xs text-muted-foreground">
                            Last donation: {donor.lastDonationDate.toLocaleDateString()}
                        </p>
                    )}
                </div>
            </Link>
        </Card>
      ))}
    </div>
  );
}
