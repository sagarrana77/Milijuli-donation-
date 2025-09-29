
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { DollarSign, Users, Target } from 'lucide-react';
import { useDonationContext } from '@/components/projects/donation-dialog-wrapper';
import { Skeleton } from '../ui/skeleton';


export function FundraisingProgress() {
  const { project, raisedAmount, donors, percentage, isClient, setIsDonationOpen } = useDonationContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fundraising Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isClient ? (
          <>
            <Progress value={percentage} className="h-3" aria-label={`${percentage}% funded`} />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-bold">${raisedAmount.toLocaleString()}</p>
                  <p className="text-muted-foreground">Raised</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-bold">${project.targetAmount.toLocaleString()}</p>
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
          Donate Now
        </Button>
      </CardContent>
    </Card>
  );
}
