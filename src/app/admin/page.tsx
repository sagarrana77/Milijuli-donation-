
'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  QrCode,
  CreditCard,
  KeyRound,
  MessageSquare,
  Briefcase,
  MonitorSmartphone,
  ArrowDown,
  ArrowRight,
  Edit,
  UserPlus,
  CircleHelp,
} from 'lucide-react';
import { projects, dashboardStats } from '@/lib/data';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
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


const initialGateways = [
  { name: 'Esewa', enabled: true },
  { name: 'Khalti', enabled: true },
  { name: 'FonePay', enabled: true },
  { name: 'PayPal', enabled: false },
  { name: 'Stripe', enabled: true },
  { name: 'Crypto', enabled: false },
];

export default function AdminDashboardPage() {
  const [qrUrl, setQrUrl] = useState('');
  const [generatedQr, setGeneratedQr] = useState('');
  const [gateways, setGateways] = useState(initialGateways);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleGenerateQr = () => {
    if (qrUrl) {
      setGeneratedQr(
        `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
          qrUrl
        )}`
      );
    }
  };
  
  const handleGatewayToggle = (name: string) => {
    setGateways(gateways.map(g => g.name === name ? {...g, enabled: !g.enabled} : g));
  }

  const handleExpenseRecorded = () => {
    toast({
        title: 'Expense Recorded',
        description: 'The expense has been successfully logged.',
    });
  }

  const handleFundsTransferred = () => {
    toast({
        title: 'Funds Transferred',
        description: 'The funds have been successfully transferred.',
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
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your platform settings and content.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
            <Button asChild>
                <Link href="/admin/about">
                    <Edit className="mr-2 h-4 w-4" /> Edit About Page
                </Link>
            </Button>
            <Button asChild variant="outline">
                <Link href="/admin/careers">
                    <UserPlus className="mr-2 h-4 w-4" /> Manage Careers
                </Link>
            </Button>
            <Button asChild variant="outline">
                <Link href="/admin/help">
                    <CircleHelp className="mr-2 h-4 w-4" /> Manage Help Page
                </Link>
            </Button>
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
            <p className="text-2xl font-bold">${dashboardStats.totalFunds.toLocaleString()}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Total Spent</h3>
            <p className="text-2xl font-bold">${dashboardStats.totalSpent.toLocaleString()}</p>
             <div className="text-xs text-muted-foreground">
                <p>Projects: ${dashboardStats.spendingBreakdown.projectExpenses.toLocaleString()}</p>
                <p>Operational: ${dashboardStats.spendingBreakdown.operationalCosts.toLocaleString()}</p>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Funds in Hand</h3>
            <p className="text-2xl font-bold text-primary">${dashboardStats.fundsInHand.toLocaleString()}</p>
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


      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode />
              QR Code Creator
            </CardTitle>
            <CardDescription>
              Generate a QR code for any URL to use in your campaigns.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                type="url"
                placeholder="https://example.com"
                value={qrUrl}
                onChange={(e) => setQrUrl(e.target.value)}
                className="flex-grow"
              />
              <Button onClick={handleGenerateQr}>Generate</Button>
            </div>
            {generatedQr && (
              <div className="flex flex-col items-center gap-4 rounded-lg border bg-muted p-4">
                <Image
                  src={generatedQr}
                  alt="Generated QR Code"
                  width={200}
                  height={200}
                  data-ai-hint="qr code"
                />
                <p className="text-center text-sm text-muted-foreground break-all">
                  QR Code for: {qrUrl}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard />
              Payment Gateways
            </CardTitle>
            <CardDescription>
              Enable or disable payment methods for donations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {gateways.map((gateway) => (
                <div key={gateway.name} className="flex items-center justify-between rounded-md border p-3">
                    <Label htmlFor={`gateway-${gateway.name}`} className="font-medium">{gateway.name}</Label>
                    <Switch id={`gateway-${gateway.name}`} checked={gateway.enabled} onCheckedChange={() => handleGatewayToggle(gateway.name)} />
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
              <Input id="whatsapp" placeholder="+1234567890" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="viber" className="flex items-center gap-2"><ViberIcon className="h-5 w-5"/> Viber Number</Label>
              <Input id="viber" placeholder="+1234567890" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="instagram" className="flex items-center gap-2"><InstagramIcon className="h-5 w-5"/> Instagram URL</Label>
              <Input id="instagram" placeholder="https://instagram.com/your-profile" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="messenger" className="flex items-center gap-2"><MessengerIcon className="h-5 w-5"/> Messenger Username</Label>
              <Input id="messenger" placeholder="your.username" />
            </div>
            <Button>Save Contact Links</Button>
          </CardContent>
        </Card>
      </div>
      
      <Card>
          <CardHeader>
            <CardTitle>Operational Costs</CardTitle>
            <CardDescription>
              Manage salaries and equipment costs for full transparency.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="salaries">
              <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2">
                <TabsTrigger value="salaries"><Briefcase className="mr-2 h-4 w-4"/> Salaries</TabsTrigger>
                <TabsTrigger value="equipment"><MonitorSmartphone className="mr-2 h-4 w-4"/> Equipment</TabsTrigger>
              </TabsList>
              <TabsContent value="salaries" className="mt-4">
                <div className="mb-4 rounded-md border p-4">
                  <h3 className="font-semibold mb-2">Add New Salary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input placeholder="Employee Name" />
                    <Input placeholder="Role / Title" />
                    <Input type="number" placeholder="Monthly Salary ($)" />
                  </div>
                  <Button className="mt-4">Add Salary</Button>
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
                        <TableRow>
                        <TableCell>John Doe</TableCell>
                        <TableCell>Project Manager</TableCell>
                        <TableCell>$3,000 / mo</TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                        </TableCell>
                        </TableRow>
                    </TableBody>
                    </Table>
                 </div>
              </TabsContent>
              <TabsContent value="equipment" className="mt-4">
                <div className="mb-4 rounded-md border p-4">
                    <h3 className="font-semibold mb-2">Add New Equipment Cost</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Input placeholder="Item Name" />
                        <Input type="number" placeholder="Cost ($)" />
                        <Input type="date" placeholder="Purchase Date" />
                        <Input placeholder="Vendor" />
                    </div>
                    <Button className="mt-4">Add Cost</Button>
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
                        <TableRow>
                        <TableCell>MacBook Pro 16"</TableCell>
                        <TableCell>$2,500</TableCell>
                        <TableCell>2023-10-01</TableCell>
                        <TableCell>Apple Store</TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                        </TableCell>
                        </TableRow>
                    </TableBody>
                    </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

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
                {projects.map((project) => (
                    <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>{project.organization}</TableCell>
                    <TableCell>
                        <Badge variant={project.verified ? 'default' : 'secondary'}>
                        {project.verified ? 'Verified' : 'Unverified'}
                        </Badge>
                    </TableCell>
                    <TableCell>
                        ${project.raisedAmount.toLocaleString()}
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
                            <DropdownMenuItem>Edit</DropdownMenuItem>
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
      </Card>
    </div>
  );
}

    