
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useDonationContext } from '@/components/projects/donation-dialog-wrapper';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { WishlistItem } from '@/lib/data';
import { InKindDonationDialog } from './in-kind-donation-dialog';
import { useToast } from '@/hooks/use-toast';
import { physicalDonations, currentUser } from '@/lib/data';
import { usePhotoDialog } from '@/context/image-dialog-provider';
import { cn } from '@/lib/utils';


export function WishlistTab() {
  const { project, setIsDonationOpen } = useDonationContext();
  const [selectedItem, setSelectedItem] = useState<WishlistItem | null>(null);
  const { toast } = useToast();
  const { openPhoto } = usePhotoDialog();

  const handleInKindSubmit = (data: { donationType: 'drop-off' | 'pickup', quantity: number, address?: string }) => {
    if (!selectedItem || !currentUser) return;

    // In a real app, this would be an API call
    physicalDonations.unshift({
        id: `pd-${Date.now()}`,
        donorId: currentUser.id,
        donorName: currentUser.name,
        donorEmail: currentUser.email || 'anonymous@example.com',
        projectName: project.name,
        projectId: project.id,
        itemName: selectedItem.name,
        quantity: data.quantity,
        donationType: data.donationType,
        address: data.address,
        status: 'Pending',
        date: new Date().toISOString(),
        comments: [],
    });

    toast({
        title: 'In-Kind Pledge Submitted!',
        description: `Thank you for your pledge to donate ${data.quantity}x "${selectedItem.name}". We'll be in touch with further instructions.`
    });

    setSelectedItem(null);
  }

  if (!project.wishlist || project.wishlist.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          There are no specific items requested for this project's wishlist yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <InKindDonationDialog 
        isOpen={!!selectedItem}
        onOpenChange={(open) => !open && setSelectedItem(null)}
        item={selectedItem}
        onSubmit={handleInKindSubmit}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {project.wishlist.map((item) => {
          const percentage = Math.min(
            Math.round((item.quantityDonated / item.quantityNeeded) * 100),
            100
          );
          const isFulfilled = item.quantityDonated >= item.quantityNeeded;

          return (
            <Card key={item.id} className="flex flex-col">
              {item.imageUrl && (
                  <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={400}
                      height={300}
                      className="aspect-video w-full object-cover rounded-t-lg cursor-pointer"
                      data-ai-hint={item.imageHint}
                      onClick={() => openPhoto({ imageUrl: item.imageUrl!, title: item.name, project })}
                  />
              )}
              <CardHeader>
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-2">
                <div className="text-lg font-bold text-primary">
                  Rs.{item.costPerItem.toLocaleString()} per item
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                      <span>
                      {item.quantityDonated} of {item.quantityNeeded} funded
                      </span>
                      <span>{percentage}%</span>
                  </div>
                  <Progress value={percentage} aria-label={`${percentage}% funded`} />
                </div>
              </CardContent>
              <CardFooter className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button
                  className="w-full"
                  onClick={() => setIsDonationOpen(true)}
                  disabled={isFulfilled}
                >
                  {isFulfilled ? 'Fully Funded' : 'Donate Money'}
                </Button>
                 <Button
                  className={cn("w-full", isFulfilled ? "bg-muted text-muted-foreground" : "bg-teal-600 hover:bg-teal-700 text-white")}
                  onClick={() => setSelectedItem(item)}
                  disabled={!item.allowInKind || isFulfilled}
                >
                   {isFulfilled ? 'Fully Donated' : 'Donate In-Kind'}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </>
  );
}
