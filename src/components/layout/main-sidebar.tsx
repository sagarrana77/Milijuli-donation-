
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarClose,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons/logo';
import {
  LayoutDashboard,
  HeartHandshake,
  FileText,
  Settings,
  CircleHelp,
  Shield,
  Users,
  Briefcase,
  UserPlus,
  Package,
  Mail,
} from 'lucide-react';
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import { currentUser } from '@/lib/data';

const menuItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: HeartHandshake },
  { href: '/in-kind-donations', label: 'In-Kind Donations', icon: Package },
  { href: '/operational-costs', label: 'Operational Costs', icon: Briefcase },
  { href: '/careers', label: 'Careers', icon: UserPlus },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/about', label: 'About', icon: Users },
  { href: '/admin', label: 'Admin', icon: Shield, adminOnly: true },
];

export function MainSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-8 text-primary" />
            <span className="text-lg font-semibold">ClarityChain</span>
          </div>
          <div className='md:hidden'>
             <SidebarClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-5 w-5" />
              </Button>
            </SidebarClose>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-1">
        <SidebarMenu>
          {menuItems.map(({ href, label, icon: Icon, adminOnly }) => {
            if (adminOnly && !currentUser?.isAdmin) {
                return null;
            }
            return (
                <SidebarMenuItem key={href}>
                <SidebarMenuButton
                    asChild
                    isActive={isActive(href)}
                    tooltip={{ children: label, side: 'right' }}
                >
                    <Link href={href}>
                    <Icon />
                    <span>{label}</span>
                    </Link>
                </SidebarMenuButton>
                </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={{ children: 'Contact', side: 'right' }} isActive={isActive('/contact')}>
              <Link href="/contact">
                <Mail />
                <span>Contact</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={{ children: 'Help', side: 'right' }} isActive={isActive('/help')}>
              <Link href="/help">
                <CircleHelp />
                <span>Help</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={{ children: 'Settings', side: 'right' }} isActive={isActive('/settings')}>
              <Link href="/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
