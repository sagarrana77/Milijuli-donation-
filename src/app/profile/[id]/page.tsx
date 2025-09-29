

'use client';

import { notFound, useParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
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
import {
  recentDonations,
  users,
  type User,
  physicalDonations,
  projects,
  currentUser,
} from '@/lib/data';
import { format } from 'date-fns';
import InstagramIcon from '@/components/icons/instagram-icon';
import TwitterIcon from '@/components/icons/TwitterIcon';
import LinkedInIcon from '@/components/icons/LinkedInIcon';
import { ProfileInKindDonations } from '@/components/profile/in-kind-donations';
import { Calendar, List, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const socialLinks = [
  { href: '#', icon: LinkedInIcon, label: 'LinkedIn', color: 'text-blue-700' },
  { href: '#', icon: TwitterIcon, label: 'Twitter', color: 'text-sky-500' },
  { href: '#', icon: InstagramIcon, label: 'Instagram', color: 'text-pink-600' },
];

function getUser(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

export default function ProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const user = getUser(userId);
  const { toast } = useToast();

  if (!user) {
    notFound();
  }

  const isCurrentUserProfile = currentUser?.id === user.id;

  const handleAddFriend = () => {
    // In a real app, this would trigger an API call to send a friend request.
    // Here, we just simulate it with a toast message.
    toast({
        title: 'Friend Request Sent!',
        description: `Your friend request to ${user.name} has been sent.`,
    });
  }

  const userDonations = recentDonations.filter(
    (donation) => donation.donor.id === user.id
  );

  const userInKindDonations = physicalDonations.filter(
    (d) => d.donorName === user.name && d.status === 'Completed'
  );
  
  const userFriends = user.friends?.map(friendId => getUser(friendId)).filter(Boolean) as User[] || [];


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
                  <link.icon className={cn('h-5 w-5', link.color)} />
                  <span className="sr-only">{link.label}</span>
                </Link>
              </Button>
            ))}
          </div>
        </div>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">{user.bio}</p>
          {!isCurrentUserProfile && (
             <div className="mt-6 flex justify-center">
                <Button onClick={handleAddFriend}>
                    <UserPlus className="mr-2 h-4 w-4" /> Add Friend
                </Button>
             </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
            <Card>
            <CardHeader>
                <CardTitle className="text-primary">Donation History</CardTitle>
                <CardDescription>
                A record of this user's recent contributions.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="flex items-center gap-2">
                        <List className="h-4 w-4 text-amber-600" />
                        Project
                    </TableHead>
                    <TableHead>
                        <Calendar className="h-4 w-4 inline-block mr-2 text-amber-600" />
                        Date
                    </TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {userDonations.length > 0 ? (
                    userDonations.map((donation) => {
                        const project = projects.find(
                        (p) => p.name === donation.project
                        );
                        return (
                        <TableRow key={donation.id}>
                            <TableCell className="font-medium">
                            {project ? (
                                <Link
                                href={`/projects/${project.id}`}
                                className="hover:underline"
                                >
                                {donation.project}
                                </Link>
                            ) : (
                                <span>{donation.project}</span>
                            )}
                            </TableCell>
                            <TableCell>{format(donation.date, 'PPP')}</TableCell>
                            <TableCell className="text-right font-semibold">
                            Rs.{donation.amount.toLocaleString()}
                            </TableCell>
                        </TableRow>
                        );
                    })
                    ) : (
                    <TableRow>
                        <TableCell
                        colSpan={3}
                        className="text-center text-muted-foreground"
                        >
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
        <div className="md:col-span-1 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Friends ({userFriends.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {userFriends.length > 0 ? (
                        userFriends.map(friend => (
                            <Link href={friend.profileUrl} key={friend.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                                <Avatar className="h-10 w-10 border">
                                    <AvatarImage src={friend.avatarUrl} alt={friend.name} />
                                    <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{friend.name}</span>
                            </Link>
                        ))
                    ) : (
                        <p className="text-muted-foreground text-sm">
                            {user.name} hasn't added any friends yet.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
