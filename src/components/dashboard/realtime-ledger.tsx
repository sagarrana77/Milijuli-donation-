

'use client';

import { useState, useEffect } from 'react';
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
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { recentDonations, projects, users, type Donor } from '@/lib/data';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { Skeleton } from '../ui/skeleton';

const allDonors: Donor[] = users.map(({ id, name, avatarUrl, profileUrl, bio }) => ({
    id, name, avatarUrl, profileUrl, bio
}));

export function RealtimeLedger() {
  const [donations, setDonations] = useState(recentDonations);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const interval = setInterval(() => {
        const randomDonor = allDonors[Math.floor(Math.random() * allDonors.length)];
        const randomProject = projects[Math.floor(Math.random() * projects.length)];
        const newDonation = {
            id: Date.now(),
            donor: randomDonor,
            project: randomProject.name,
            amount: Math.floor(Math.random() * 20000) + 1000,
            date: new Date(),
        };

      setDonations(prevDonations => [newDonation, ...prevDonations.slice(0, 4)]);
    }, 3000); // Add a new donation every 3 seconds

    return () => clearInterval(interval);
  }, []);

  if (!isClient) {
    // Render a placeholder or nothing on the server
    return (
        <Card>
            <CardHeader>
                <CardTitle>Real-time Ledger</CardTitle>
                <CardDescription>A live feed of all incoming donations.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Donor</TableHead>
                            <TableHead>Project</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="text-right">Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {donations.map((donation) => (
                            <TableRow key={donation.id}>
                                <TableCell><Skeleton className="h-9 w-32" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                <TableCell className="text-right"><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                                <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-time Ledger</CardTitle>
        <CardDescription>A live feed of all incoming donations.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Donor</TableHead>
              <TableHead>Project</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {donations.map((donation) => (
              <TableRow key={donation.id}>
                <TableCell>
                  <Link href={donation.donor.profileUrl}>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={donation.donor.avatarUrl}
                          alt={donation.donor.name}
                        />
                        <AvatarFallback>{donation.donor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{donation.donor.name}</div>
                    </div>
                  </Link>
                </TableCell>
                <TableCell>{donation.project}</TableCell>
                <TableCell className="text-right">Rs.{donation.amount.toLocaleString()}</TableCell>
                <TableCell className="text-right">{isClient ? formatDistanceToNow(new Date(donation.date), { addSuffix: true }) : ''}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
