
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
import { recentDonations, projects } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { format } from 'date-fns';

function getImageUrl(id: string) {
  return PlaceHolderImages.find((img) => img.id === id)?.imageUrl || '';
}

const allDonors = [
    { name: 'Jane Doe', avatarUrl: getImageUrl('avatar-jane-doe') },
    { name: 'John Smith', avatarUrl: getImageUrl('avatar-john-smith') },
    { name: 'Ai Chan', avatarUrl: getImageUrl('avatar-ai-chan') },
    { name: 'Raj Patel', avatarUrl: getImageUrl('avatar-raj-patel') },
    { name: 'Anonymous', avatarUrl: getImageUrl('avatar-anonymous') },
]

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
            amount: Math.floor(Math.random() * 200) + 10,
            date: new Date(),
        };

      setDonations(prevDonations => [newDonation, ...prevDonations.slice(0, 4)]);
    }, 3000); // Add a new donation every 3 seconds

    return () => clearInterval(interval);
  }, []);

  if (!isClient) {
    // Render a placeholder or nothing on the server
    return (
        <Card className="lg:col-span-4">
            <CardHeader>
                <CardTitle>Real-time Ledger</CardTitle>
                <CardDescription>A live feed of all incoming donations.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Loading live feed...
                </div>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="lg:col-span-4">
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
                </TableCell>
                <TableCell>{donation.project}</TableCell>
                <TableCell className="text-right">${donation.amount.toLocaleString()}</TableCell>
                <TableCell className="text-right">{format(donation.date, 'PPp')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
