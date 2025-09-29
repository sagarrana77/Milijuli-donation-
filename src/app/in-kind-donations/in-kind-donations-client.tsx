'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePhotoDialog } from '@/context/image-dialog-provider';
import type { Project, PhysicalDonation, User } from '@/lib/data';

interface InKindDonationsClientProps {
  project: Project;
  donations: PhysicalDonation[];
  users: User[];
}

export function InKindDonationsClient({
  project,
  donations,
  users,
}: InKindDonationsClientProps) {
  const { openPhoto } = usePhotoDialog();

  return (
    <Card>
      <CardContent className="p-4 md:p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {donations.map((donation) => {
            const wishlistItem = project.wishlist.find(
              (w) => w.name === donation.itemName
            );
            const donor = users.find((u) => u.id === donation.donorId);

            if (!wishlistItem || !donor) return null;

            const imageUrl =
              wishlistItem.imageUrl ||
              'https://picsum.photos/seed/placeholder/400/300';

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
                <CardFooter className="p-4 pt-0">
                  <Link
                    href={donor.profileUrl}
                    className="flex w-full items-center gap-3"
                  >
                    <Avatar className="h-9 w-9 border">
                      <AvatarImage src={donor.avatarUrl} alt={donor.name} />
                      <AvatarFallback>{donor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">
                        Donated by {donor.name}
                      </div>
                    </div>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
