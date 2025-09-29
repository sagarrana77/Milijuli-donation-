'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import type { PhysicalDonation, Project, User } from '@/lib/data';
import { usePhotoDialog } from '@/context/image-dialog-provider';

interface ProfileInKindDonationsProps {
  donations: PhysicalDonation[];
  projects: Project[];
  users: User[];
}

export function ProfileInKindDonations({ donations, projects, users }: ProfileInKindDonationsProps) {
  const { openPhoto } = usePhotoDialog();

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {donations.map((donation) => {
        const project = projects.find(p => p.id === donation.projectId);
        const wishlistItem = project?.wishlist.find(w => w.name === donation.itemName);
        const donor = users.find(u => u.id === donation.donorId);

        if (!wishlistItem || !project || !donor) return null;

        const imageUrl = wishlistItem.imageUrl || 'https://picsum.photos/seed/placeholder/400/300';
        
        return (
          <Card key={donation.id} className="overflow-hidden transition-shadow hover:shadow-lg">
            <div 
                className="cursor-pointer"
                onClick={() => openPhoto({
                    imageUrl,
                    imageAlt: wishlistItem.name,
                    title: `${donation.quantity}x ${donation.itemName}`,
                    donor,
                    project,
                    comments: [],
                })}
            >
                <Image
                    src={imageUrl}
                    alt={wishlistItem.name}
                    width={400}
                    height={300}
                    className="aspect-video w-full object-cover"
                    data-ai-hint={wishlistItem.imageHint}
                />
            </div>
            <CardContent className="p-4">
              <p className="font-semibold">{donation.quantity}x {donation.itemName}</p>
              <p className="text-sm text-muted-foreground">
                for{' '}
                <Link href={`/projects/${project.id}`} className="text-primary hover:underline">
                  {project.name}
                </Link>
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
