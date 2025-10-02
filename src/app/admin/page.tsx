
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  MoreHorizontal,
  PlusCircle,
  CreditCard,
  KeyRound,
  MessageSquare,
  Briefcase,
  MonitorSmartphone,
  ArrowDown,
  ArrowRight,
  Settings,
  List,
  Archive,
  HandCoins,
  Package,
  Users,
  Wand2,
  Loader2,
  Receipt,
  ShoppingCart,
  Copy,
  Sparkles,
  Gift,
  Trash2,
  AlertTriangle,
  DollarSign,
  ArrowLeftRight,
} from 'lucide-react';
import { projects, dashboardStats, miscExpenses, salaries, equipment, socialLinks, physicalDonations, paymentGateways, platformSettings, users, operationalCostsFund, allDonations, getImageUrl, fundTransfers, currentUser } from '@/lib/data';
import type { PhysicalDonation, Project, User, Donation, FundTransfer } from '@/lib/data';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WhatsAppIcon from '@/components/icons/whatsapp-icon';
import { ViberIcon } from '@/components/icons/viber-icon';
import InstagramIcon from '@/components/icons/instagram-icon';
import MessengerIcon from '@/components/icons/messenger-icon';
import { RecordExpenseDialog } from '@/components/admin/record-expense-dialog';
import { TransferFundsDialog } from '@/components/admin/transfer-funds-dialog';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { generateWish, GenerateWishOutput } from '@/ai/flows/generate-wishes';
import { generateSocialMediaPost, GenerateSocialMediaPostOutput } from '@/ai/flows/generate-social-media-post';
import { generateRecoveryPlan, GenerateRecoveryPlanOutput } from '@/ai/flows/generate-recovery-plan';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/ui/pagination';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';


const ITEMS_PER_PAGE = 5;
const MONETARY_DONATIONS_PER_PAGE = 10;
const TRANSFERS_PER_PAGE = 10;

export default function AdminDashboardPage() {
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const { toast } = useToast();
  const [_, setForceRender] = useState(0);

  const [newSalary, setNewSalary] = useState({ employee: '', role: '', salary: '' });
  const [newEquipment, setNewEquipment] = useState({ item: '', cost: '', purchaseDate: '', vendor: '', imageUrl: '', imageHint: '' });
  const [newMiscExpense, setNewMiscExpense] = useState({ item: '', cost: '', purchaseDate: '', vendor: '' });
  const [newInKindDonation, setNewInKindDonation] = useState({
    donorName: '',
    projectId: '',
    wishlistItemId: '',
    quantity: '1',
    date: format(new Date(), 'yyyy-MM-dd'),
  });
  const [wishOccasion, setWishOccasion] = useState('');
  const [generatedWish, setGeneratedWish] = useState<GenerateWishOutput | null>(null);
  const [isGeneratingWish, setIsGeneratingWish] = useState(false);
  
  const [socialPostProjectId, setSocialPostProjectId] = useState('');
  const [socialPostPlatform, setSocialPostPlatform] = useState('Twitter');
  const [generatedSocialPost, setGeneratedSocialPost] = useState<GenerateSocialMediaPostOutput | null>(null);
  const [isGeneratingSocialPost, setIsGeneratingSocialPost] = useState(false);

  const [isGeneratingRecoveryPlan, setIsGeneratingRecoveryPlan] = useState(false);
  const [recoveryPlan, setRecoveryPlan] = useState<GenerateRecoveryPlanOutput | null>(null);
  const [isRecoveryPlanOpen, setIsRecoveryPlanOpen] = useState(false);
  
  const [projectPage, setProjectPage] = useState(1);
  const [inKindDonationPage, setInKindDonationPage] = useState(1);
  const [monetaryDonationPage, setMonetaryDonationPage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const [transferPage, setTransferPage] = useState(1);

  const paginatedProjects = projects.slice(
    (projectPage - 1) * ITEMS_PER_PAGE,
    projectPage * ITEMS_PER_PAGE
  );
  const totalProjectPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
  
  const paginatedInKindDonations = physicalDonations.slice(
    (inKindDonationPage - 1) * ITEMS_PER_PAGE,
    inKindDonationPage * ITEMS_PER_PAGE
  );
  const totalInKindDonationPages = Math.ceil(physicalDonations.length / ITEMS_PER_PAGE);
  
  const sortedMonetaryDonations = allDonations.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const paginatedMonetaryDonations = sortedMonetaryDonations.slice(
    (monetaryDonationPage - 1) * MONETARY_DONATIONS_PER_PAGE,
    monetaryDonationPage * MONETARY_DONATIONS_PER_PAGE
  );
  const totalMonetaryDonationPages = Math.ceil(allDonations.length / MONETARY_DONATIONS_PER_PAGE);

  const nonAdminUsers = users.filter(u => u.id !== 'milijuli-sewa-admin');
  const paginatedUsers = nonAdminUsers.slice(
    (userPage - 1) * ITEMS_PER_PAGE,
    userPage * ITEMS_PER_PAGE
  );
  const totalUserPages = Math.ceil(nonAdminUsers.length / ITEMS_PER_PAGE);

  const sortedTransfers = fundTransfers.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const paginatedTransfers = sortedTransfers.slice(
    (transferPage - 1) * TRANSFERS_PER_PAGE,
    transferPage * TRANSFERS_PER_PAGE
  );
  const totalTransferPages = Math.ceil(fundTransfers.length / TRANSFERS_PER_PAGE);


  const handleAddSalary = () => {
    if (newSalary.employee && newSalary.role && newSalary.salary) {
      salaries.push({ id: `sal-${Date.now()}`, ...newSalary, salary: parseFloat(newSalary.salary), currency: 'NPR' });
      setNewSalary({ employee: '', role: '', salary: '' });
      toast({ title: "Salary Added", description: "The new salary has been recorded." });
      setForceRender(c => c + 1);
    }
  };
  
  const handleDeleteSalary = (id: string) => {
    const index = salaries.findIndex(s => s.id === id);
    if(index > -1) {
        salaries.splice(index, 1);
        setForceRender(c => c + 1);
        toast({ title: "Salary Deleted", description: "The salary has been removed." });
    }
  }

  const handleAddEquipment = () => {
    if (newEquipment.item && newEquipment.cost && newEquipment.purchaseDate && newEquipment.vendor) {
        const newEquip = { 
            id: `eq-${Date.now()}`, 
            item: newEquipment.item,
            cost: parseFloat(newEquipment.cost),
            purchaseDate: newEquipment.purchaseDate,
            vendor: newEquipment.vendor,
            imageUrl: newEquipment.imageUrl,
            imageHint: newEquipment.imageHint,
        };
      equipment.push(newEquip);
      setNewEquipment({ item: '', cost: '', purchaseDate: '', vendor: '', imageUrl: '', imageHint: '' });
      toast({ title: "Equipment Added", description: "The new equipment cost has been recorded." });
      setForceRender(c => c + 1);
    }
  };
  
  const handleDeleteEquipment = (id: string) => {
    const index = equipment.findIndex(s => s.id === id);
    if(index > -1) {
        equipment.splice(index, 1);
        setForceRender(c => c + 1);
        toast({ title: "Equipment Deleted", description: "The equipment has been removed." });
    }
  }
  
  const handleAddMiscExpense = () => {
      if (newMiscExpense.item && newMiscExpense.cost && newMiscExpense.purchaseDate && newMiscExpense.vendor) {
          const newMisc = { 
              id: `misc-${Date.now()}`, 
              item: newMiscExpense.item,
              cost: parseFloat(newMiscExpense.cost),
              purchaseDate: newMiscExpense.purchaseDate,
              vendor: newMiscExpense.vendor
          };
        miscExpenses.push(newMisc);
        setNewMiscExpense({ item: '', cost: '', purchaseDate: '', vendor: '' });
        toast({ title: "Misc. Expense Added", description: "The new expense has been recorded." });
        setForceRender(c => c + 1);
      }
    };
    
    const handleDeleteMiscExpense = (id: string) => {
        const index = miscExpenses.findIndex(s => s.id === id);
        if(index > -1) {
            miscExpenses.splice(index, 1);
            setForceRender(c => c + 1);
            toast({ title: "Expense Deleted", description: "The expense has been removed." });
        }
    }

    const handleAddInKindDonation = () => {
        if (newInKindDonation.donorName && newInKindDonation.wishlistItemId) {
          const project = projects.find(p => p.id === newInKindDonation.projectId);
          const donor = users.find(u => u.name === newInKindDonation.donorName);
          const wishlistItem = project?.wishlist.find(w => w.id === newInKindDonation.wishlistItemId);
    
          if (!project || !donor || !wishlistItem) {
            toast({ variant: 'destructive', title: "Error", description: "Invalid selection. Please check all fields." });
            return;
          }
    
          const newDonation: PhysicalDonation = {
            id: `pd-admin-${Date.now()}`,
            donorId: donor.id,
            donorName: newInKindDonation.donorName,
            donorEmail: donor.email || 'N/A',
            projectName: project.name,
            projectId: project.id,
            itemName: wishlistItem.name,
            quantity: parseInt(newInKindDonation.quantity, 10),
            donationType: 'received',
            status: 'Completed',
            date: newInKindDonation.date,
            comments: [],
          };
    
          physicalDonations.unshift(newDonation);
    
          const newUpdate: Project['updates'][0] = {
            id: `update-inkind-${Date.now()}`,
            title: `New In-Kind Donation Received!`,
            description: `${newInKindDonation.donorName} generously donated ${newInKindDonation.quantity}x ${wishlistItem.name}.`,
            date: newInKindDonation.date,
            isInKindDonation: true,
            inKindDonationDetails: {
              donorName: newInKindDonation.donorName,
              itemName: wishlistItem.name,
              quantity: parseInt(newInKindDonation.quantity, 10),
            },
          };
    
          project.updates.unshift(newUpdate);
          wishlistItem.quantityDonated += parseInt(newInKindDonation.quantity, 10);
    
          setNewInKindDonation({
            donorName: '',
            projectId: '',
            wishlistItemId: '',
            quantity: '1',
            date: format(new Date(), 'yyyy-MM-dd'),
          });
    
          toast({ title: "In-Kind Donation Posted", description: "The donation has been recorded and an update was posted to the project page." });
          setForceRender(c => c + 1);
        }
      };


  const handleGenerateQr = (name: string) => {
    const gateway = paymentGateways.find(g => g.name === name);
    if (gateway && gateway.qrValue) {
      gateway.generatedQr = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(gateway.qrValue)}`;
      setForceRender(c => c + 1);
    }
  };
  
  const handleGatewayToggle = (name: string) => {
    const gateway = paymentGateways.find(g => g.name === name);
    if (gateway) {
        gateway.enabled = !gateway.enabled;
        setForceRender(c => c + 1);
    }
  }

  const handleExpenseRecorded = (data: { project: string; item: string; amount: number }) => {
    const project = projects.find(p => p.name === data.project);

    if (data.project === 'Operational Costs') {
        operationalCostsFund.raisedAmount -= data.amount;
    } else if (project) {
        project.raisedAmount -= data.amount;
        const newUpdate: Project['updates'][0] = {
            id: `update-expense-${Date.now()}`,
            title: 'Funds Utilized for Project Expense',
            description: `An amount of Rs.${data.amount.toLocaleString()} was spent on "${data.item}".`,
            date: new Date().toISOString(),
            isExpense: true,
            expenseDetails: {
                item: data.item,
                amount: data.amount,
            }
        };
        project.updates.unshift(newUpdate);
         project.expenses.unshift({
            id: `exp-${Date.now()}`,
            item: data.item,
            amount: data.amount,
            date: new Date().toISOString(),
            receiptUrl: getImageUrl('receipt-1'),
            receiptHint: 'receipt scan'
        });
    }

    const categoryMap: { [key: string]: string } = {
        'Education for All Nepal': 'Education',
        'Clean Water Initiative': 'Health',
        'Community Health Posts': 'Health',
        'Disaster Relief Fund': 'Relief',
        'Operational Costs': 'Operational'
    };

    const categoryName = categoryMap[data.project] || 'Misc';
    const spendingCategory = dashboardStats.spendingBreakdown.find(c => c.name === categoryName);

    if (spendingCategory) {
        spendingCategory.value += data.amount;
    } else {
        console.warn(`Category "${categoryName}" not found in spending breakdown.`);
    }

    dashboardStats.totalSpent += data.amount;
    dashboardStats.fundsInHand -= data.amount;

    toast({
        title: 'Expense Recorded!',
        description: 'The expense has been logged and relevant funds updated.',
    });
    setForceRender(c => c + 1);
}


  const handleFundsTransferred = (data: { from: string; to: string; amount: number; reason: string }) => {
    const fromProject = projects.find(p => p.name === data.from);
    const toProject = projects.find(p => p.name === data.to);

    if (data.from === 'Operational Costs') {
        operationalCostsFund.raisedAmount -= data.amount;
    } else if (fromProject) {
        fromProject.raisedAmount -= data.amount;
        const fromUpdate = {
            id: `update-transfer-from-${Date.now()}`,
            title: 'Fund Transfer',
            description: `An amount of Rs.${data.amount.toLocaleString()} was transferred from this project to "${data.to}". Reason: ${data.reason}`,
            date: new Date().toISOString(),
            isTransfer: true,
            transferDetails: { amount: data.amount, toProject: data.to }
        };
        fromProject.updates.unshift(fromUpdate);
    }
    
    if (data.to === 'Operational Costs') {
        operationalCostsFund.raisedAmount += data.amount;
    } else if (toProject) {
        toProject.raisedAmount += data.amount;
        const toUpdate = {
            id: `update-transfer-to-${Date.now()}`,
            title: 'Funds Received',
            description: `An amount of Rs.${data.amount.toLocaleString()} was received from "${data.from}". Reason: ${data.reason}`,
            date: new Date().toISOString(),
            isTransfer: true,
            transferDetails: { amount: data.amount, fromProject: data.from }
        };
        toProject.updates.unshift(toUpdate);
    }

    const newTransfer: FundTransfer = {
        id: `transfer-${Date.now()}`,
        date: new Date().toISOString(),
        amount: data.amount,
        from: data.from,
        to: data.to,
        reason: data.reason,
        adminId: currentUser?.id || 'unknown-admin',
      };
      fundTransfers.unshift(newTransfer);

    toast({
        title: 'Funds Transferred',
        description: 'The funds have been successfully transferred and updates posted.',
    });
    setForceRender(c => c + 1);
  }
  
  const handleSaveSocialLinks = () => {
    toast({
        title: 'Social Links Saved!',
        description: 'Your contact links have been updated.',
    });
    setForceRender(c => c + 1);
  }

  const handleStatusChange = (donationId: string, status: PhysicalDonation['status']) => {
    const donation = physicalDonations.find(d => d.id === donationId);
    if (donation) {
      const wasCompleted = donation.status === 'Completed';
      donation.status = status;
  
      // If the status is changed to 'Completed', update the project's wishlist
      if (status === 'Completed' && !wasCompleted) {
        const project = projects.find(p => p.name === donation.projectName);
        if (project && project.wishlist) {
          const wishlistItem = project.wishlist.find(item => item.name === donation.itemName);
          if (wishlistItem) {
            wishlistItem.quantityDonated += donation.quantity;
          }
        }
      } else if (wasCompleted && status !== 'Completed') {
        // If the status is changed from 'Completed' to something else, revert the count
         const project = projects.find(p => p.name === donation.projectName);
        if (project && project.wishlist) {
          const wishlistItem = project.wishlist.find(item => item.name === donation.itemName);
          if (wishlistItem) {
            wishlistItem.quantityDonated -= donation.quantity;
          }
        }
      }
  
      setForceRender(c => c + 1);
      toast({
        title: 'Status Updated!',
        description: `Donation status changed to ${status}.`,
      });
    }
  };

  const handleUserQrToggle = (enabled: boolean) => {
    platformSettings.userQrPaymentsEnabled = enabled;
    setForceRender(c => c + 1);
    toast({
        title: 'Setting Updated!',
        description: `User campaign QR codes have been ${enabled ? 'enabled' : 'disabled'}.`
    });
  }
  
  const handleCampaignCreationToggle = (enabled: boolean) => {
    platformSettings.campaignCreationEnabled = enabled;
    setForceRender(c => c + 1);
    toast({
        title: 'Setting Updated!',
        description: `Campaign creation for users has been ${enabled ? 'enabled' : 'disabled'}.`
    });
  }

  const handleUserPermissionToggle = (userId: string, canCreate: boolean) => {
    const user = users.find(u => u.id === userId);
    if (user) {
        user.canCreateCampaigns = canCreate;
        setForceRender(c => c + 1);
        toast({
            title: 'Permission Updated!',
            description: `${user.name}'s ability to create campaigns has been ${canCreate ? 'enabled' : 'disabled'}.`
        });
    }
  }

  const handleUserProMemberToggle = (userId: string, isPro: boolean) => {
    const user = users.find(u => u.id === userId);
    if (user) {
        user.isProMember = isPro;
        setForceRender(c => c + 1);
        toast({
            title: 'Pro Status Updated!',
            description: `${user.name} is ${isPro ? 'now' : 'no longer'} a Pro Member.`
        });
    }
  }

  const handleGenerateWish = async () => {
    if (!wishOccasion) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please enter an occasion.' });
      return;
    }
    setIsGeneratingWish(true);
    setGeneratedWish(null);
    try {
      const result = await generateWish({ occasion: wishOccasion });
      setGeneratedWish(result);
    } catch (error) {
      console.error('Error generating wish:', error);
      toast({
        variant: 'destructive',
        title: 'Error Generating Wish',
        description: 'There was a problem communicating with the AI. Please try again.',
      });
    } finally {
      setIsGeneratingWish(false);
    }
  };
  
  const handleSendWish = () => {
    if (!generatedWish) return;
    // In a real app, this would trigger an email/notification service for all users.
    console.log(`Sending wish to all users: ${generatedWish.wish}`);
    toast({
      title: 'Wish Sent!',
      description: 'The message has been queued for delivery to all users.',
    });
  };

  const handleShowTotalCostToggle = (enabled: boolean) => {
    platformSettings.showOperationalCostsTotal = enabled;
    setForceRender(c => c + 1);
    toast({
        title: 'Setting Updated!',
        description: `Operational cost total is now ${enabled ? 'visible' : 'hidden'} to users.`
    });
  }

  const handleShowOpsTargetToggle = (enabled: boolean) => {
    platformSettings.showOperationalCostsTarget = enabled;
    setForceRender(c => c + 1);
    toast({
        title: 'Setting Updated!',
        description: `Operational cost target is now ${enabled ? 'visible' : 'hidden'} to users.`
    });
  }
  
  const handleGenerateSocialPost = async () => {
    if (!socialPostProjectId) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please select a project.' });
      return;
    }
    setIsGeneratingSocialPost(true);
    setGeneratedSocialPost(null);
    try {
      const result = await generateSocialMediaPost({
        projectId: socialPostProjectId,
        platform: socialPostPlatform as 'Twitter' | 'Facebook',
      });
      setGeneratedSocialPost(result);
    } catch (error) {
      console.error('Error generating social post:', error);
      toast({
        variant: 'destructive',
        title: 'Error Generating Post',
        description: 'There was a problem communicating with the AI. Please try again.',
      });
    } finally {
      setIsGeneratingSocialPost(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to Clipboard!" });
  };

  const handleAiSummaryToggle = (enabled: boolean) => {
    platformSettings.aiSummaryEnabled = enabled;
    setForceRender(c => c + 1);
    toast({
        title: 'Setting Updated!',
        description: `Public AI summary generation has been ${enabled ? 'enabled' : 'disabled'}.`
    });
  }
  
  const handleAppNameChange = () => {
    toast({
        title: 'App Name Updated!',
        description: 'The application name has been saved.',
    });
    // This forces a re-render to reflect the change in the sidebar
    setForceRender(c => c + 1);
  }
  
  const handleAppLogoChange = () => {
    toast({
        title: 'App Logo Updated!',
        description: 'The application logo has been saved.',
    });
    setForceRender(c => c + 1);
  }
  
  const handleAddLoginImage = () => {
    platformSettings.loginImages.push({ imageUrl: '', label: '' });
    setForceRender(c => c + 1);
  };
  
  const handleDeleteLoginImage = (index: number) => {
    platformSettings.loginImages.splice(index, 1);
    setForceRender(c => c + 1);
  };

  const handleSaveLoginImages = () => {
    toast({
        title: 'Login Images Updated!',
        description: 'The login page carousel images have been saved.',
    });
    setForceRender(c => c + 1);
  };

  const handleGenerateRecoveryPlan = async () => {
    setIsGeneratingRecoveryPlan(true);
    setRecoveryPlan(null);
    try {
        const result = await generateRecoveryPlan({ negativeAmount: dashboardStats.fundsInHand });
        setRecoveryPlan(result);
        setIsRecoveryPlanOpen(true);
    } catch (error) {
        console.error('Error generating recovery plan:', error);
        toast({
            variant: 'destructive',
            title: 'Error Generating Plan',
            description: 'There was a problem communicating with the AI. Please try again.',
        });
    } finally {
        setIsGeneratingRecoveryPlan(false);
    }
  };


  return (
    <div className="flex flex-col gap-8">
      <RecordExpenseDialog 
        isOpen={isExpenseDialogOpen} 
        onOpenChange={setIsExpenseDialogOpen} 
        onExpenseRecorded={handleExpenseRecorded}
      />
      <TransferFundsDialog
        isOpen={isTransferDialogOpen}
        onOpenChange={setIsTransferDialogOpen}
        onFundsTransferred={handleFundsTransferred}
      />
      <Dialog open={isRecoveryPlanOpen} onOpenChange={setIsRecoveryPlanOpen}>
        <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
                <DialogTitle>AI-Powered Financial Recovery Plan</DialogTitle>
                <DialogDescription>
                    Here are some strategies to address the negative fund balance of Rs.{Math.abs(dashboardStats.fundsInHand).toLocaleString()}.
                </DialogDescription>
            </DialogHeader>
            <div className="prose prose-sm max-w-none mt-4" dangerouslySetInnerHTML={{ __html: recoveryPlan?.plan.replace(/\n/g, '<br />') || '' }} />
        </DialogContent>
      </Dialog>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your platform settings and content.
          </p>
        </div>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>Fund Overview</CardTitle>
          <CardDescription>
            A real-time overview of your organization's finances.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Total Raised</h3>
            <p className="text-2xl font-bold">Rs.{dashboardStats.totalFunds.toLocaleString()}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Total Spent</h3>
            <p className="text-2xl font-bold">Rs.{dashboardStats.totalSpent.toLocaleString()}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Funds in Hand</h3>
            <p className={`text-2xl font-bold ${dashboardStats.fundsInHand < 0 ? 'text-destructive' : 'text-primary'}`}>Rs.{dashboardStats.fundsInHand.toLocaleString()}</p>
          </div>
           <div className="rounded-lg border bg-accent/20 p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Actions</h3>
            <div className="mt-2 flex flex-col gap-2">
                 <Button size="sm" onClick={() => setIsExpenseDialogOpen(true)}>
                    <ArrowDown className="mr-2 h-4 w-4" />
                    Record Expense
                </Button>
                <Button size="sm" onClick={() => setIsTransferDialogOpen(true)}>
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Transfer Funds
                </Button>
            </div>
          </div>
        </CardContent>
         {dashboardStats.fundsInHand < 0 && (
            <CardFooter>
                 <div className="w-full rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 mt-1" />
                        <div>
                            <p className="font-bold">Urgent: Negative Fund Balance</p>
                            <p className="text-sm">
                                Your funds in hand are negative. Immediate action is recommended to ensure financial stability.
                            </p>
                            <Button variant="destructive" size="sm" className="mt-2" onClick={handleGenerateRecoveryPlan} disabled={isGeneratingRecoveryPlan}>
                                {isGeneratingRecoveryPlan ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Wand2 className="mr-2 h-4 w-4" />
                                )}
                                Generate Recovery Plan
                            </Button>
                        </div>
                    </div>
                 </div>
            </CardFooter>
        )}
      </Card>
      
      <Tabs defaultValue="projects">
        <TooltipProvider>
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 lg:grid-cols-8">
                <Tooltip><TooltipTrigger asChild><TabsTrigger value="projects"><List className="h-4 w-4 md:mr-2" /><span className="hidden md:inline">Projects</span></TabsTrigger></TooltipTrigger><TooltipContent>Projects</TooltipContent></Tooltip>
                <Tooltip><TooltipTrigger asChild><TabsTrigger value="donations"><DollarSign className="h-4 w-4 md:mr-2" /><span className="hidden md:inline">Monetary Donations</span></TabsTrigger></TooltipTrigger><TooltipContent>Monetary Donations</TooltipContent></Tooltip>
                <Tooltip><TooltipTrigger asChild><TabsTrigger value="in-kind"><HandCoins className="h-4 w-4 md:mr-2" /><span className="hidden md:inline">In-Kind</span></TabsTrigger></TooltipTrigger><TooltipContent>In-Kind Donations</TooltipContent></Tooltip>
                <Tooltip><TooltipTrigger asChild><TabsTrigger value="transfers"><ArrowLeftRight className="h-4 w-4 md:mr-2" /><span className="hidden md:inline">Transfers</span></TabsTrigger></TooltipTrigger><TooltipContent>Fund Transfers</TooltipContent></Tooltip>
                <Tooltip><TooltipTrigger asChild><TabsTrigger value="operational-costs"><Briefcase className="h-4 w-4 md:mr-2" /><span className="hidden md:inline">Operational Costs</span></TabsTrigger></TooltipTrigger><TooltipContent>Operational Costs</TooltipContent></Tooltip>
                <Tooltip><TooltipTrigger asChild><TabsTrigger value="user-management"><Users className="h-4 w-4 md:mr-2" /><span className="hidden md:inline">Users</span></TabsTrigger></TooltipTrigger><TooltipContent>User Management</TooltipContent></Tooltip>
                <Tooltip><TooltipTrigger asChild><TabsTrigger value="ai-tools"><Wand2 className="h-4 w-4 md:mr-2" /><span className="hidden md:inline">AI Tools</span></TabsTrigger></TooltipTrigger><TooltipContent>AI Tools</TooltipContent></Tooltip>
                <Tooltip><TooltipTrigger asChild><TabsTrigger value="settings"><Settings className="h-4 w-4 md:mr-2" /><span className="hidden md:inline">Settings</span></TabsTrigger></TooltipTrigger><TooltipContent>Platform Settings</TooltipContent></Tooltip>
            </TabsList>
        </TooltipProvider>
        <TabsContent value="projects" className="mt-6">
             <Card>
                <CardHeader>
                <CardTitle>Manage Projects</CardTitle>
                <CardDescription>
                    A list of all projects in the system. You can add, edit, or remove them.
                </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-4 flex justify-end">
                        <Button asChild>
                            <Link href="/admin/projects/new">
                                <PlusCircle className="mr-2 h-4 w-4" /> Add Project
                            </Link>
                        </Button>
                    </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Project Name</TableHead>
                            <TableHead>Organization</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Raised</TableHead>
                            <TableHead>Donors</TableHead>
                            <TableHead>
                            <span className="sr-only">Actions</span>
                            </TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {paginatedProjects.map((project) => (
                            <TableRow key={project.id}>
                            <TableCell className="font-medium">{project.name}</TableCell>
                            <TableCell>{project.organization}</TableCell>
                            <TableCell>
                                <Badge variant={project.verified ? 'default' : 'secondary'}>
                                {project.verified ? 'Verified' : 'Unverified'}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                Rs.{project.raisedAmount.toLocaleString()}
                            </TableCell>
                            <TableCell>{project.donors.toLocaleString()}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                    aria-haspopup="true"
                                    size="icon"
                                    variant="ghost"
                                    >
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem asChild><Link href={`/admin/projects/${project.id}/edit`}>Edit</Link></DropdownMenuItem>
                                    <DropdownMenuItem>Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </div>
                </CardContent>
                {totalProjectPages > 1 && (
                    <CardFooter>
                        <Pagination currentPage={projectPage} totalPages={totalProjectPages} onPageChange={setProjectPage} />
                    </CardFooter>
                )}
            </Card>
        </TabsContent>
         <TabsContent value="donations" className="mt-6">
             <Card>
                <CardHeader>
                    <CardTitle>Monetary Donations Log</CardTitle>
                    <CardDescription>
                        A complete record of all monetary donations made to any project or fund.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Donor</TableHead>
                                    <TableHead>Project</TableHead>
                                    <TableHead className="text-right">Amount (NPR)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedMonetaryDonations.map(donation => (
                                    <TableRow key={donation.id}>
                                        <TableCell>{format(new Date(donation.date), 'PPp')}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={donation.donor.avatarUrl} alt={donation.donor.name} />
                                                    <AvatarFallback>{donation.donor.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <Link href={donation.donor.profileUrl} className="font-medium hover:underline">{donation.donor.name}</Link>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Link href={`/projects/${projects.find(p => p.name === donation.project)?.id}`} className="hover:underline">
                                                {donation.project}
                                            </Link>
                                        </TableCell>
                                        <TableCell className="text-right font-semibold text-primary">Rs.{donation.amount.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
                 {totalMonetaryDonationPages > 1 && (
                    <CardFooter>
                        <Pagination currentPage={monetaryDonationPage} totalPages={totalMonetaryDonationPages} onPageChange={setMonetaryDonationPage} />
                    </CardFooter>
                )}
             </Card>
        </TabsContent>
        <TabsContent value="in-kind" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>In-Kind Donation Management</CardTitle>
                    <CardDescription>
                        Manage and track physical item donations from your supporters.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="pledges">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="pledges"><List className="mr-2 h-4 w-4"/> Pledges & Donations</TabsTrigger>
                            <TabsTrigger value="post-received"><Package className="mr-2 h-4 w-4"/> Post Received Donation</TabsTrigger>
                        </TabsList>
                        <TabsContent value="pledges" className="mt-4">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Donor</TableHead>
                                            <TableHead>Item</TableHead>
                                            <TableHead>Project</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead><span className="sr-only">Actions</span></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedInKindDonations.map(donation => (
                                            <TableRow key={donation.id}>
                                                <TableCell>{new Date(donation.date).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{donation.donorName}</div>
                                                    <div className="text-sm text-muted-foreground">{donation.donorEmail}</div>
                                                </TableCell>
                                                <TableCell>{donation.itemName} (x{donation.quantity})</TableCell>
                                                <TableCell>{donation.projectName}</TableCell>
                                                <TableCell>
                                                    <Badge variant={
                                                        donation.status === 'Completed' ? 'default' : 
                                                        donation.status === 'Cancelled' ? 'destructive' : 'secondary'
                                                    }>
                                                        {donation.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => handleStatusChange(donation.id, 'Pending')}>
                                                                Mark as Pending
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleStatusChange(donation.id, 'Completed')}>
                                                                Mark as Completed
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleStatusChange(donation.id, 'Cancelled')} className="text-destructive">
                                                                Mark as Cancelled
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                             {totalInKindDonationPages > 1 && (
                                <div className="mt-4">
                                   <Pagination currentPage={inKindDonationPage} totalPages={totalInKindDonationPages} onPageChange={setInKindDonationPage} />
                                </div>
                            )}
                        </TabsContent>
                         <TabsContent value="post-received" className="mt-4">
                            <div className="space-y-4 rounded-md border p-4">
                                <h3 className="font-semibold mb-2">Post a Received In-Kind Donation</h3>
                                <div className="space-y-4">
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Donor</Label>
                                            <Select value={newInKindDonation.donorName} onValueChange={(value) => setNewInKindDonation({...newInKindDonation, donorName: value})}>
                                                <SelectTrigger><SelectValue placeholder="Select a donor" /></SelectTrigger>
                                                <SelectContent>
                                                    {users.map(user => <SelectItem key={user.id} value={user.name}>{user.name}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Project</Label>
                                            <Select value={newInKindDonation.projectId} onValueChange={(value) => setNewInKindDonation({...newInKindDonation, projectId: value, wishlistItemId: ''})}>
                                                <SelectTrigger><SelectValue placeholder="Select a project" /></SelectTrigger>
                                                <SelectContent>
                                                    {projects.map(project => <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {newInKindDonation.projectId && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Wishlist Item</Label>
                                            <Select value={newInKindDonation.wishlistItemId} onValueChange={(value) => setNewInKindDonation({...newInKindDonation, wishlistItemId: value})}>
                                                <SelectTrigger><SelectValue placeholder="Select an item" /></SelectTrigger>
                                                <SelectContent>
                                                    {projects.find(p => p.id === newInKindDonation.projectId)?.wishlist.map(item => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                         <div className="space-y-2">
                                            <Label>Quantity Received</Label>
                                            <Input type="number" placeholder="1" value={newInKindDonation.quantity} onChange={(e) => setNewInKindDonation({...newInKindDonation, quantity: e.target.value})} />
                                        </div>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label>Date Received</Label>
                                        <Input type="date" value={newInKindDonation.date} onChange={(e) => setNewInKindDonation({...newInKindDonation, date: e.target.value})} />
                                    </div>
                                </div>
                                <Button className="mt-4" onClick={handleAddInKindDonation} disabled={!newInKindDonation.wishlistItemId}>Post Donation</Button>
                            </div>
                         </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="transfers" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>Fund Transfer Log</CardTitle>
                    <CardDescription>
                        A complete record of all internal fund transfers.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>From</TableHead>
                                    <TableHead>To</TableHead>
                                    <TableHead className="text-right">Amount (NPR)</TableHead>
                                    <TableHead>Reason</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedTransfers.map(transfer => (
                                    <TableRow key={transfer.id}>
                                        <TableCell>{format(new Date(transfer.date), 'PPp')}</TableCell>
                                        <TableCell>{transfer.from}</TableCell>
                                        <TableCell>{transfer.to}</TableCell>
                                        <TableCell className="text-right font-semibold">Rs.{transfer.amount.toLocaleString()}</TableCell>
                                        <TableCell className="max-w-xs truncate" title={transfer.reason}>{transfer.reason}</TableCell>
                                    </TableRow>
                                ))}
                                {paginatedTransfers.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                                            No fund transfers have been recorded yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
                {totalTransferPages > 1 && (
                    <CardFooter>
                        <Pagination currentPage={transferPage} totalPages={totalTransferPages} onPageChange={setTransferPage} />
                    </CardFooter>
                )}
            </Card>
        </TabsContent>
        <TabsContent value="operational-costs" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>Operational Costs</CardTitle>
                    <CardDescription>
                    Manage salaries and equipment costs for full transparency.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="salaries">
                    <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
                        <TabsTrigger value="salaries"><Briefcase className="mr-2 h-4 w-4"/> Salaries</TabsTrigger>
                        <TabsTrigger value="equipment"><MonitorSmartphone className="mr-2 h-4 w-4"/> Equipment</TabsTrigger>
                        <TabsTrigger value="misc"><Archive className="mr-2 h-4 w-4"/> Misc</TabsTrigger>
                    </TabsList>
                    <TabsContent value="salaries" className="mt-4">
                        <div className="mb-4 rounded-md border p-4">
                        <h3 className="font-semibold mb-2">Add New Salary</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input placeholder="Employee Name" value={newSalary.employee} onChange={(e) => setNewSalary({...newSalary, employee: e.target.value})} />
                            <Input placeholder="Role / Title" value={newSalary.role} onChange={(e) => setNewSalary({...newSalary, role: e.target.value})} />
                            <Input type="number" placeholder="Monthly Salary (NPR)" value={newSalary.salary} onChange={(e) => setNewSalary({...newSalary, salary: e.target.value})} />
                        </div>
                        <Button className="mt-4" onClick={handleAddSalary}>Add Salary</Button>
                        </div>
                        <div className="overflow-x-auto">
                            <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Salary</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {salaries.map((salary) => (
                                <TableRow key={salary.id}>
                                    <TableCell>{salary.employee}</TableCell>
                                    <TableCell>{salary.role}</TableCell>
                                    <TableCell>Rs.{salary.salary.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleDeleteSalary(salary.id)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                            </Table>
                        </div>
                    </TabsContent>
                    <TabsContent value="equipment" className="mt-4">
                        <div className="mb-4 rounded-md border p-4">
                            <h3 className="font-semibold mb-2">Add New Equipment Cost</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <Input placeholder="Item Name" value={newEquipment.item} onChange={(e) => setNewEquipment({...newEquipment, item: e.target.value})} />
                                <Input type="number" placeholder="Cost (NPR)" value={newEquipment.cost} onChange={(e) => setNewEquipment({...newEquipment, cost: e.target.value})} />
                                <Input type="date" placeholder="Purchase Date" value={newEquipment.purchaseDate} onChange={(e) => setNewEquipment({...newEquipment, purchaseDate: e.target.value})} />
                                <Input placeholder="Vendor" value={newEquipment.vendor} onChange={(e) => setNewEquipment({...newEquipment, vendor: e.target.value})} />
                                <Input placeholder="Image URL" value={newEquipment.imageUrl} onChange={(e) => setNewEquipment({...newEquipment, imageUrl: e.target.value})} />
                                <Input placeholder="Image Hint" value={newEquipment.imageHint} onChange={(e) => setNewEquipment({...newEquipment, imageHint: e.target.value})} />
                            </div>
                            <Button className="mt-4" onClick={handleAddEquipment}>Add Cost</Button>
                        </div>
                        <div className="overflow-x-auto">
                            <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead>Cost</TableHead>
                                <TableHead>Purchase Date</TableHead>
                                <TableHead>Vendor</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {equipment.map((equip) => (
                                    <TableRow key={equip.id}>
                                        <TableCell>{equip.item}</TableCell>
                                        <TableCell>Rs.{equip.cost.toLocaleString()}</TableCell>
                                        <TableCell>{format(new Date(equip.purchaseDate), 'PP')}</TableCell>
                                        <TableCell>{equip.vendor}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteEquipment(equip.id)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            </Table>
                        </div>
                    </TabsContent>
                    <TabsContent value="misc" className="mt-4">
                        <div className="mb-4 rounded-md border p-4">
                            <h3 className="font-semibold mb-2">Add New Miscellaneous Cost</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Input placeholder="Item Name" value={newMiscExpense.item} onChange={(e) => setNewMiscExpense({...newMiscExpense, item: e.target.value})} />
                                <Input type="number" placeholder="Cost (NPR)" value={newMiscExpense.cost} onChange={(e) => setNewMiscExpense({...newMiscExpense, cost: e.target.value})} />
                                <Input type="date" placeholder="Purchase Date" value={newMiscExpense.purchaseDate} onChange={(e) => setNewMiscExpense({...newMiscExpense, purchaseDate: e.target.value})} />
                                <Input placeholder="Vendor" value={newMiscExpense.vendor} onChange={(e) => setNewMiscExpense({...newMiscExpense, vendor: e.target.value})} />
                            </div>
                            <Button className="mt-4" onClick={handleAddMiscExpense}>Add Cost</Button>
                        </div>
                        <div className="overflow-x-auto">
                            <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead>Cost</TableHead>
                                <TableHead>Purchase Date</TableHead>
                                <TableHead>Vendor</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {miscExpenses.map((expense) => (
                                    <TableRow key={expense.id}>
                                        <TableCell>{expense.item}</TableCell>
                                        <TableCell>Rs.{expense.cost.toLocaleString()}</TableCell>
                                        <TableCell>{format(new Date(expense.purchaseDate), 'PP')}</TableCell>
                                        <TableCell>{expense.vendor}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteMiscExpense(expense.id)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            </Table>
                        </div>
                    </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </TabsContent>
         <TabsContent value="user-management" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>
                        Manage user roles and permissions across the platform.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Pro Member</TableHead>
                                    <TableHead className="text-right">Can Create Campaigns</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedUsers.map(user => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">{user.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Badge variant={user.isAdmin ? 'default' : 'secondary'}>
                                                {user.isAdmin ? 'Admin' : 'User'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={user.isProMember || false}
                                                onCheckedChange={(checked) => handleUserProMemberToggle(user.id, checked)}
                                                aria-label={`Toggle pro member status for ${user.name}`}
                                            />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {!user.isAdmin && (
                                                <Switch
                                                    checked={user.canCreateCampaigns || false}
                                                    onCheckedChange={(checked) => handleUserPermissionToggle(user.id, checked)}
                                                    aria-label={`Toggle campaign creation for ${user.name}`}
                                                />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
                 {totalUserPages > 1 && (
                    <CardFooter>
                        <Pagination currentPage={userPage} totalPages={totalUserPages} onPageChange={setUserPage} />
                    </CardFooter>
                )}
            </Card>
        </TabsContent>
        <TabsContent value="ai-tools" className="mt-6">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>AI Wish Generator</CardTitle>
                        <CardDescription>
                            Create professional, occasion-based wishes to send to all your users.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="wish-occasion">Occasion</Label>
                            <Input
                            id="wish-occasion"
                            placeholder="e.g., New Year, Holiday Season"
                            value={wishOccasion}
                            onChange={(e) => setWishOccasion(e.target.value)}
                            />
                        </div>
                        <Button onClick={handleGenerateWish} disabled={isGeneratingWish}>
                            {isGeneratingWish ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                            <Wand2 className="mr-2 h-4 w-4" />
                            )}
                            Generate Wish
                        </Button>

                        {(isGeneratingWish || generatedWish) && (
                            <div className="space-y-2 rounded-md border bg-muted p-4">
                                <Label>Generated Message</Label>
                                {isGeneratingWish ? (
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-3/4" />
                                    </div>
                                ) : (
                                <>
                                    <Textarea
                                        readOnly
                                        value={generatedWish?.wish}
                                        rows={8}
                                        className="bg-background"
                                    />
                                    <Button onClick={handleSendWish}>Send to All Users</Button>
                                </>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Social Media Post Generator</CardTitle>
                        <CardDescription>
                            Create engaging social media posts to promote your campaigns.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="social-project">Project</Label>
                                <Select onValueChange={setSocialPostProjectId} value={socialPostProjectId}>
                                    <SelectTrigger id="social-project">
                                        <SelectValue placeholder="Select a project" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="social-platform">Platform</Label>
                                <Select onValueChange={setSocialPostPlatform} value={socialPostPlatform}>
                                    <SelectTrigger id="social-platform">
                                        <SelectValue placeholder="Select a platform" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Twitter">Twitter / X</SelectItem>
                                        <SelectItem value="Facebook">Facebook</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Button onClick={handleGenerateSocialPost} disabled={isGeneratingSocialPost}>
                            {isGeneratingSocialPost ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                            <Wand2 className="mr-2 h-4 w-4" />
                            )}
                            Generate Post
                        </Button>

                        {(isGeneratingSocialPost || generatedSocialPost) && (
                            <div className="space-y-2 rounded-md border bg-muted p-4">
                                <Label>Generated Post for {socialPostPlatform}</Label>
                                {isGeneratingSocialPost ? (
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-3/4" />
                                    </div>
                                ) : (
                                <>
                                    <div className="relative">
                                        <Textarea
                                            readOnly
                                            value={generatedSocialPost?.post}
                                            rows={8}
                                            className="bg-background pr-10"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute top-2 right-2 h-7 w-7"
                                            onClick={() => copyToClipboard(generatedSocialPost?.post || '')}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
        <TabsContent value="settings" className="mt-6">
            <div className="space-y-8">
                <div className="grid gap-8 lg:grid-cols-2">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                            <Settings />
                            General Platform Settings
                            </CardTitle>
                            <CardDescription>
                            Manage global settings for campaigns, costs, and AI features.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                             <div className="rounded-lg border p-4 space-y-2">
                                <Label htmlFor="app-name-input" className="text-base font-medium">Application Name</Label>
                                <div className="flex gap-2">
                                    <Input 
                                        id="app-name-input"
                                        defaultValue={platformSettings.appName}
                                        onChange={(e) => platformSettings.appName = e.target.value}
                                    />
                                    <Button onClick={handleAppNameChange}>Save</Button>
                                </div>
                                <p className="text-sm text-muted-foreground">This name will be displayed in the sidebar and other places across the app.</p>
                            </div>
                             <div className="rounded-lg border p-4 space-y-2">
                                <Label htmlFor="app-logo-input" className="text-base font-medium">Application Logo URL</Label>
                                <div className="flex gap-2">
                                    <Input 
                                        id="app-logo-input"
                                        defaultValue={platformSettings.appLogoUrl}
                                        onChange={(e) => platformSettings.appLogoUrl = e.target.value}
                                    />
                                    <Button onClick={handleAppLogoChange}>Save</Button>
                                </div>
                                <p className="text-sm text-muted-foreground">Enter a URL for the app logo. It will replace the default logo in the sidebar.</p>
                            </div>
                             <Card>
                                <CardHeader>
                                    <CardTitle>Login Page Images</CardTitle>
                                    <CardDescription>Manage the images that appear in the login page carousel.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {platformSettings.loginImages.map((image, index) => (
                                        <div key={index} className="flex items-end gap-2 rounded-md border p-4">
                                            <div className="grid flex-1 gap-2">
                                                <Label htmlFor={`login-image-url-${index}`}>Image URL</Label>
                                                <Input
                                                    id={`login-image-url-${index}`}
                                                    defaultValue={image.imageUrl}
                                                    onChange={(e) => platformSettings.loginImages[index].imageUrl = e.target.value}
                                                />
                                                <Label htmlFor={`login-image-label-${index}`}>Label</Label>
                                                <Input
                                                    id={`login-image-label-${index}`}
                                                    defaultValue={image.label}
                                                    onChange={(e) => platformSettings.loginImages[index].label = e.target.value}
                                                />
                                            </div>
                                            <Button size="icon" variant="destructive" onClick={() => handleDeleteLoginImage(index)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <div className="flex justify-between">
                                        <Button onClick={handleAddLoginImage}>
                                            <PlusCircle className="mr-2 h-4 w-4" /> Add Image
                                        </Button>
                                        <Button onClick={handleSaveLoginImages}>Save Login Images</Button>
                                    </div>
                                </CardContent>
                             </Card>
                             <div className="rounded-lg border p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label htmlFor="ops-total-switch" className="text-base font-medium">Show Operational Cost Totals</Label>
                                        <p className="text-sm text-muted-foreground">Display the total with taxes on the public operational costs page.</p>
                                    </div>
                                    <Switch id="ops-total-switch" checked={platformSettings.showOperationalCostsTotal} onCheckedChange={handleShowTotalCostToggle} />
                                </div>
                            </div>
                             <div className="rounded-lg border p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label htmlFor="ops-target-switch" className="text-base font-medium">Show Operational Costs Target</Label>
                                        <p className="text-sm text-muted-foreground">Display the fundraising goal and progress bar on the public page.</p>
                                    </div>
                                    <Switch id="ops-target-switch" checked={platformSettings.showOperationalCostsTarget} onCheckedChange={handleShowOpsTargetToggle} />
                                </div>
                            </div>
                            <div className="rounded-lg border p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label htmlFor="campaign-creation-switch" className="text-base font-medium">Enable Campaign Creation for Users</Label>
                                        <p className="text-sm text-muted-foreground">Allow non-admin users to create their own campaigns.</p>
                                    </div>
                                    <Switch id="campaign-creation-switch" checked={platformSettings.campaignCreationEnabled} onCheckedChange={handleCampaignCreationToggle} />
                                </div>
                            </div>
                            <div className="rounded-lg border p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label htmlFor="user-qr-switch" className="text-base font-medium">Enable User Campaign QR Codes</Label>
                                        <p className="text-sm text-muted-foreground">Allow users to configure their own QR codes on their campaigns.</p>
                                    </div>
                                    <Switch id="user-qr-switch" checked={platformSettings.userQrPaymentsEnabled} onCheckedChange={handleUserQrToggle} />
                                </div>
                            </div>
                            <div className="rounded-lg border p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label htmlFor="ai-summary-switch" className="text-base font-medium">Enable Public AI Summary Generation</Label>
                                        <p className="text-sm text-muted-foreground">Allow donors to generate AI summaries on project pages.</p>
                                    </div>
                                    <Switch id="ai-summary-switch" checked={platformSettings.aiSummaryEnabled} onCheckedChange={handleAiSummaryToggle} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                            <CreditCard />
                            Platform Payment Gateways
                            </CardTitle>
                            <CardDescription>
                            Enable gateways and set QR code values for platform-wide donations.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {paymentGateways.map((gateway, index) => (
                                <div key={gateway.name} className="space-y-4 rounded-md border p-4">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor={`gateway-switch-${gateway.name}`} className="text-lg font-medium">{gateway.name}</Label>
                                        <Switch id={`gateway-switch-${gateway.name}`} checked={gateway.enabled} onCheckedChange={() => handleGatewayToggle(gateway.name)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`gateway-qr-input-${gateway.name}`} className="text-sm font-normal">Payment URL or ID</Label>
                                        <div className="flex gap-2">
                                            <Input 
                                                id={`gateway-qr-input-${gateway.name}`}
                                                placeholder={`Enter ${gateway.name} URL, username, or address`}
                                                value={gateway.qrValue}
                                                onChange={(e) => {
                                                    gateway.qrValue = e.target.value;
                                                    setForceRender(c => c + 1);
                                                }}
                                            />
                                            <Button onClick={() => handleGenerateQr(gateway.name)}>Generate QR</Button>
                                        </div>
                                    </div>
                                    {gateway.generatedQr && (
                                        <div className="flex flex-col items-center gap-2 rounded-lg bg-muted p-3 sm:flex-row">
                                            <Image
                                                src={gateway.generatedQr}
                                                alt={`${gateway.name} QR Code`}
                                                width={150}
                                                height={150}
                                                data-ai-hint="qr code"
                                            />
                                            <p className="text-center text-xs text-muted-foreground break-all sm:text-left">
                                                QR Code for: {gateway.qrValue}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
                 <div className="grid gap-8 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                            <KeyRound />
                            Gateway Credentials & Bank Information
                            </CardTitle>
                            <CardDescription>
                            Enter and manage your API keys and bank account details. These are stored securely.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="stripe">
                            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
                                <TabsTrigger value="stripe">Stripe</TabsTrigger>
                                <TabsTrigger value="paypal">PayPal</TabsTrigger>
                                <TabsTrigger value="bank">Bank Account</TabsTrigger>
                            </TabsList>
                            <TabsContent value="stripe" className="mt-4">
                                <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="stripe-pk">Publishable Key</Label>
                                    <Input id="stripe-pk" placeholder="pk_live_..." />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stripe-sk">Secret Key</Label>
                                    <Input id="stripe-sk" type="password" placeholder="sk_live_..." />
                                </div>
                                <Button>Save Stripe Credentials</Button>
                                </div>
                            </TabsContent>
                            <TabsContent value="paypal" className="mt-4">
                                <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="paypal-client-id">Client ID</Label>
                                    <Input id="paypal-client-id" placeholder="Your PayPal Client ID" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="paypal-secret">Secret</Label>
                                    <Input id="paypal-secret" type="password" placeholder="Your PayPal Secret" />
                                </div>
                                <Button>Save PayPal Credentials</Button>
                                </div>
                            </TabsContent>
                            <TabsContent value="bank" className="mt-4">
                                <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="bank-name">Bank Name</Label>
                                    <Input id="bank-name" placeholder="e.g., Bank of Example" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="account-holder">Account Holder Name</Label>
                                    <Input id="account-holder" placeholder="e.g., John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="account-number">Account Number</Label>
                                    <Input id="account-number" placeholder="Your account number" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="routing-number">Routing Number / Swift Code</Label>
                                    <Input id="routing-number" placeholder="Your routing number or SWIFT code" />
                                </div>
                                <Button>Save Bank Information</Button>
                                </div>
                            </TabsContent>
                            </Tabs>
                        </CardContent>
                        </Card>

                        <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                            <MessageSquare />
                            Social & Contact Links
                            </CardTitle>
                            <CardDescription>
                            Configure the links for the floating contact button.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                            <Label htmlFor="whatsapp" className="flex items-center gap-2"><WhatsAppIcon className="h-5 w-5"/> WhatsApp Number</Label>
                            <Input id="whatsapp" defaultValue={socialLinks.whatsapp} onChange={e => socialLinks.whatsapp = e.target.value} />
                            </div>
                            <div className="space-y-2">
                            <Label htmlFor="viber" className="flex items-center gap-2"><ViberIcon className="h-5 w-5"/> Viber Number</Label>
                            <Input id="viber" defaultValue={socialLinks.viber} onChange={e => socialLinks.viber = e.target.value} />
                            </div>
                            <div className="space-y-2">
                            <Label htmlFor="instagram" className="flex items-center gap-2"><InstagramIcon className="h-5 w-5" stroke="currentColor"/> Instagram URL</Label>
                            <Input id="instagram" defaultValue={socialLinks.instagram} onChange={e => socialLinks.instagram = e.target.value} />
                            </div>
                            <div className="space-y-2">
                            <Label htmlFor="messenger" className="flex items-center gap-2"><MessengerIcon className="h-5 w-5"/> Messenger Username</Label>
                            <Input id="messenger" defaultValue={socialLinks.messenger} onChange={e => socialLinks.messenger = e.target.value} />
                            </div>
                            <Button onClick={handleSaveSocialLinks}>Save Contact Links</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
