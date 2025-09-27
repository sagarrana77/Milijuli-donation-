
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
            <div className="h-3 rounded-full bg-muted animate-pulse"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-8 rounded-md bg-muted animate-pulse"></div>
              <div className="h-8 rounded-md bg-muted animate-pulse"></div>
              <div className="h-8 rounded-md bg-muted animate-pulse"></div>
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
