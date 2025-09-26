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
  Landmark,
} from 'lucide-react';
import { projects } from '@/lib/data';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your platform settings and content.
          </p>
        </div>
      </div>

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
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="https://example.com"
                value={qrUrl}
                onChange={(e) => setQrUrl(e.target.value)}
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
            <TabsList className="grid w-full grid-cols-3">
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
        </CardContent>
      </Card>
    </div>
  );
}
