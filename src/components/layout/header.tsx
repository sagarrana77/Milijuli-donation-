
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '../ui/button';
import { Bell, User, LogIn, LogOut, Award } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Breadcrumbs } from './breadcrumbs';
import { NotificationList } from './notification-list';
import { useNotifications } from '@/context/notification-provider';
import { useAuth } from '@/context/auth-provider';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useLoginDialog } from '@/context/login-dialog-provider';
import { useMemo } from 'react';
import { allDonations, platformSettings } from '@/lib/data';
import { Logo } from '../icons/logo';
import Image from 'next/image';

function getPageTitle(pathname: string): string {
    if (pathname.startsWith('/admin/projects/new')) {
    return 'Create New Project';
  }
    if (pathname.startsWith('/admin/projects/') && pathname.endsWith('/edit')) {
    return 'Edit Project';
  }
    if (pathname.startsWith('/projects/')) {
    return 'Project Details';
  }
   if (pathname.startsWith('/admin')) {
    const parts = pathname.split('/');
    const lastPart = parts[parts.length - 1];
    if (lastPart === 'about') return 'Edit About Page';
    if (lastPart === 'careers') return 'Manage Careers';
    if (lastPart === 'help') return 'Manage Help Page';
    if (lastPart === 'setup-guide') return 'Admin Setup Guide';
    return 'Admin';
  }
  if (pathname.startsWith('/profile/')) {
    return 'User Profile';
  }
  if (pathname.startsWith('/team/')) {
    return 'Team Member Profile';
  }
  if (pathname.startsWith('/my-campaigns') && pathname.endsWith('/edit')) {
    return 'Edit Campaign';
  }
   if (pathname.startsWith('/my-campaigns')) {
    return 'My Campaigns';
  }
  if (pathname.startsWith('/create-campaign')) {
    return 'Create New Campaign';
  }


  switch (pathname) {
    case '/':
      return 'Dashboard';
    case '/projects':
      return 'All Projects';
    case '/friends':
        return 'Friends';
    case '/hall-of-fame':
        return 'Hall of Fame';
    case '/in-kind-donations':
        return 'In-Kind Donations';
    case '/operational-costs':
      return 'Operational Costs';
    case '/reports':
      return 'AI Reports';
    case '/about':
      return 'About Us';
    case '/pricing':
        return 'Pricing';
    case '/careers':
      return 'Careers';
    case '/help':
      return 'Help & Support';
    case '/contact':
        return 'Contact Us';
    case '/profile':
        return 'My Profile';
    case '/settings':
        return 'Settings';
    case '/notifications':
        return 'Notifications';
    case '/fund-relocation-policy':
        return 'Fund Relocation Policy';
    case '/login':
        return 'Login or Sign Up';
    default:
      return 'milijuli donation sewa';
  }
}

export function Header() {
  const pathname = usePathname();
  const { notifications } = useNotifications();
  const { user, signOut } = useAuth();
  const { openDialog } = useLoginDialog();
  const title = getPageTitle(pathname);
  const unreadCount = notifications.filter(n => !n.read).length;
  
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
  }, []);

  const isTopDonor = user ? topDonorIds.includes(user.uid) : false;

  return (
    <header className="sticky top-0 z-10 flex h-auto flex-col items-start gap-2 border-b bg-background/80 px-4 py-3 backdrop-blur-sm sm:px-6">
       <div className="flex w-full items-center gap-4">
        <SidebarTrigger className="md:flex" />
        <div className="flex items-center gap-2">
            {platformSettings.appLogoUrl ? (
                <Image src={platformSettings.appLogoUrl} alt={platformSettings.appName} width={32} height={32} className="h-8 w-8" />
            ) : (
                <Logo className="h-8 w-8 text-primary" />
            )}
            <span className="hidden sm:inline-block text-lg font-semibold">{platformSettings.appName}</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {user && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                  )}
                  <span className="sr-only">Toggle notifications</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0 md:w-96">
                <NotificationList />
              </PopoverContent>
            </Popover>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                 <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? ""} />
                        <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                     {isTopDonor && (
                        <div className="absolute -bottom-1 -right-1 rounded-full bg-amber-500 p-0.5 text-white border border-background">
                            <Award className="h-3 w-3" />
                        </div>
                    )}
                 </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/profile/${user.uid}`}>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={openDialog}>
                <LogIn className="mr-2 h-4 w-4" />
                Login
            </Button>
          )}
        </div>
      </div>
      <Breadcrumbs title={title} />
    </header>
  );
}
