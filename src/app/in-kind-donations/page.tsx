
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { physicalDonations, projects } from '@/lib/data';
import { format } from 'date-fns';
import { CheckCircle, Package } from 'lucide-react';
import Link from 'next/link';

export default function InKindDonationsPage() {
    const completedDonations = physicalDonations.filter(d => d.status === 'Completed');

    return (
        <div className="max-w-6xl mx-auto space-y-8">
             <div className="text-center">
                <Package className="mx-auto h-12 w-12 text-primary" />
                <h1 className="mt-4 text-4xl font-bold tracking-tight">Completed In-Kind Donations</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    A heartfelt thank you to our donors for these generous physical contributions.
                </p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Donation Hall of Fame</CardTitle>
                    <CardDescription>A log of all successfully completed in-kind donations.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Donor</TableHead>
                                <TableHead>Item Donated</TableHead>
                                <TableHead>Project</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {completedDonations.length > 0 ? (
                                completedDonations.map(donation => {
                                    const project = projects.find(p => p.name === donation.projectName);
                                    return (
                                        <TableRow key={donation.id}>
                                            <TableCell>{format(donation.date, 'PPP')}</TableCell>
                                            <TableCell>
                                                <div className="font-medium">{donation.donorName}</div>
                                                <div className="text-sm text-muted-foreground">{donation.donorEmail}</div>
                                            </TableCell>
                                            <TableCell>{donation.quantity}x {donation.itemName}</TableCell>
                                            <TableCell>
                                                {project ? (
                                                     <Link href={`/projects/${project.id}`} className="hover:underline text-primary">
                                                        {donation.projectName}
                                                    </Link>
                                                ) : (
                                                    <span>{donation.projectName}</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        No completed in-kind donations to display yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
