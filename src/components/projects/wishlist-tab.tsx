
'use client';

import Image from 'next/image';
import { useDonationContext } from '@/components/projects/donation-dialog-wrapper';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export function WishlistTab() {
  const { project, setIsDonationOpen } = useDonationContext();

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
                    className="aspect-video w-full object-cover rounded-t-lg"
                    data-ai-hint={item.imageHint}
                />
            )}
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-2">
               <div className="text-lg font-bold text-primary">
                ${item.costPerItem.toLocaleString()} per item
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                    <span>
                    {item.quantityDonated} of {item.quantityNeeded} donated
                    </span>
                    <span>{percentage}%</span>
                </div>
                <Progress value={percentage} aria-label={`${percentage}% funded`} />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => setIsDonationOpen(true)}
                disabled={isFulfilled}
              >
                {isFulfilled ? 'Fully Donated' : 'Donate This Item'}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
