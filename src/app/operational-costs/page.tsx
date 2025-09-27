

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  operationalCostsFund as initialOperationalCostsFund,
  teamMembers,
  equipment,
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
import { DollarSign, Users, Target, CheckCircle, ArrowRight } from 'lucide-react';
import { DonorsList } from '@/components/projects/donors-list';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { EquipmentShowcase } from '@/components/dashboard/equipment-showcase';
import { DonationDialog } from '@/components/projects/donation-dialog';
import { useToast } from '@/hooks/use-toast';


export default function OperationalCostsPage() {
  const [operationalCostsFund, setOperationalCostsFund] = useState(initialOperationalCostsFund);
  const [raisedAmount, setRaisedAmount] = useState(
    operationalCostsFund.raisedAmount
  );
  const [donors, setDonors] = useState(operationalCostsFund.donors);
  const [isClient, setIsClient] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    if (raisedAmount >= operationalCostsFund.targetAmount) {
      return;
    }

    const interval = setInterval(() => {
      setRaisedAmount((prev) => {
        const newAmount = prev + Math.floor(Math.random() * 50) + 5;
        return Math.min(newAmount, operationalCostsFund.targetAmount);
      });
      if (Math.random() > 0.7) {
        setDonors((prev) => prev + 1);
      }
    }, 5000); // Simulate new donation every 5 seconds

    return () => clearInterval(interval);
  }, [raisedAmount, operationalCostsFund.targetAmount]);

  const handleDonation = (amount: number) => {
    setRaisedAmount((prev) => prev + amount);
    setDonors((prev) => prev + 1);
    toast({
      title: 'Thank You for Your Support!',
      description: `Your generous donation of $${amount} will help us continue our mission.`,
      variant: 'default',
    });
  };

  const percentage = Math.round(
    (raisedAmount / operationalCostsFund.targetAmount) * 100
  );

  return (
    <div className="mx-auto max-w-6xl">
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
                        Our mission is to bring radical transparency to fundraising. We believe donors have the right to know exactly how their contributions create change. ClarityChain provides a secure, auditable platform to track funds, ensuring accountability and rebuilding trust in the non-profit sector.
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
                    <DonorsList projectName={operationalCostsFund.name} />
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
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-bold">
                          ${raisedAmount.toLocaleString()}
                        </p>
                        <p className="text-muted-foreground">Raised</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-bold">
                          ${operationalCostsFund.targetAmount.toLocaleString()}
                        </p>
                        <p className="text-muted-foreground">Target</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-bold">{donors.toLocaleString()}</p>
                        <p className="text-muted-foreground">Donors</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="h-3 rounded-full bg-muted animate-pulse"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-8 rounded-md bg-muted animate-pulse"></div>
                    <div className="h-8 rounded-md bg-muted animate-pulse"></div>
                    <div className="h-8 rounded-md bg-muted animate-pulse"></div>
                  </div>
                </div>
              )}
              <Button size="lg" className="w-full text-lg" onClick={() => setIsDonationOpen(true)}>
                Fund Our Operations
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
                <CardTitle>Meet The Team</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex -space-x-2 overflow-hidden">
                    {teamMembers.map(member => (
                        <Avatar key={member.id} className="inline-block h-12 w-12 rounded-full ring-2 ring-background">
                            <AvatarImage src={member.avatarUrl} alt={member.name} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
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
