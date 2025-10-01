
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getProjects } from '@/services/projects-service';
import { ScrollFadeIn } from '@/components/ui/scroll-fade-in';
import { InKindDonationsSlider } from '@/components/dashboard/in-kind-donations-slider';
import { CampaignHeroSlider } from '@/components/dashboard/campaign-hero-slider';
import { AllUpdatesFeed } from '@/components/dashboard/all-updates-feed';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';

export default async function DashboardPage() {
    const projects = await getProjects();
    
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
      
    </div>
  );
}
