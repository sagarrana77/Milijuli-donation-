

'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Users, Target, CircleDollarSign } from 'lucide-react';
import { useDonationContext } from '@/components/projects/donation-dialog-wrapper';
import { Skeleton } from '../ui/skeleton';


export function FundraisingProgress() {
  const { project, raisedAmount, donors, percentage, isClient, setIsDonationOpen } = useDonationContext();
  const totalSpent = project.expenses.reduce((acc, exp) => acc + exp.amount, 0);
  const availableFunds = raisedAmount - totalSpent;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fundraising Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isClient ? (
          <>
            <Progress value={percentage} className="h-3" aria-label={`${percentage}% funded`} />
            <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                    <span className="font-bold text-muted-foreground">Available</span>
                    <span className="font-bold text-lg">Rs.{availableFunds.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <CircleDollarSign className="h-4 w-4" />
                        <span>Used Funds</span>
                    </div>
                    <span className="font-bold">Rs.{totalSpent.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Target className="h-4 w-4" />
                        <span>Target</span>
                    </div>
                    <span className="font-bold">Rs.{project.targetAmount.toLocaleString()}</span>
                </div>
                 <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>Donors</span>
                    </div>
                    <span className="font-bold">{donors.toLocaleString()}</span>
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
              <Skeleton className="h-5 w-1/3" />
            </div>
          </div>
        )}
        <Button size="lg" className="w-full text-lg" onClick={() => setIsDonationOpen(true)}>
          Donate Now
        </Button>
      </CardContent>
    </Card>
  );
}
