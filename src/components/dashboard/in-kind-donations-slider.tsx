

'use server';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import type { Project } from '@/lib/data';
import { Button } from '../ui/button';
import { ArrowRight, Gift } from 'lucide-react';
import { getInKindDonations, getUsers } from '@/services/donations-service';
import { InKindDonationsSliderClient } from './in-kind-donations-slider-client';
import Link from 'next/link';

interface InKindDonationsSliderProps {
    allProjects: Project[];
}

export async function InKindDonationsSlider({ allProjects }: InKindDonationsSliderProps) {
    let physicalDonations = [];
    let users = [];
    
    try {
        [physicalDonations, users] = await Promise.all([getInKindDonations(), getUsers()]);
    } catch (error) {
        console.error("Failed to fetch data for In-Kind Donations Slider:", error);
        // Return null or an empty state to prevent crashing the page
        return null;
    }
  
  const featuredDonations = physicalDonations.filter(d => d.status === 'Completed' && d.featured);

  if (featuredDonations.length === 0) {
    return null; // Don't show the slider if there are no featured items
  }

  return (
    <Card className="bg-blue-500/5 border-blue-500/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-600">
            <Gift className="h-6 w-6" />
            Featured In-Kind Donations
        </CardTitle>
        <CardDescription>A showcase of tangible support from our generous community.</CardDescription>
      </CardHeader>
      <CardContent>
        <InKindDonationsSliderClient completedDonations={featuredDonations} allProjects={allProjects} users={users} />
      </CardContent>
       <CardFooter>
            <Button asChild variant="outline" className="w-full">
                <Link href="/in-kind-donations">View All In-Kind Donations <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
        </CardFooter>
    </Card>
  );
}
