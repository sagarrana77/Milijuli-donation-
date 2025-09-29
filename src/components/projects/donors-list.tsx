

import { allDonations } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface DonorsListProps {
  projectName: string;
}

export function DonorsList({ projectName }: DonorsListProps) {
  const projectDonations = allDonations.filter(
    (donation) => donation.project === projectName
  );

  return (
      <CardContent className="p-6">
        {projectDonations.length > 0 ? (
          <ul className="space-y-4">
            {projectDonations.map((donation) => (
              <li key={donation.id} className="flex items-center justify-between gap-4 rounded-md border bg-card p-3">
                <Link href={donation.donor.profileUrl} className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border">
                        <AvatarImage src={donation.donor.avatarUrl} alt={donation.donor.name} />
                        <AvatarFallback>{donation.donor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="flex items-center gap-1.5">
                           <p className="font-semibold">{donation.donor.name}</p>
                           {donation.donor.isProMember && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Sparkles className="h-4 w-4 text-primary" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Pro Member</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                           )}
                        </div>
                        <p className="text-sm text-muted-foreground">{format(new Date(donation.date), 'PPP')}</p>
                    </div>
                </Link>
                <p className="font-bold text-lg text-primary">Rs.{donation.amount.toLocaleString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-muted-foreground">
            No recent donations for this project yet.
          </p>
        )}
      </CardContent>
  );
}

    