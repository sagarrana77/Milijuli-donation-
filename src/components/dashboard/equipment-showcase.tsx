

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import type { equipment as EquipmentType } from '@/lib/data';
import Image from 'next/image';
import { format } from 'date-fns';

interface EquipmentShowcaseProps {
    equipment: typeof EquipmentType
}

export function EquipmentShowcase({ equipment }: EquipmentShowcaseProps) {
  const purchasedEquipment = equipment.filter(e => e.imageUrl);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Our Equipment</CardTitle>
        <CardDescription>
          Funded by generous donors, this is the equipment that powers our mission.
        </CardDescription>
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
            {purchasedEquipment.map((item) => (
              <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <Card className="flex flex-col h-full">
                    <CardContent className="relative p-0">
                       <Image
                        src={item.imageUrl!}
                        alt={item.item}
                        width={400}
                        height={225}
                        className="rounded-t-lg object-cover w-full h-auto aspect-[16/9]"
                        data-ai-hint={item.imageHint}
                      />
                    </CardContent>
                     <div className="p-4 flex flex-col flex-grow">
                        <p className="font-semibold">{item.item}</p>
                        <p className="text-sm text-muted-foreground">Purchased: {format(new Date(item.purchaseDate), 'PP')}</p>
                        <p className="text-sm text-muted-foreground">Cost: ${item.cost.toLocaleString()}</p>
                     </div>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="ml-12" />
          <CarouselNext className="mr-12" />
        </Carousel>
      </CardContent>
    </Card>
  );
}
