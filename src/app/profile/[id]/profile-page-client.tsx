
'use client';

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
  type User,
  type PhysicalDonation,
  type Project,
  type Donation,
} from '@/lib/data';
import { format } from 'date-fns';
import InstagramIcon from '@/components/icons/instagram-icon';
import TwitterIcon from '@/components/icons/TwitterIcon';
import LinkedInIcon from '@/components/icons/LinkedInIcon';
import { ProfileInKindDonations } from '@/components/profile/in-kind-donations';
import { Calendar, List, UserPlus, CheckCircle, Sparkles, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { usePricingDialog } from '@/context/pricing-dialog-provider';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/auth-provider';

const socialLinks = [
  { href: '#', icon: LinkedInIcon, label: 'LinkedIn', color: 'text-blue-700' },
  { href: '#', icon: TwitterIcon, label: 'Twitter', color: 'text-sky-500' },
  { href: '#', icon: InstagramIcon, label: 'Instagram', color: 'text-pink-600' },
];

interface ProfilePageClientProps {
  user: User;
  allDonations: Donation[];
  physicalDonations: PhysicalDonation[];
  projects: Project[];
  allUsers: User[];
}

export function ProfilePageClient({
  user,
  allDonations,
  physicalDonations,
  projects,
  allUsers,
}: ProfilePageClientProps) {
  const { toast } = useToast();
  const { openDialog } = usePricingDialog();
  const [isClient, setIsClient] = useState(false);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const topDonorIds = useMemo(() => {
    const donationTotals: Record<string, number> = {};
    allDonations.forEach(donation => {
        if (!donation.donor || donation.donor.id === 'user-anonymous') return;
        if (donationTotals[donation.donor.id]) {
            donationTotals[donation.donor.id] += donation.amount;
        } else {
            donationTotals[donation.donor.id] = donation.amount;
        }
    });
    const sortedDonors = Object.keys(donationTotals).sort((a, b) => donationTotals[b] - donationTotals[a]);
    return sortedDonors.slice(0, 5);
  }, [allDonations]);

  if (!user) {
    return null; // Should be handled by notFound on the server
  }

  const isCurrentUserProfile = currentUser?.uid === user.id;
  const isTopDonor = topDonorIds.includes(user.id);

  const handleAddFriend = () => {
    toast({
      title: 'Friend Request Sent!',
      description: `Your friend request to ${user.name} has been sent.`,
    });
  };

  const userDonations = allDonations.filter(
    (donation) => donation.donor.id === user.id
  );

  const userInKindDonations = physicalDonations.filter(
    (d) => d.donorId === user.id && d.status === 'Completed'
  );

  const userFriends =
    user.friends
      ?.map((friendId) => allUsers.find((u) => u.id === friendId))
      .filter(Boolean) as User[] | undefined || [];

  const isDonor = userDonations.length > 0 || userInKindDonations.length > 0;

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden">
        <div className="bg-muted/30 p-4 sm:p-6 md:p-8 text-center">
            <div className="relative inline-block">
                <Avatar className="mx-auto mb-4 h-28 w-28 border-4 border-primary/20 shadow-lg">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                 {isTopDonor && (
                    <div className="absolute -bottom-1 -right-1 rounded-full bg-amber-500 p-1 text-white border-2 border-background">
                        <Award className="h-5 w-5" />
                    </div>
                )}
            </div>
          <TooltipProvider>
            <div className="flex items-center justify-center gap-2">
              <CardTitle className="text-2xl md:text-3xl">{user.name}</CardTitle>
              <div className="flex items-center gap-1">
                {isDonor && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <CheckCircle className="h-6 w-6 text-green-600 cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Verified Donor</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {user.isProMember && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button>
                        <Sparkles className="h-6 w-6 text-primary cursor-pointer" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Pro Member</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
          </TooltipProvider>
           {isTopDonor && (
            <div className="mt-2 text-sm font-bold text-amber-600 animate-pulse uppercase tracking-wider flex items-center justify-center gap-2">
                <Award className="h-4 w-4" /> Hall of Fame Donor
            </div>
          )}
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

      {isCurrentUserProfile && (
        <Card>
          <CardHeader>
            <CardTitle>AI Credits & Status</CardTitle>
            <CardDescription>
              Manage your AI features usage and Pro status.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-lg border p-4">
              <div className="space-y-1">
                <p className="font-medium">Your Status</p>
                {currentUser?.isProMember ? (
                  <Badge>
                    <Sparkles className="mr-2 h-4 w-4" /> Pro Member
                  </Badge>
                ) : (
                  <Badge variant="secondary">Standard Member</Badge>
                )}
              </div>
              <div className="space-y-1 mt-4 sm:mt-0 text-left sm:text-right">
                <p className="font-medium">AI Credits Remaining</p>
                <p className="text-2xl font-bold">{currentUser?.aiCredits ?? 0}</p>
                <p className="text-xs text-muted-foreground">
                  (1 credit = 1 AI generation)
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Pro members get exclusive benefits and bonus credits. You can
              become a Pro member by donating to our{' '}
              <Link href="/operational-costs" className="text-primary underline">
                Operational Costs
              </Link>{' '}
              fund. Each AI feature usage (like generating a story or summary)
              costs 1 credit.
            </p>
            <Button onClick={openDialog}>
              <Sparkles className="mr-2 h-4 w-4" /> Get More Credits or Go Pro
            </Button>
          </CardContent>
        </Card>
      )}

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
                            {donation.project === 'Operational Costs' ? (
                              <Link
                                href="/operational-costs"
                                className="hover:underline"
                              >
                                {donation.project}
                              </Link>
                            ) : project ? (
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
                          <TableCell>
                            {isClient
                              ? format(new Date(donation.date), 'PPP')
                              : null}
                          </TableCell>
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
                <CardTitle className="text-primary">
                  In-Kind Donations
                </CardTitle>
                <CardDescription>
                  Physical items generously donated by {user.name}.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileInKindDonations
                  donations={userInKindDonations}
                  projects={projects}
                  users={allUsers}
                />
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
                userFriends.map(
                  (friend) =>
                    friend && (
                      <Link
                        href={friend.profileUrl}
                        key={friend.id}
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
                      >
                        <Avatar className="h-10 w-10 border">
                          <AvatarImage
                            src={friend.avatarUrl}
                            alt={friend.name}
                          />
                          <AvatarFallback>
                            {friend.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{friend.name}</span>
                      </Link>
                    )
                )
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
