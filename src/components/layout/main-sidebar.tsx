
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
  useSidebar,
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
  PlusSquare,
} from 'lucide-react';
import { currentUser } from '@/lib/data';
import { Button } from '../ui/button';

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
  const { setOpenMobile } = useSidebar();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    // For nested routes, we want to match the base path
    if (href === '/my-campaigns') {
      return pathname.startsWith('/my-campaigns');
    }
    return pathname.startsWith(href);
  };
  
  const handleLinkClick = () => {
    setOpenMobile(false);
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-8 text-primary" />
            <span className="text-lg font-semibold">ClarityChain</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-1">
        <SidebarMenu>
          <SidebarMenuItem>
            <Button asChild className="w-full justify-start text-base" size="lg">
              <Link href="/create-campaign" onClick={handleLinkClick}>
                <PlusSquare className="mr-2 h-5 w-5" />
                <span>Create Campaign</span>
              </Link>
            </Button>
          </SidebarMenuItem>
          {currentUser && (
            <SidebarMenuItem>
              <SidebarMenuButton
                  asChild
                  isActive={isActive('/my-campaigns')}
                  tooltip={{ children: 'My Campaigns', side: 'right' }}
              >
                  <Link href="/my-campaigns" onClick={handleLinkClick}>
                  <HeartHandshake />
                  <span>My Campaigns</span>
                  </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem className="my-2">
            <hr className="border-sidebar-border"/>
          </SidebarMenuItem>
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
                    <Link href={href} onClick={handleLinkClick}>
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
              <Link href="/contact" onClick={handleLinkClick}>
                <Mail />
                <span>Contact</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={{ children: 'Help', side: 'right' }} isActive={isActive('/help')}>
              <Link href="/help" onClick={handleLinkClick}>
                <CircleHelp />
                <span>Help</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={{ children: 'Settings', side: 'right' }} isActive={isActive('/settings')}>
              <Link href="/settings" onClick={handleLinkClick}>
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
