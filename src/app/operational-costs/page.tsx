

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  operationalCostsFund as initialOperationalCostsFund,
  teamMembers,
  equipment,
  salaries,
  miscExpenses,
  currentUser,
  platformSettings,
  allDonations,
  projects,
} from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Users, Target, CheckCircle, ArrowRight, Sparkles, Landmark, CreditCard, QrCode, Banknote } from 'lucide-react';
import { DonorsList } from '@/components/projects/donors-list';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { EquipmentShowcase } from '@/components/dashboard/equipment-showcase';
import { OperationalCosts } from '@/components/dashboard/operational-costs';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { PaymentGateways } from '@/components/projects/payment-gateways';
import { DonationDialogWrapper, useDonationContext } from '@/components/projects/donation-dialog-wrapper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function OperationalCostsContent() {
    const { setIsDonationOpen } = useDonationContext();
    const [operationalCostsFund, setOperationalCostsFund] = useState(initialOperationalCostsFund);
    const [isClient, setIsClient] = useState(false);

    const operationalDonations = allDonations.filter(d => d.project === 'Operational Costs');

    useEffect(() => {
        setIsClient(true);
        // This effect will re-sync the state if the underlying data changes (e.g., via admin actions)
        setOperationalCostsFund(initialOperationalCostsFund);
      }, [initialOperationalCostsFund.raisedAmount, initialOperationalCostsFund.donors]);

    const percentage = Math.round(
        (operationalCostsFund.raisedAmount / operationalCostsFund.targetAmount) * 100
      );
    
      const showTarget = platformSettings.showOperationalCostsTarget && operationalCostsFund.targetAmount > 0;

    return (
        <div className="mx-auto max-w-6xl space-y-8">
        <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {operationalCostsFund.name}
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
            {operationalCostsFund.description}
            </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
                <OperationalCosts salaries={salaries} equipment={equipment} miscExpenses={miscExpenses} teamMembers={teamMembers} />
                
                <EquipmentShowcase equipment={equipment} />
                
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Donors</CardTitle>
                        <CardDescription>Supporters helping to fund our core operations.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DonorsList donations={operationalDonations} />
                    </CardContent>
                </Card>
            </div>

            <aside className="space-y-8 lg:sticky lg:top-24 self-start">
            <Card>
                <CardHeader>
                <CardTitle>Fundraising Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                {isClient ? (
                    <>
                    {showTarget && (
                        <Progress
                        value={percentage}
                        className="h-3"
                        aria-label={`${percentage}% funded`}
                        />
                    )}
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between gap-4">
                        <span className="font-medium text-muted-foreground">Available</span>
                        <span className="font-bold">
                            Rs.{operationalCostsFund.raisedAmount.toLocaleString()}
                        </span>
                        </div>
                        {showTarget && (
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-muted-foreground">
                            <Target className="h-4 w-4" />
                            <span>Target</span>
                            </div>
                            <span className="font-bold">
                            Rs.{operationalCostsFund.targetAmount.toLocaleString()}
                            </span>
                        </div>
                        )}
                        <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>Donors</span>
                        </div>
                        <span className="font-bold">{operationalCostsFund.donors.toLocaleString()}</span>
                        </div>
                    </div>
                    </>
                ) : (
                    <div className="space-y-4">
                    <Skeleton className="h-3 w-full" />
                    <div className="space-y-3">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-5 w-1/2" />
                        <Skeleton className="h-5 w-5/6" />
                    </div>
                    </div>
                )}
                <div className="pt-4 flex flex-col items-center text-center sm:items-start sm:text-left">
                        <Button size="lg" className="w-full sm:w-auto text-base" onClick={() => setIsDonationOpen(true)}>
                            <Sparkles className="mr-2 h-5 w-5"/> Become a Pro
                        </Button>
                        <p className="text-sm text-muted-foreground mt-2">
                            Donate to our operational costs to become a Pro member and receive bonus AI credits.
                        </p>
                    </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="qr" className="min-h-0">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="qr"><QrCode className="mr-2 h-4 w-4"/>QR</TabsTrigger>
                            <TabsTrigger value="card"><CreditCard className="mr-2 h-4 w-4"/>Card</TabsTrigger>
                            <TabsTrigger value="bank"><Landmark className="mr-2 h-4 w-4"/>Bank</TabsTrigger>
                        </TabsList>
                        <TabsContent value="qr" className="mt-4 min-h-0">
                            <div className="flex flex-col items-center gap-4">
                                <PaymentGateways project={{id: 'operational-costs', name: 'Operational Costs'} as any} />
                            </div>
                        </TabsContent>
                        <TabsContent value="card" className="mt-4 min-h-0">
                            <div className="p-4 text-center text-sm text-muted-foreground border rounded-lg">
                                <p>To make a secure payment with your credit or debit card, please click the main "Become a Pro" button and select the 'Card' option in the payment dialog.</p>
                            </div>
                        </TabsContent>
                        <TabsContent value="bank" className="mt-4 min-h-0 space-y-2 text-sm">
                            <div className="font-semibold">Bank Transfer Details:</div>
                            <p><span className="text-muted-foreground">Bank Name:</span> Example Bank Nepal</p>
                            <p><span className="text-muted-foreground">Account Holder:</span> milijuli donation sewa</p>
                            <p><span className="text-muted-foreground">Account Number:</span> 0123456789012345</p>
                            <p><span className="text-muted-foreground">Swift Code:</span> EBNPNPKA</p>
                            <p className="text-xs text-muted-foreground pt-2">After making a transfer, please <Link href="/contact" className="text-primary underline">contact us</Link> with the transaction details to confirm your donation.</p>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Meet The Team</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex -space-x-2 overflow-hidden">
                        {teamMembers.map(member => (
                        <Link key={member.id} href={`/team/${member.id}`} title={member.name}>
                            <Avatar className="inline-block h-12 w-12 rounded-full ring-2 ring-background hover:ring-primary transition-all">
                                <AvatarImage src={member.avatarUrl} alt={member.name} />
                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            </Link>
                        ))}
                    </div>
                    <p className="text-sm text-muted-foreground">Our dedicated team works tirelessly to ensure every donation makes a maximum impact.</p>
                    <Button asChild variant="outline" className="w-full">
                        <Link href="/about">
                            Learn More About Us <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>
            </aside>
        </div>
        </div>
    )
}


export default function OperationalCostsPage() {
    const operationalCostsProject = {
        id: 'operational-costs',
        name: 'Operational Costs',
        organization: 'milijuli donation sewa',
        description: 'Support the core team and infrastructure that makes our work possible.',
        longDescription: 'Our mission is to foster trust and empower change through radical transparency. Your contribution supports the core team and infrastructure that makes our work possible, ensuring every donation can be tracked with integrity.',
        imageUrl: initialOperationalCostsFund.imageUrl,
        imageHint: initialOperationalCostsFund.imageHint,
        targetAmount: initialOperationalCostsFund.targetAmount,
        raisedAmount: initialOperationalCostsFund.raisedAmount,
        donors: initialOperationalCostsFund.donors,
        verified: true,
        updates: [],
        expenses: [],
        discussion: [],
        wishlist: [],
        createdAt: new Date().toISOString(),
      };

  return (
    <DonationDialogWrapper project={operationalCostsProject}>
        <OperationalCostsContent />
    </DonationDialogWrapper>
  );
}
