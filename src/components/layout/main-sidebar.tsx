

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
  SidebarTrigger,
  SidebarSeparator,
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
  Mail,
  PlusSquare,
  BookOpen,
  Edit,
  ChevronDown,
  Sparkles,
  Award,
  Monitor,
  Tablet,
  Smartphone
} from 'lucide-react';
import { platformSettings } from '@/lib/data';
import { Button } from '../ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { useState } from 'react';
import { usePricingDialog } from '@/context/pricing-dialog-provider';
import { useAuth } from '@/context/auth-provider';
import Image from 'next/image';
import { AdminNotificationBadge } from './admin-notification-badge';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { cn } from '@/lib/utils';
import { ViewMode } from '@/hooks/use-mobile';


const menuItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard, className: 'text-sky-500' },
  { 
    href: '/projects', 
    label: 'All Projects', 
    icon: HeartHandshake, 
    className: 'text-red-500',
    subItems: [
        { href: '/projects/category/Education', label: 'Education' },
        { href: '/projects/category/Health', label: 'Health' },
        { href: '/projects/category/Relief', label: 'Relief' },
        { href: '/projects/category/Community', label: 'Community' },
    ]
  },
  { href: '/friends', label: 'Friends', icon: Users, className: 'text-blue-500' },
  { href: '/operational-costs', label: 'Operational Costs', icon: Briefcase, className: 'text-amber-600' },
  { href: '/hall-of-fame', label: 'Hall of Fame', icon: Award, className: 'text-amber-500' },
  { href: '/careers', label: 'Careers', icon: UserPlus, className: 'text-purple-500' },
  { href: '/reports', label: 'Reports', icon: FileText, className: 'text-teal-500' },
  { href: '/about', label: 'About', icon: Users, className: 'text-indigo-500' },
];

const adminMenuItems = [
    { href: '/admin', label: 'Admin Dashboard', icon: Shield, className: 'text-red-600' },
    { href: '/admin/setup-guide', label: 'Setup Guide', icon: BookOpen, className: 'text-blue-600' },
    { href: '/admin/about', label: 'Edit About Page', icon: Edit, className: 'text-green-600' },
    { href: '/admin/careers', label: 'Manage Careers', icon: UserPlus, className: 'text-purple-600' },
    { href: '/admin/help', label: 'Manage Help Page', icon: CircleHelp, className: 'text-orange-600' },
]

export function MainSidebar() {
  const pathname = usePathname();
  const { setOpenMobile, viewMode, setViewMode } = useSidebar();
  const [isAdminOpen, setIsAdminOpen] = useState(pathname.startsWith('/admin'));
  const [isProjectsOpen, setIsProjectsOpen] = useState(pathname.startsWith('/projects'));
  const { openDialog } = usePricingDialog();
  const { user } = useAuth();

  const canCreateCampaigns = user?.isAdmin || (platformSettings.campaignCreationEnabled && user?.canCreateCampaigns);


  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href) && href !== '/';
  };
  
  const handleLinkClick = () => {
    setOpenMobile(false);
  }
  
  const handleViewModeChange = (value: string) => {
    setViewMode(value as ViewMode);
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-2">
        <div className="flex w-full items-center justify-between group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-2">
            <Link href="/" className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center" onClick={handleLinkClick}>
                {platformSettings.appLogoUrl ? (
                    <Image src={platformSettings.appLogoUrl} alt={platformSettings.appName} width={32} height={32} className="h-8 w-8" />
                ) : (
                    <Logo className="h-8 w-8 text-primary" />
                )}
                <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">{platformSettings.appName}</span>
            </Link>
            <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-1">
        <SidebarMenu>
          {user && canCreateCampaigns && (
            <SidebarMenuItem>
                <Button asChild className="w-full justify-start text-base" size="lg">
                <Link href="/create-campaign" onClick={handleLinkClick}>
                    <PlusSquare className="mr-2 h-5 w-5" />
                    <span>Create Campaign</span>
                </Link>
                </Button>
            </SidebarMenuItem>
          )}
          {user && (
            <>
            <SidebarMenuItem>
              <SidebarMenuButton
                  asChild
                  isActive={isActive('/my-campaigns')}
                  tooltip={{ children: 'My Campaigns', side: 'right' }}
              >
                  <Link href="/my-campaigns" onClick={handleLinkClick}>
                  <HeartHandshake className="text-red-500" />
                  <span>My Campaigns</span>
                  </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            </>
          )}
          <SidebarMenuItem className="my-2">
            <hr className="border-sidebar-border"/>
          </SidebarMenuItem>
          {menuItems.map(({ href, label, icon: Icon, className, subItems }) => {
            if (subItems) {
                return (
                     <Collapsible key={href} open={isProjectsOpen} onOpenChange={setIsProjectsOpen} asChild>
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                 <SidebarMenuButton
                                    className="w-full"
                                    isActive={isActive(href)}
                                    tooltip={{ children: label, side: 'right' }}
                                >
                                    <Icon className={className} />
                                    <span>{label}</span>
                                    <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform ui-open:rotate-180" />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent asChild>
                                <SidebarMenuSub>
                                    {subItems.map((subItem) => (
                                        <SidebarMenuSubItem key={subItem.href}>
                                            <SidebarMenuSubButton asChild isActive={pathname === subItem.href}>
                                                <Link href={subItem.href} onClick={handleLinkClick}>
                                                    <span>{subItem.label}</span>
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    ))}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                     </Collapsible>
                )
            }
            return (
                <SidebarMenuItem key={href}>
                <SidebarMenuButton
                    asChild
                    isActive={isActive(href)}
                    tooltip={{ children: label, side: 'right' }}
                >
                    <Link href={href} onClick={handleLinkClick}>
                    <Icon className={className} />
                    <span>{label}</span>
                    </Link>
                </SidebarMenuButton>
                </SidebarMenuItem>
            )
          })}
           <SidebarMenuItem>
              <SidebarMenuButton
                  onClick={() => openDialog()}
                  tooltip={{ children: 'Pricing', side: 'right' }}
              >
                  <Sparkles className="text-yellow-500" />
                  <span>Pricing</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {user?.isAdmin && (
                 <Collapsible open={isAdminOpen} onOpenChange={setIsAdminOpen} asChild>
                    <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                             <SidebarMenuButton
                                className="w-full"
                                isActive={pathname.startsWith('/admin')}
                                tooltip={{ children: 'Admin', side: 'right' }}
                            >
                                <Shield className="text-red-600" />
                                <span>Admin</span>
                                <AdminNotificationBadge />
                                <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform ui-open:rotate-180" />
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent asChild>
                            <SidebarMenuSub>
                                {adminMenuItems.map(({ href, label, icon: Icon, className }) => (
                                    <SidebarMenuSubItem key={href}>
                                        <SidebarMenuSubButton asChild isActive={pathname === href}>
                                            <Link href={href} onClick={handleLinkClick}>
                                                <Icon className={className} />
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
                <Mail className="text-gray-500" />
                <span>Contact</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={{ children: 'Help', side: 'right' }} isActive={isActive('/help')}>
              <Link href="/help" onClick={handleLinkClick}>
                <CircleHelp className="text-gray-500" />
                <span>Help</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {user && (
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={{ children: 'Settings', side: 'right' }} isActive={isActive('/settings')}>
                <Link href="/settings" onClick={handleLinkClick}>
                    <Settings className="text-gray-500" />
                    <span>Settings</span>
                </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
         <SidebarSeparator />
         <div className="p-2 space-y-2 group-data-[collapsible=icon]:hidden">
            <Label className="text-xs text-muted-foreground">View Mode</Label>
             <RadioGroup defaultValue={viewMode} onValueChange={handleViewModeChange} className="flex">
                <div className="flex items-center">
                    <RadioGroupItem value="auto" id="view-auto" className="sr-only" />
                    <Label htmlFor="view-auto" className={cn("p-2 rounded-md cursor-pointer", viewMode === 'auto' && "bg-primary text-primary-foreground")}>Auto</Label>
                </div>
                <div className="flex items-center">
                    <RadioGroupItem value="desktop" id="view-desktop" className="sr-only" />
                    <Label htmlFor="view-desktop" className={cn("p-2 rounded-md cursor-pointer", viewMode === 'desktop' && "bg-primary text-primary-foreground")}><Monitor className="h-4 w-4" /></Label>
                </div>
                <div className="flex items-center">
                    <RadioGroupItem value="tablet" id="view-tablet" className="sr-only" />
                    <Label htmlFor="view-tablet" className={cn("p-2 rounded-md cursor-pointer", viewMode === 'tablet' && "bg-primary text-primary-foreground")}><Tablet className="h-4 w-4" /></Label>
                </div>
                 <div className="flex items-center">
                    <RadioGroupItem value="mobile" id="view-mobile" className="sr-only" />
                    <Label htmlFor="view-mobile" className={cn("p-2 rounded-md cursor-pointer", viewMode === 'mobile' && "bg-primary text-primary-foreground")}><Smartphone className="h-4 w-4" /></Label>
                </div>
            </RadioGroup>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
