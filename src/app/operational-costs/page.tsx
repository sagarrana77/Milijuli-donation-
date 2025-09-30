

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  operationalCostsFund as initialOperationalCostsFund,
  teamMembers,
  equipment,
  currentUser,
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
import { Users, Target, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { DonorsList } from '@/components/projects/donors-list';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { EquipmentShowcase } from '@/components/dashboard/equipment-showcase';
import { DonationDialog } from '@/components/projects/donation-dialog';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';


export default function OperationalCostsPage() {
  const [operationalCostsFund, setOperationalCostsFund] = useState(initialOperationalCostsFund);
  const [isClient, setIsClient] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const { toast } = useToast();
  

  useEffect(() => {
    setIsClient(true);
    // This effect will re-sync the state if the underlying data changes (e.g., via admin actions)
    setOperationalCostsFund(initialOperationalCostsFund);
  }, [initialOperationalCostsFund.raisedAmount, initialOperationalCostsFund.donors]);

  const handleDonation = (amount: number) => {
    // In a real app, this state update would come from a data refetch after mutation
    setOperationalCostsFund(prev => ({
        ...prev,
        raisedAmount: prev.raisedAmount + amount,
        donors: prev.donors + 1
    }));
    
    let toastDescription = `Your generous donation of Rs.${amount} will help us continue our mission.`;
    
    if (currentUser && !currentUser.isProMember) {
        currentUser.isProMember = true;
        currentUser.aiCredits = (currentUser.aiCredits || 0) + 100;
        toastDescription += " You've been upgraded to a Pro Member and received 100 bonus AI credits!";
    }

    toast({
      title: 'Thank You for Your Support!',
      description: toastDescription,
      variant: 'default',
    });
  };

  const percentage = Math.round(
    (operationalCostsFund.raisedAmount / operationalCostsFund.targetAmount) * 100
  );

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <DonationDialog
        isOpen={isDonationOpen}
        onOpenChange={setIsDonationOpen}
        projectName={operationalCostsFund.name}
        onDonate={handleDonation}
      />
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
            <Card>
                <CardHeader>
                    <CardTitle>Our Mission</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Our mission is to bring radical transparency to fundraising. We believe donors have the right to know exactly how their contributions create change. milijuli sewa provides a secure, auditable platform to track funds, ensuring accountability and rebuilding trust in the non-profit sector.
                    </p>
                </CardContent>
            </Card>

            <EquipmentShowcase equipment={equipment} />
            
            <Card>
                <CardHeader>
                    <CardTitle>Recent Donors</CardTitle>
                    <CardDescription>Supporters helping to fund our core operations.</CardDescription>
                </CardHeader>
                <CardContent>
                    <DonorsList donations={[]} />
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
                  <Progress
                    value={percentage}
                    className="h-3"
                    aria-label={`${percentage}% funded`}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-muted-foreground">Available</span>
                      <div>
                        <p className="font-bold">
                          Rs.{operationalCostsFund.raisedAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-bold">
                          Rs.{operationalCostsFund.targetAmount.toLocaleString()}
                        </p>
                        <p className="text-muted-foreground">Target</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-bold">{operationalCostsFund.donors.toLocaleString()}</p>
                        <p className="text-muted-foreground">Donors</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <Skeleton className="h-3 w-full" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Skeleton className="h-4 w-12"/>
                        <Skeleton className="h-4 w-16"/>
                    </div>
                     <div className="space-y-1">
                        <Skeleton className="h-4 w-12"/>
                        <Skeleton className="h-4 w-20"/>
                    </div>
                     <div className="space-y-1">
                        <Skeleton className="h-4 w-8"/>
                        <Skeleton className="h-4 w-12"/>
                    </div>
                  </div>
                </div>
              )}
              <Button size="lg" className="w-full text-lg" onClick={() => setIsDonationOpen(true)}>
                <Sparkles className="mr-2 h-5 w-5"/> Become a Pro Member
              </Button>
               <p className="text-xs text-center text-muted-foreground">
                Donate to our operational costs to become a Pro member and receive bonus AI credits.
              </p>
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
  );
}
