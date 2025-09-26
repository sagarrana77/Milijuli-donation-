
import { recentDonations } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import Link from 'next/link';

interface DonorsListProps {
  projectName: string;
}

export function DonorsList({ projectName }: DonorsListProps) {
  const projectDonations = recentDonations.filter(
    (donation) => donation.project === projectName
  );

  return (
    <Card>
      <CardContent className="p-6">
        {projectDonations.length > 0 ? (
          <ul className="space-y-4">
            {projectDonations.map((donation) => (
              <li key={donation.id} className="flex items-center justify-between gap-4">
                <Link href={donation.donor.profileUrl} className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border">
                        <AvatarImage src={donation.donor.avatarUrl} alt={donation.donor.name} />
                        <AvatarFallback>{donation.donor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{donation.donor.name}</p>
                        <p className="text-sm text-muted-foreground">{format(donation.date, 'PPP')}</p>
                    </div>
                </Link>
                <p className="font-bold text-lg text-primary">${donation.amount.toLocaleString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-muted-foreground">
            No recent donations for this project yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
