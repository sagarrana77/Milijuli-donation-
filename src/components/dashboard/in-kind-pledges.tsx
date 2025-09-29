
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
import { physicalDonations, type PhysicalDonation } from '@/lib/data';
import { formatDistanceToNow } from 'date-fns';
import { Package, Truck } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '../ui/badge';


export function InKindPledges() {
  const [pledges, setPledges] = useState<PhysicalDonation[]>(physicalDonations);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // In a real app, you would likely subscribe to a real-time database
    // for now, we'll just show the static list.
  }, []);

  if (!isClient) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent In-Kind Pledges</CardTitle>
                <CardDescription>A live feed of physical item donations.</CardDescription>
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
    <Card>
      <CardHeader>
        <CardTitle>Recent In-Kind Pledges</CardTitle>
        <CardDescription>A live feed of physical item donations.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pledges.slice(0, 5).map((pledge) => (
              <TableRow key={pledge.id}>
                <TableCell>
                    <div className="font-medium">{pledge.donorName}</div>
                    <div className="text-sm text-muted-foreground">
                        pledged {pledge.quantity}x {pledge.itemName}
                    </div>
                </TableCell>
                <TableCell>{pledge.projectName}</TableCell>
                <TableCell>
                    <Badge variant="secondary" className="flex w-fit items-center gap-2">
                        {pledge.donationType === 'pickup' ? <Truck className="h-3 w-3" /> : <Package className="h-3 w-3" />}
                        <span className="capitalize">{pledge.donationType.replace('-', ' ')}</span>
                    </Badge>
                </TableCell>
                <TableCell className="text-right">{isClient ? formatDistanceToNow(new Date(pledge.date), { addSuffix: true }) : ''}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
