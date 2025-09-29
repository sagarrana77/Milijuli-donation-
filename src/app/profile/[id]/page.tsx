
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
import { usePhotoDialog, PhotoDialogProvider } from '@/context/image-dialog-provider';
import { ProfileInKindDonations } from '@/components/profile/in-kind-donations';


const socialLinks = [
  { href: '#', icon: LinkedInIcon, label: 'LinkedIn' },
  { href: '#', icon: TwitterIcon, label: 'Twitter' },
  { href: '#', icon: InstagramIcon, label: 'Instagram' },
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
    <PhotoDialogProvider>
        <div className="space-y-8">
        <Card>
            <CardHeader className="text-center">
            <Avatar className="mx-auto mb-4 h-24 w-24 border-4 border-primary/20">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-3xl">{user.name}</CardTitle>
            {user.email && <p className="text-muted-foreground">{user.email}</p>}
            </CardHeader>
            <CardContent>
            <p className="text-center text-muted-foreground">
                {user.bio}
            </p>
            <div className="mt-4 flex justify-center gap-2">
                {socialLinks.map((link) => (
                    <Button key={link.label} variant="ghost" size="icon" asChild>
                        <Link href={link.href} target="_blank" rel="noopener noreferrer">
                            <link.icon className="h-5 w-5" />
                            <span className="sr-only">{link.label}</span>
                        </Link>
                    </Button>
                ))}
            </div>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
            <CardTitle>Donation History</CardTitle>
            <CardDescription>A record of this user's recent contributions.</CardDescription>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {userDonations.length > 0 ? (
                    userDonations.map((donation) => (
                    <TableRow key={donation.id}>
                        <TableCell className="font-medium">{donation.project}</TableCell>
                        <TableCell>{format(donation.date, 'PPP')}</TableCell>
                        <TableCell className="text-right">${donation.amount.toLocaleString()}</TableCell>
                    </TableRow>
                    ))
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
                    <CardTitle>In-Kind Donations</CardTitle>
                    <CardDescription>Physical items generously donated by {user.name}.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ProfileInKindDonations donations={userInKindDonations} />
                </CardContent>
            </Card>
        )}
        </div>
    </PhotoDialogProvider>
  );
}
