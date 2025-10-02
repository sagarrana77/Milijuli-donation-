
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Project, Update } from '@/lib/data';
import { Skeleton } from '../ui/skeleton';
import { ArrowRight, Award } from 'lucide-react';
import { Pagination } from '../ui/pagination';
import { allDonations as initialAllDonations } from '@/lib/data';

const UPDATES_PER_PAGE = 5;

type UpdateWithProject = Update & {
    projectName: string;
    projectId: string;
};

interface CategoryLiveFeedProps {
    projects: Project[];
}

export function CategoryLiveFeed({ projects }: CategoryLiveFeedProps) {
  const [allUpdates, setAllUpdates] = useState<UpdateWithProject[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const projectIds = useMemo(() => new Set(projects.map(p => p.id)), [projects]);

  const topDonorIds = useMemo(() => {
    const projectNames = new Set(projects.map(p => p.name));
    const categoryDonations = initialAllDonations.filter(d => projectNames.has(d.project));

    const donationTotals: Record<string, number> = {};
    categoryDonations.forEach(donation => {
        if (!donation.donor || donation.donor.id === 'user-anonymous') return;
        if (donationTotals[donation.donor.id]) {
            donationTotals[donation.donor.id] += donation.amount;
        } else {
            donationTotals[donation.donor.id] = donation.amount;
        }
    });
    const sortedDonors = Object.keys(donationTotals).sort((a, b) => donationTotals[b] - donationTotals[a]);
    return sortedDonors.slice(0, 5);
  }, [projects]);


  useEffect(() => {
    if (projects && Array.isArray(projects)) {
      const updates = projects.flatMap(project =>
        (project.updates || []).map(update => ({
          ...update,
          projectName: project.name,
          projectId: project.id,
        }))
      );
      updates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setAllUpdates(updates);
    }
    setIsClient(true);
    
  }, [projects]);

  const paginatedUpdates = allUpdates.slice(
    (currentPage - 1) * UPDATES_PER_PAGE,
    currentPage * UPDATES_PER_PAGE
  );
  const totalPages = Math.ceil(allUpdates.length / UPDATES_PER_PAGE);

  if (!isClient) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Live Activity</CardTitle>
                <CardDescription>A real-time feed of activity in this category.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-4/5" />
                                <Skeleton className="h-3 w-1/3" />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Activity</CardTitle>
        <CardDescription>A real-time feed of activity in this category.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {paginatedUpdates.length > 0 ? (
            paginatedUpdates.map(update => (
              <div key={update.id} className="flex items-start gap-4">
                <div className="w-10 flex-shrink-0">
                   {update.isMonetaryDonation && update.monetaryDonationDetails ? (
                        <Link href={update.monetaryDonationDetails.donorProfileUrl} className="relative inline-block">
                            <Avatar className="h-10 w-10 border">
                                <AvatarImage src={update.monetaryDonationDetails.donorAvatarUrl} alt={update.monetaryDonationDetails.donorName} />
                                <AvatarFallback>{update.monetaryDonationDetails.donorName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {topDonorIds.includes(update.monetaryDonationDetails.donorId) && (
                                <div className="absolute -bottom-1 -right-1 rounded-full bg-amber-500 p-0.5 text-white border border-background">
                                    <Award className="h-3 w-3" />
                                </div>
                            )}
                        </Link>
                   ) : (
                        <Avatar className="h-10 w-10 border">
                            <AvatarFallback>{update.projectName.charAt(0)}</AvatarFallback>
                        </Avatar>
                   )}
                </div>
                <div className="flex-1">
                    <p className="text-sm">
                       {update.isMonetaryDonation && update.monetaryDonationDetails ? (
                            <>
                                <Link href={update.monetaryDonationDetails.donorProfileUrl} className="font-semibold hover:underline">{update.monetaryDonationDetails.donorName}</Link>
                                {' '}donated <span className="font-bold text-primary">Rs.{update.monetaryDonationDetails.amount.toLocaleString()}</span> to <Link href={`/projects/${update.projectId}`} className="font-semibold hover:underline">{update.projectName}</Link>.
                            </>
                       ) : (
                            <>
                                <span className="font-semibold">{update.title}</span> on <Link href={`/projects/${update.projectId}`} className="font-semibold hover:underline">{update.projectName}</Link>
                            </>
                       )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(update.date), { addSuffix: true })}
                    </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground">No activity in this category yet.</p>
          )}
        </div>
      </CardContent>
      {totalPages > 1 && (
        <CardFooter>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardFooter>
      )}
    </Card>
  );
}
