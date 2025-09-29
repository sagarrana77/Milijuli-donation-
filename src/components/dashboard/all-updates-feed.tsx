

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { projects, type Update } from '@/lib/data';
import { Skeleton } from '../ui/skeleton';
import { ArrowRight, Gift, ShoppingCart } from 'lucide-react';
import { usePhotoDialog } from '@/context/image-dialog-provider';

type UpdateWithProject = Update & {
    projectName: string;
    projectId: string;
};

export function AllUpdatesFeed() {
  const [allUpdates, setAllUpdates] = useState<UpdateWithProject[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { openPhoto } = usePhotoDialog();

  useEffect(() => {
    // Aggregate updates from all projects
    const updates = projects.flatMap(project =>
      project.updates.map(update => ({
        ...update,
        projectName: project.name,
        projectId: project.id,
      }))
    );
    // Sort by date, most recent first
    updates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setAllUpdates(updates.slice(0, 7)); // Limit to most recent 7 for the feed
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Live Activity Feed</CardTitle>
                <CardDescription>A real-time feed of all platform activity.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
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
        <CardTitle>Live Activity Feed</CardTitle>
        <CardDescription>A real-time feed of all platform activity.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {allUpdates.length > 0 ? (
            allUpdates.map(update => (
              <div key={update.id} className="flex items-start gap-4">
                <div className="w-10 flex justify-center">
                   {update.isMonetaryDonation && update.monetaryDonationDetails && (
                        <Link href={update.monetaryDonationDetails.donorProfileUrl}>
                            <Avatar className="h-10 w-10 border">
                                <AvatarImage src={update.monetaryDonationDetails.donorAvatarUrl} alt={update.monetaryDonationDetails.donorName} />
                                <AvatarFallback>{update.monetaryDonationDetails.donorName.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </Link>
                   )}
                   {update.isTransfer && (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <ArrowRight className="h-5 w-5" />
                        </div>
                   )}
                    {update.isExpense && (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10 text-orange-600">
                            <ShoppingCart className="h-5 w-5" />
                        </div>
                   )}
                   {update.isInKindDonation && (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 text-green-600">
                            <Gift className="h-5 w-5" />
                        </div>
                   )}
                   {update.imageUrl && (
                        <Image
                            src={update.imageUrl}
                            alt={update.title}
                            width={40}
                            height={40}
                            className="rounded-md object-cover h-10 w-10 cursor-pointer"
                            data-ai-hint={update.imageHint}
                            onClick={() => openPhoto({ imageUrl: update.imageUrl!, title: update.title })}
                        />
                   )}
                   {(!update.isMonetaryDonation && !update.isTransfer && !update.isExpense && !update.isInKindDonation && !update.imageUrl) && (
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
            <p className="text-center text-muted-foreground">No platform activity yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

    