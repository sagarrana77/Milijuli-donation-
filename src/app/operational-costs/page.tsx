
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { operationalCostsFund, salaries, equipment } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  DollarSign,
  Users,
  Target,
  Briefcase,
  MonitorSmartphone,
} from 'lucide-react';
import { OperationalCosts } from '@/components/dashboard/operational-costs';

export default function OperationalCostsPage() {
  const [raisedAmount, setRaisedAmount] = useState(operationalCostsFund.raisedAmount);
  const [donors, setDonors] = useState(operationalCostsFund.donors);
  const [isClient, setIsClient] = useState(false);

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
  }, [raisedAmount]);

  const percentage = Math.round(
    (raisedAmount / operationalCostsFund.targetAmount) * 100
  );

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {operationalCostsFund.name}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {operationalCostsFund.description}
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <OperationalCosts />
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
              <Button size="lg" className="w-full text-lg">
                Fund Our Operations
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
