
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
import { Breadcrumbs } from './breadcrumbs';

function getPageTitle(pathname: string): string {
  if (pathname.startsWith('/projects/')) {
    return 'Project Details';
  }
   if (pathname.startsWith('/admin/')) {
    const parts = pathname.split('/');
    const lastPart = parts[parts.length - 1];
    if (lastPart === 'about') return 'Edit About Page';
    return 'Admin';
  }
  if (pathname.startsWith('/profile/')) {
    return 'User Profile';
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
    case '/admin':
      return 'Admin Dashboard';
    case '/about':
      return 'About Us';
    case '/profile':
        return 'My Profile';
    case '/settings':
        return 'Settings';
    default:
      return 'ClarityChain';
  }
}

export function Header() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-10 flex h-auto flex-col items-start gap-2 border-b bg-background/80 px-4 py-3 backdrop-blur-sm sm:px-6">
       <div className="flex w-full items-center gap-4">
        <div className="md:hidden">
          <SidebarTrigger />
        </div>
        <h1 className="text-xl font-semibold md:text-2xl">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
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
