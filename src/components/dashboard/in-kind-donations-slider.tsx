
'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { physicalDonations, projects, users } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';
import { usePhotoDialog } from '@/context/image-dialog-provider';

export function InKindDonationsSlider() {
  const completedDonations = physicalDonations.filter(d => d.status === 'Completed');
  const { openPhoto } = usePhotoDialog();

  if (completedDonations.length === 0) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>In-Kind Donations</CardTitle>
                <CardDescription>A showcase of successfully donated physical items.</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
                <p>No completed in-kind donations to show yet.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader>
        <CardTitle>Recent In-Kind Donations</CardTitle>
        <CardDescription>A showcase of successfully donated physical items.</CardDescription>
      </CardHeader>
      <CardContent>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {completedDonations.map((donation) => {
                const project = projects.find(p => p.name === donation.projectName);
                const wishlistItem = project?.wishlist.find(w => w.name === donation.itemName);
                const donor = users.find(u => u.name === donation.donorName);
                
                if (!wishlistItem || !donor) return null;

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
                                    comments: donation.comments,
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
      </CardContent>
       <CardFooter>
            <Button asChild variant="outline" className="w-full">
                <Link href="/in-kind-donations">View All In-Kind Donations <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
        </CardFooter>
    </Card>
  );
}
