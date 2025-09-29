'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import type { PhysicalDonation, Project, User } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { usePhotoDialog } from '@/context/image-dialog-provider';

interface InKindDonationsSliderClientProps {
    completedDonations: PhysicalDonation[];
    allProjects: Project[];
    users: User[];
}

export function InKindDonationsSliderClient({ completedDonations, allProjects, users }: InKindDonationsSliderClientProps) {
  const { openPhoto } = usePhotoDialog();
  
  return (
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {completedDonations.map((donation) => {
                const project = allProjects.find(p => p.id === donation.projectId);
                const wishlistItem = project?.wishlist?.find(w => w.name === donation.itemName);
                const donor = users.find(u => u.id === donation.donorId);
                
                if (!wishlistItem || !donor || !project) return null;

                const imageUrl = wishlistItem.imageUrl || 'https://picsum.photos/seed/placeholder/400/225';

                return (
                    <CarouselItem key={donation.id} className="md:basis-1/2">
                        <div className="p-1 h-full">
                        <Card className="flex flex-col h-full overflow-hidden">
                             <Image
                                src={imageUrl}
                                alt={wishlistItem.name}
                                width={400}
                                height={225}
                                className="rounded-t-lg object-cover w-full h-auto aspect-[16/9] cursor-pointer"
                                data-ai-hint={wishlistItem.imageHint}
                                onClick={() => openPhoto({
                                    imageUrl,
                                    imageAlt: wishlistItem.name,
                                    title: `${donation.quantity}x ${donation.itemName}`,
                                    donor,
                                    project,
                                    comments: [],
                                })}
                            />
                            <CardContent className="p-4 flex-grow">
                                <p className="font-semibold text-lg">{donation.quantity}x {donation.itemName}</p>
                                <p className="text-sm text-muted-foreground">
                                    for <Link href={`/projects/${project?.id}`} className="text-primary hover:underline">{project?.name}</Link>
                                </p>
                            </CardContent>
                            <CardFooter className="p-4 pt-0">
                                <Link href={donor.profileUrl} className="flex items-center gap-3 w-full">
                                    <Avatar className="h-9 w-9 border">
                                        <AvatarImage
                                        src={donor.avatarUrl}
                                        alt={donor.name}
                                        />
                                        <AvatarFallback>{donor.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium text-sm">Donated by {donor.name}</div>
                                    </div>
                                </Link>
                            </CardFooter>
                        </Card>
                        </div>
                    </CarouselItem>
                )
            })}
          </CarouselContent>
          <CarouselPrevious className="ml-12" />
          <CarouselNext className="mr-12" />
        </Carousel>
  );
}
