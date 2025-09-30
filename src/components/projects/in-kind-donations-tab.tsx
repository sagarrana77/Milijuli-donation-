

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useDonationContext } from '@/components/projects/donation-dialog-wrapper';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePhotoDialog } from '@/context/image-dialog-provider';
import { useMemo } from 'react';
import { allDonations as initialAllDonations } from '@/lib/data';
import { Award } from 'lucide-react';

// This component is now client-side only and receives all data via context.
export function InKindDonationsTab() {
  const { project, physicalDonations, users } = useDonationContext();
  const { openPhoto } = usePhotoDialog();

  const completedDonations = physicalDonations.filter(
    (d) => d.projectId === project.id && d.status === 'Completed'
  );

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

  if (completedDonations.length === 0) {
    return (
      <Card className="bg-green-500/5 border-green-500/10">
        <CardContent className="p-6 text-center text-muted-foreground">
          This project has not received any in-kind donations yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-green-500/5 border-green-500/10">
      <CardContent className="p-4 md:p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {completedDonations.map((donation) => {
            const wishlistItem = project.wishlist.find(
              (w) => w.name === donation.itemName
            );
            const donor = users.find((u) => u.id === donation.donorId);

            if (!wishlistItem || !donor) return null;

            const imageUrl =
              wishlistItem.imageUrl ||
              'https://picsum.photos/seed/placeholder/400/300';
            
            const isTopDonor = topDonorIds.includes(donor.id);

            return (
              <Card
                key={donation.id}
                className="overflow-hidden transition-shadow hover:shadow-lg"
              >
                <div
                  className="cursor-pointer"
                  onClick={() =>
                    openPhoto({
                      imageUrl,
                      imageAlt: wishlistItem.name,
                      title: `${donation.quantity}x ${donation.itemName}`,
                      donor,
                      project,
                      comments: [],
                    })
                  }
                >
                  <Image
                    src={imageUrl}
                    alt={wishlistItem.name}
                    width={400}
                    height={300}
                    className="aspect-video w-full object-cover"
                    data-ai-hint={wishlistItem.imageHint}
                  />
                  <CardContent className="p-4">
                    <p className="font-semibold">
                      {donation.quantity}x {donation.itemName}
                    </p>
                  </CardContent>
                </div>
                <div className="border-t p-4">
                  <Link
                    href={donor.profileUrl}
                    className="flex w-full items-center gap-3"
                  >
                    <div className="relative">
                        <Avatar className="h-9 w-9 border">
                        <AvatarImage src={donor.avatarUrl} alt={donor.name} />
                        <AvatarFallback>{donor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {isTopDonor && (
                            <div className="absolute -bottom-1 -right-1 rounded-full bg-amber-500 p-0.5 text-white border border-background">
                                <Award className="h-3 w-3" />
                            </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        Donated by {donor.name}
                      </div>
                    </div>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

    