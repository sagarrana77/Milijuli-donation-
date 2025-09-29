
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { physicalDonations, projects, users } from '@/lib/data';
import { Package } from 'lucide-react';
import { useImageDialog } from '@/context/image-dialog-provider';

export default function InKindDonationsPage() {
  const { openImage } = useImageDialog();
  const completedDonations = physicalDonations.filter(
    (d) => d.status === 'Completed'
  );

  const projectsWithDonations = projects.filter((project) =>
    completedDonations.some((donation) => donation.projectName === project.name)
  );

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="text-center">
        <Package className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-4xl font-bold tracking-tight">
          Donation Hall of Fame
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          A heartfelt thank you to our donors for these generous physical
          contributions.
        </p>
      </div>

      {projectsWithDonations.length > 0 ? (
        <Tabs defaultValue={projectsWithDonations[0].id} className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
            {projectsWithDonations.map((project) => (
              <TabsTrigger key={project.id} value={project.id}>
                {project.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {projectsWithDonations.map((project) => {
            const projectDonations = completedDonations.filter(
              (d) => d.projectName === project.name
            );
            return (
              <TabsContent key={project.id} value={project.id}>
                <Card>
                  <CardContent className="p-4 md:p-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {projectDonations.map((donation) => {
                        const wishlistItem = project.wishlist.find(
                          (w) => w.name === donation.itemName
                        );
                        const donor = users.find(
                          (u) => u.name === donation.donorName
                        );

                        if (!wishlistItem || !donor) return null;

                        const imageUrl =
                          wishlistItem.imageUrl ||
                          'https://picsum.photos/seed/placeholder/400/300';
                        
                        return (
                          <Card
                            key={donation.id}
                            className="overflow-hidden transition-shadow hover:shadow-lg"
                          >
                            <Image
                              src={imageUrl}
                              alt={wishlistItem.name}
                              width={400}
                              height={300}
                              className="aspect-video w-full object-cover cursor-pointer"
                              data-ai-hint={wishlistItem.imageHint}
                              onClick={() => openImage(imageUrl, wishlistItem.name)}
                            />
                            <CardContent className="p-4">
                              <p className="font-semibold">
                                {donation.quantity}x {donation.itemName}
                              </p>
                            </CardContent>
                            <CardFooter className="p-4 pt-0">
                              <Link
                                href={donor.profileUrl}
                                className="flex w-full items-center gap-3"
                              >
                                <Avatar className="h-9 w-9 border">
                                  <AvatarImage
                                    src={donor.avatarUrl}
                                    alt={donor.name}
                                  />
                                  <AvatarFallback>
                                    {donor.name.charAt(0)}
                                  </AvatarFallback>
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
              </TabsContent>
            );
          })}
        </Tabs>
      ) : (
        <Card>
          <CardContent className="py-24 text-center text-muted-foreground">
            <p>No completed in-kind donations to display yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
