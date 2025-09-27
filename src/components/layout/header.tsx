
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '../ui/button';
import { Bell, User } from 'lucide-react';
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
import { currentUser, notifications } from '@/lib/data';
import { NotificationList } from './notification-list';

function getPageTitle(pathname: string): string {
    if (pathname === '/admin/projects/new') {
    return 'Create New Project';
  }
  if (pathname.startsWith('/projects/')) {
    return 'Project Details';
  }
   if (pathname.startsWith('/admin/')) {
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

  switch (pathname) {
    case '/':
      return 'Dashboard';
    case '/projects':
      return 'Projects';
    case '/operational-costs':
      return 'Operational Costs';
    case '/reports':
      return 'AI Reports';
    case '/about':
      return 'About Us';
    case '/careers':
      return 'Careers';
    case '/help':
      return 'Help & Support';
    case '/profile':
        return 'My Profile';
    case '/settings':
        return 'Settings';
    case '/notifications':
        return 'Notifications';
    default:
      return 'ClarityChain';
  }
}

export function Header() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-10 flex h-auto flex-col items-start gap-2 border-b bg-background/80 px-4 py-3 backdrop-blur-sm sm:px-6">
       <div className="flex w-full items-center gap-4">
        <div className="md:hidden">
          <SidebarTrigger />
        </div>
        <h1 className="text-xl font-semibold md:text-2xl">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
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
                <NotificationList notifications={notifications} />
              </PopoverContent>
            </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile/current-user">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/">Logout</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Breadcrumbs />
    </header>
  );
}
