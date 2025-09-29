
'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import { projects, dashboardStats, miscExpenses, salaries, equipment, socialLinks, physicalDonations, paymentGateways, platformSettings, users, operationalCostsFund } from '@/lib/data';
import type { PhysicalDonation, Project, User } from '@/lib/data';
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
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/ui/pagination';


const ITEMS_PER_PAGE = 5;

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
    projectName: '',
    itemName: '',
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
  
  const [projectPage, setProjectPage] = useState(1);
  const [donationPage, setDonationPage] = useState(1);
  const [userPage, setUserPage] = useState(1);

  const paginatedProjects = projects.slice(
    (projectPage - 1) * ITEMS_PER_PAGE,
    projectPage * ITEMS_PER_PAGE
  );
  const totalProjectPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
  
  const paginatedDonations = physicalDonations.slice(
    (donationPage - 1) * ITEMS_PER_PAGE,
    donationPage * ITEMS_PER_PAGE
  );
  const totalDonationPages = Math.ceil(physicalDonations.length / ITEMS_PER_PAGE);

  const nonAdminUsers = users.filter(u => u.id !== 'clarity-chain-admin');
  const paginatedUsers = nonAdminUsers.slice(
    (userPage - 1) * ITEMS_PER_PAGE,
    userPage * ITEMS_PER_PAGE
  );
  const totalUserPages = Math.ceil(nonAdminUsers.length / ITEMS_PER_PAGE);


  const handleAddSalary = () => {
    if (newSalary.employee && newSalary.role && newSalary.salary) {
      salaries.push({ id: `sal-${Date.now()}`, ...newSalary, salary: parseFloat(newSalary.salary), currency: 'NPR' });
      setNewSalary({ employee: '', role: '', salary: '' });
      toast({ title: "Salary Added", description: "The new salary has been recorded." });
      setForceRender(c => c + 1);
    }
  };

  const handleAddEquipment = () => {
    if (newEquipment.item && newEquipment.cost && newEquipment.purchaseDate && newEquipment.vendor) {
        const newEquip = { 
            id: `eq-${Date.now()}`, 
            item: newEquipment.item,
            cost: parseFloat(newEquipment.cost),
            purchaseDate: new Date(newEquipment.purchaseDate),
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
  
  const handleAddMiscExpense = () => {
      if (newMiscExpense.item && newMiscExpense.cost && newMiscExpense.purchaseDate && newMiscExpense.vendor) {
          const newMisc = { 
              id: `misc-${Date.now()}`, 
              item: newMiscExpense.item,
              cost: parseFloat(newMiscExpense.cost),
              purchaseDate: new Date(newMiscExpense.purchaseDate),
              vendor: newMiscExpense.vendor
          };
        miscExpenses.push(newMisc);
        setNewMiscExpense({ item: '', cost: '', purchaseDate: '', vendor: '' });
        toast({ title: "Misc. Expense Added", description: "The new expense has been recorded." });
        setForceRender(c => c + 1);
      }
    };

    const handleAddInKindDonation = () => {
        if (newInKindDonation.donorName && newInKindDonation.projectName && newInKindDonation.itemName && newInKindDonation.quantity) {
          const project = projects.find(p => p.name === newInKindDonation.projectName);
          const donor = users.find(u => u.name === newInKindDonation.donorName);
    
          if (!project || !donor) {
            toast({ variant: 'destructive', title: "Error", description: "Selected project or donor not found." });
            return;
          }
    
          const newDonation: PhysicalDonation = {
            id: `pd-admin-${Date.now()}`,
            donorName: newInKindDonation.donorName,
            donorEmail: donor.email || 'N/A',
            projectName: newInKindDonation.projectName,
            itemName: newInKindDonation.itemName,
            quantity: parseInt(newInKindDonation.quantity, 10),
            donationType: 'received',
            status: 'Completed',
            date: new Date(newInKindDonation.date),
            comments: [],
          };
    
          physicalDonations.unshift(newDonation);
    
          // Create an update for the project
          const newUpdate: Project['updates'][0] = {
            id: `update-inkind-${Date.now()}`,
            title: `New In-Kind Donation Received!`,
            description: `${newInKindDonation.donorName} generously donated ${newInKindDonation.quantity}x ${newInKindDonation.itemName}.`,
            date: new Date(newInKindDonation.date),
            isInKindDonation: true,
            inKindDonationDetails: {
              donorName: newInKindDonation.donorName,
              itemName: newInKindDonation.itemName,
              quantity: parseInt(newInKindDonation.quantity, 10),
            },
          };
    
          project.updates.unshift(newUpdate);
    
          setNewInKindDonation({
            donorName: '',
            projectName: '',
            itemName: '',
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
        // Create a new update for the project expense
        const newUpdate: Project['updates'][0] = {
            id: `update-expense-${Date.now()}`,
            title: 'Funds Utilized for Project Expense',
            description: `An amount of Rs.${data.amount.toLocaleString()} was spent on "${data.item}".`,
            date: new Date(),
            isExpense: true,
            expenseDetails: {
                item: data.item,
                amount: data.amount,
            }
        };
        project.updates.unshift(newUpdate);
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
            date: new Date(),
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
            date: new Date(),
            isTransfer: true,
            transferDetails: { amount: data.amount, fromProject: data.from }
        };
        toProject.updates.unshift(toUpdate);
    }

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
            <p className="text-2xl font-bold text-primary">Rs.{dashboardStats.fundsInHand.toLocaleString()}</p>
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
      </Card>
      
      <Tabs defaultValue="projects">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="projects"><List className="mr-2 h-4 w-4"/> Projects</TabsTrigger>
          <TabsTrigger value="donations"><HandCoins className="mr-2 h-4 w-4"/> In-Kind Donations</TabsTrigger>
          <TabsTrigger value="operational-costs"><Briefcase className="mr-2 h-4 w-4"/> Operational Costs</TabsTrigger>
          <TabsTrigger value="user-management"><Users className="mr-2 h-4 w-4"/> User Management</TabsTrigger>
          <TabsTrigger value="ai-tools"><Wand2 className="mr-2 h-4 w-4" /> AI Tools</TabsTrigger>
          <TabsTrigger value="settings"><Settings className="mr-2 h-4 w-4" /> Platform Settings</TabsTrigger>
        </TabsList>
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
                    <CardTitle>In-Kind Donation Pledges</CardTitle>
                    <CardDescription>
                        Manage and track physical item donations from your supporters.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="pledges">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="pledges"><List className="mr-2 h-4 w-4"/> Pledges</TabsTrigger>
                            <TabsTrigger value="post-received"><Package className="mr-2 h-4 w-4"/> Post Received Donation</TabsTrigger>
                        </TabsList>
                        <TabsContent value="pledges" className="mt-4">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Donor</TableHead>
                                        <TableHead>Item</TableHead>
                                        <TableHead>Project</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead><span className="sr-only">Actions</span></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedDonations.map(donation => (
                                        <TableRow key={donation.id}>
                                            <TableCell>{donation.date.toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <div className="font-medium">{donation.donorName}</div>
                                                <div className="text-sm text-muted-foreground">{donation.donorEmail}</div>
                                            </TableCell>
                                            <TableCell>{donation.itemName} (x{donation.quantity})</TableCell>
                                            <TableCell>{donation.projectName}</TableCell>
                                            <TableCell>
                                                <Badge variant={donation.donationType === 'pickup' ? 'default' : 'secondary'}>
                                                    {donation.donationType}
                                                </Badge>
                                            </TableCell>
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
                             {totalDonationPages > 1 && (
                                <div className="mt-4">
                                   <Pagination currentPage={donationPage} totalPages={totalDonationPages} onPageChange={setDonationPage} />
                                </div>
                            )}
                        </TabsContent>
                         <TabsContent value="post-received" className="mt-4">
                            <div className="space-y-4 rounded-md border p-4">
                                <h3 className="font-semibold mb-2">Post a Received In-Kind Donation</h3>
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
                                        <Select value={newInKindDonation.projectName} onValueChange={(value) => setNewInKindDonation({...newInKindDonation, projectName: value})}>
                                            <SelectTrigger><SelectValue placeholder="Select a project" /></SelectTrigger>
                                            <SelectContent>
                                                {projects.map(project => <SelectItem key={project.id} value={project.name}>{project.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Item Name</Label>
                                        <Input placeholder="e.g., Laptops, Blankets" value={newInKindDonation.itemName} onChange={(e) => setNewInKindDonation({...newInKindDonation, itemName: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Quantity</Label>
                                        <Input type="number" placeholder="1" value={newInKindDonation.quantity} onChange={(e) => setNewInKindDonation({...newInKindDonation, quantity: e.target.value})} />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label>Date Received</Label>
                                        <Input type="date" value={newInKindDonation.date} onChange={(e) => setNewInKindDonation({...newInKindDonation, date: e.target.value})} />
                                    </div>
                                </div>
                                <Button className="mt-4" onClick={handleAddInKindDonation}>Post Donation</Button>
                            </div>
                         </TabsContent>
                    </Tabs>
                </CardContent>
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
                                <TableCell>{salary.currency === 'USD' ? '$' : 'Rs.'}{salary.salary.toLocaleString()} / mo</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
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
                                    <TableCell>{equip.purchaseDate.toLocaleDateString()}</TableCell>
                                    <TableCell>{equip.vendor}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
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
                                        <TableCell>{expense.purchaseDate.toLocaleDateString()}</TableCell>
                                        <TableCell>{expense.vendor}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
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
