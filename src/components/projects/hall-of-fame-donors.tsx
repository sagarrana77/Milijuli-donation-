
'use client';

import { useMemo, useRef } from 'react';
import type { Donation, Donor } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Award, Sparkles } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import TwitterIcon from '../icons/TwitterIcon';
import LinkedInIcon from '../icons/LinkedInIcon';
import InstagramIcon from '../icons/instagram-icon';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

interface HallOfFameDonorsProps {
  donations: Donation[];
}

type TopDonor = Donor & { totalDonated: number };

export function HallOfFameDonors({ donations }: HallOfFameDonorsProps) {
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true, stopOnMouseEnter: true })
  );
  
  const topDonors = useMemo(() => {
    const donationTotals: Record<string, { donor: Donor; total: number }> = {};

    donations.forEach(donation => {
        if (!donation.donor || donation.donor.id === 'user-anonymous') return;

        if (donationTotals[donation.donor.id]) {
            donationTotals[donation.donor.id].total += donation.amount;
        } else {
            donationTotals[donation.donor.id] = {
                donor: donation.donor,
                total: donation.amount,
            };
        }
    });

    const sortedDonors = Object.values(donationTotals).sort((a, b) => b.total - a.total);
    
    return sortedDonors.slice(0, 5).map(d => ({
        ...d.donor,
        totalDonated: d.total
    }));
  }, [donations]);

  if (topDonors.length === 0) {
    return null;
  }

  return (
    <Card className="bg-amber-500/5 border-amber-500/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Award className="h-6 w-6 text-amber-500" />
            Hall of Fame
        </CardTitle>
        <CardDescription>
          Recognizing our most generous supporters. Thank you for your incredible impact!
        </CardDescription>
      </CardHeader>
      <CardContent>
         <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          plugins={[plugin.current]}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {topDonors.map((donor, index) => (
                <CarouselItem key={donor.id} className="pl-4 lg:basis-full">
                    <div className="h-full p-1">
                        <Card className="flex flex-col h-full text-center overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                            <CardHeader className="flex-1 items-center">
                                <Link href={donor.profileUrl} className="relative inline-block">
                                <Avatar className="w-24 h-24 mb-4 border-4 border-amber-400">
                                    <AvatarImage src={donor.avatarUrl} alt={donor.name} />
                                    <AvatarFallback>{donor.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1 rounded-full bg-amber-500 p-1 text-white border-2 border-background">
                                    <Award className="h-4 w-4" />
                                </div>
                                </Link>
                                <div className="flex items-center justify-center gap-2">
                                <CardTitle className="text-xl">
                                    <Link href={donor.profileUrl} className="hover:underline">{donor.name}</Link>
                                </CardTitle>
                                {donor.isProMember && (
                                    <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                        <Sparkles className="h-5 w-5 text-primary" />
                                        </TooltipTrigger>
                                        <TooltipContent><p>Pro Member</p></TooltipContent>
                                    </Tooltip>
                                    </TooltipProvider>
                                )}
                                </div>
                                <CardDescription className="line-clamp-2">{donor.bio}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="text-sm font-semibold text-muted-foreground">Total Donated</div>
                                <div className="text-3xl font-bold text-amber-600">
                                Rs.{donor.totalDonated.toLocaleString()}
                                </div>
                            </CardContent>
                             <CardFooter className="flex flex-col gap-4">
                                <div className="flex justify-center gap-2">
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link href={'#'} target="_blank" rel="noopener noreferrer">
                                            <LinkedInIcon className={cn('h-5 w-5', 'text-blue-700')} />
                                            <span className="sr-only">LinkedIn</span>
                                        </Link>
                                    </Button>
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link href={'#'} target="_blank" rel="noopener noreferrer">
                                            <TwitterIcon className={cn('h-5 w-5', 'text-sky-500')} />
                                            <span className="sr-only">Twitter</span>
                                        </Link>
                                    </Button>
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link href={'#'} target="_blank" rel="noopener noreferrer">
                                            <InstagramIcon className={cn('h-5 w-5', 'text-pink-600')} />
                                            <span className="sr-only">Instagram</span>
                                        </Link>
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                </CarouselItem>
            ))}
          </CarouselContent>
           {topDonors.length > 1 && (
               <>
                <CarouselPrevious className="absolute left-[-1rem] top-1/2 -translate-y-1/2" />
                <CarouselNext className="absolute right-[-1rem] top-1/2 -translate-y-1/2" />
               </>
           )}
        </Carousel>
      </CardContent>
    </Card>
  );
}
