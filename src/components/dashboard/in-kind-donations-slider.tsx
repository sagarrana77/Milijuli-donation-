
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
import { ArrowRight } from 'lucide-react';
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
  
  const completedDonations = physicalDonations.filter(d => d.status === 'Completed');

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
        <InKindDonationsSliderClient completedDonations={completedDonations} allProjects={allProjects} users={users} />
      </CardContent>
       <CardFooter>
            <Button asChild variant="outline" className="w-full">
                <Link href="/in-kind-donations">View All In-Kind Donations <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
        </CardFooter>
    </Card>
  );
}
