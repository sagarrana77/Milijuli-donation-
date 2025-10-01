
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import type { Project, PhysicalDonation, User } from '@/lib/data';
import { Button } from '../ui/button';
import { ArrowRight, Gift } from 'lucide-react';
import { InKindDonationsSliderClient } from './in-kind-donations-slider-client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getInKindDonations, getUsers } from '@/services/donations-service';

interface InKindDonationsSliderProps {
    allProjects: Project[];
}

export function InKindDonationsSlider({ allProjects }: InKindDonationsSliderProps) {
    const [physicalDonations, setPhysicalDonations] = useState<PhysicalDonation[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        async function fetchData() {
            try {
                const [pd, u] = await Promise.all([getInKindDonations(), getUsers()]);
                setPhysicalDonations(pd);
                setUsers(u);
            } catch (error) {
                console.error("Failed to fetch data for In-Kind Donations Slider:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);
  
  const featuredDonations = physicalDonations.filter(d => d.status === 'Completed' && d.featured);

  if (loading || featuredDonations.length === 0) {
    return null; // Don't show the slider if there are no featured items or still loading
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
