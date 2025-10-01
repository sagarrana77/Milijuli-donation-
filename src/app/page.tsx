
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  UserPlus,
  ArrowRight,
} from 'lucide-react';
import { jobOpenings, operationalCostsFund, platformSettings, allDonations } from '@/lib/data';
import { getProjects } from '@/services/projects-service';
import { Badge } from '@/components/ui/badge';
import { ScrollFadeIn } from '@/components/ui/scroll-fade-in';
import { InKindDonationsSlider } from '@/components/dashboard/in-kind-donations-slider';
import Link from 'next/link';
import { CampaignHeroSlider } from '@/components/dashboard/campaign-hero-slider';
import { AllUpdatesFeed } from '@/components/dashboard/all-updates-feed';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';

export default async function DashboardPage() {
    const projects = await getProjects();
    
    const featuredJobs = jobOpenings.filter(job => job.featured).slice(0, 2);

  return (
    <div className="flex flex-col gap-8">
        <ScrollFadeIn>
            <CampaignHeroSlider projects={projects} />
        </ScrollFadeIn>

        <DashboardStats allProjects={projects} />

        <ScrollFadeIn>
            <InKindDonationsSlider allProjects={projects} />
        </ScrollFadeIn>

        <ScrollFadeIn>
          <AllUpdatesFeed allProjects={projects} />
        </ScrollFadeIn>

         <ScrollFadeIn asChild>
            <section>
                <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <UserPlus className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-bold">We're Hiring!</h2>
                </div>
                <Button asChild variant="outline">
                    <Link href="/careers">
                        View All <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
                </div>
                 <div className="space-y-4 md:flex md:items-center md:gap-4 md:space-y-0">
                    {featuredJobs.map((job, index) => (
                        <ScrollFadeIn key={job.id} delay={index * 100} className="w-full md:w-1/2">
                        <Card>
                            <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h3 className="font-semibold">{job.title}</h3>
                                <div className="text-sm text-muted-foreground flex items-center gap-4">
                                    <span>{job.location}</span>
                                    <Badge variant={job.type === 'Volunteer' ? 'secondary' : 'default'}>
                                        {job.type}
                                    </Badge>
                                </div>
                            </div>
                            <Button asChild variant="secondary" size="sm" className="w-full md:w-auto mt-2 md:mt-0">
                                <Link href="/careers">Learn More</Link>
                            </Button>
                            </CardContent>
                        </Card>
                        </ScrollFadeIn>
                    ))}
                </div>
            </section>
        </ScrollFadeIn>

    </div>
  );
}
