

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { recentDonations, users, type User, physicalDonations, projects } from '@/lib/data';
import { format } from 'date-fns';
import InstagramIcon from '@/components/icons/instagram-icon';
import TwitterIcon from '@/components/icons/TwitterIcon';
import LinkedInIcon from '@/components/icons/LinkedInIcon';
import { ProfileInKindDonations } from '@/components/profile/in-kind-donations';
import { Calendar, List } from 'lucide-react';
import { cn } from '@/lib/utils';


const socialLinks = [
  { href: '#', icon: LinkedInIcon, label: 'LinkedIn', color: 'text-blue-700' },
  { href: '#', icon: TwitterIcon, label: 'Twitter', color: 'text-sky-500' },
  { href: '#', icon: InstagramIcon, label: 'Instagram', color: 'text-pink-600' },
];

function getUser(id: string): User | undefined {
    return users.find(u => u.id === id);
}

export default function ProfilePage({ params }: { params: { id: string } }) {
  const user = getUser(params.id);

  if (!user) {
    notFound();
  }

  const userDonations = recentDonations.filter(
    (donation) => donation.donor.id === user.id
  );

  const userInKindDonations = physicalDonations.filter(d => d.donorName === user.name && d.status === 'Completed');

  return (
    <div className="space-y-8">
    <Card className="overflow-hidden">
        <div className="bg-muted/30 p-4 sm:p-6 md:p-8 text-center">
            <Avatar className="mx-auto mb-4 h-28 w-28 border-4 border-primary/20 shadow-lg">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-3xl">{user.name}</CardTitle>
            {user.email && <p className="text-muted-foreground">{user.email}</p>}
            <div className="mt-4 flex justify-center gap-2">
                {socialLinks.map((link) => (
                    <Button key={link.label} variant="ghost" size="icon" asChild>
                        <Link href={link.href} target="_blank" rel="noopener noreferrer">
                            <link.icon className={cn("h-5 w-5", link.color)} />
                            <span className="sr-only">{link.label}</span>
                        </Link>
                    </Button>
                ))}
            </div>
        </div>
        <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
                {user.bio}
            </p>
        </CardContent>
    </Card>
    
    <Card>
        <CardHeader>
        <CardTitle className="text-primary">Donation History</CardTitle>
        <CardDescription>A record of this user's recent contributions.</CardDescription>
        </CardHeader>
        <CardContent>
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead className="flex items-center gap-2"><List className="h-4 w-4 text-amber-600" />Project</TableHead>
                <TableHead><Calendar className="h-4 w-4 inline-block mr-2 text-amber-600" />Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {userDonations.length > 0 ? (
                userDonations.map((donation) => {
                  const project = projects.find(p => p.name === donation.project);
                  return (
                    <TableRow key={donation.id}>
                        <TableCell className="font-medium">
                           {project ? (
                            <Link href={`/projects/${project.id}`} className="hover:underline">{donation.project}</Link>
                           ) : (
                             <span>{donation.project}</span>
                           )}
                        </TableCell>
                        <TableCell>{format(donation.date, 'PPP')}</TableCell>
                        <TableCell className="text-right font-semibold">Rs.{donation.amount.toLocaleString()}</TableCell>
                    </TableRow>
                  )
                })
            ) : (
                <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                    This user hasn't made any public donations yet.
                </TableCell>
                </TableRow>
            )}
            </TableBody>
        </Table>
        </CardContent>
    </Card>

    {userInKindDonations.length > 0 && (
        <Card>
            <CardHeader>
                <CardTitle className="text-primary">In-Kind Donations</CardTitle>
                <CardDescription>Physical items generously donated by {user.name}.</CardDescription>
            </CardHeader>
            <CardContent>
                <ProfileInKindDonations donations={userInKindDonations} />
            </CardContent>
        </Card>
    )}
    </div>
  );
}
