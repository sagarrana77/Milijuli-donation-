
import { Award } from 'lucide-react';
import { getAllDonations } from '@/services/donations-service';
import { getProjects } from '@/services/projects-service';
import { HallOfFameDonors } from '@/components/projects/hall-of-fame-donors';
import { Card, CardContent } from '@/components/ui/card';
import { AllUpdatesFeed } from '@/components/dashboard/all-updates-feed';

export default async function HallOfFamePage() {
  const [allDonationsData, projects] = await Promise.all([
    getAllDonations(),
    getProjects(),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="text-center">
        <Award className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
          Hall of Fame
        </h1>
        <p className="mt-2 text-base md:text-lg text-muted-foreground">
          A heartfelt thank you to our most generous donors. Your support makes our mission possible.
        </p>
      </div>

      {allDonationsData.length > 0 ? (
        <HallOfFameDonors donations={allDonationsData} />
      ) : (
        <Card>
          <CardContent className="py-24 text-center text-muted-foreground">
            <p>No donations to display in the Hall of Fame yet.</p>
          </CardContent>
        </Card>
      )}

      <AllUpdatesFeed allProjects={projects} />
    </div>
  );
}
