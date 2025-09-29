
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
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
  BookOpen,
  Edit,
  ChevronDown,
} from 'lucide-react';
import { currentUser, platformSettings } from '@/lib/data';
import { Button } from '../ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { useState } from 'react';

const menuItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'All Projects', icon: HeartHandshake },
  { href: '/in-kind-donations', label: 'In-Kind Donations', icon: Package },
  { href: '/operational-costs', label: 'Operational Costs', icon: Briefcase },
  { href: '/careers', label: 'Careers', icon: UserPlus },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/about', label: 'About', icon: Users },
];

const adminMenuItems = [
    { href: '/admin', label: 'Admin Dashboard', icon: Shield },
    { href: '/admin/setup-guide', label: 'Setup Guide', icon: BookOpen },
    { href: '/admin/about', label: 'Edit About Page', icon: Edit },
    { href: '/admin/careers', label: 'Manage Careers', icon: UserPlus },
    { href: '/admin/help', label: 'Manage Help Page', icon: CircleHelp },
]

export function MainSidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const [isAdminOpen, setIsAdminOpen] = useState(pathname.startsWith('/admin'));

  const canCreateCampaigns = currentUser?.isAdmin || (platformSettings.campaignCreationEnabled && currentUser?.canCreateCampaigns);


  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href) && href !== '/';
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
          {canCreateCampaigns && (
            <SidebarMenuItem>
                <Button asChild className="w-full justify-start text-base" size="lg">
                <Link href="/create-campaign" onClick={handleLinkClick}>
                    <PlusSquare className="mr-2 h-5 w-5" />
                    <span>Create Campaign</span>
                </Link>
                </Button>
            </SidebarMenuItem>
          )}
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
          {menuItems.map(({ href, label, icon: Icon }) => (
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
          ))}
            {currentUser?.isAdmin && (
                 <Collapsible open={isAdminOpen} onOpenChange={setIsAdminOpen} asChild>
                    <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                             <SidebarMenuButton
                                className="w-full"
                                isActive={pathname.startsWith('/admin')}
                                tooltip={{ children: 'Admin', side: 'right' }}
                            >
                                <Shield />
                                <span>Admin</span>
                                <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform ui-open:rotate-180" />
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent asChild>
                            <SidebarMenuSub>
                                {adminMenuItems.map(({ href, label, icon: Icon }) => (
                                    <SidebarMenuSubItem key={href}>
                                        <SidebarMenuSubButton asChild isActive={pathname === href}>
                                            <Link href={href} onClick={handleLinkClick}>
                                                <Icon />
                                                <span>{label}</span>
                                            </Link>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                ))}
                            </SidebarMenuSub>
                        </CollapsibleContent>
                    </SidebarMenuItem>
                 </Collapsible>
            )}
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
