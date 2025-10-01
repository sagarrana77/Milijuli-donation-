
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { getProjects } from '@/services/projects-service';
import { ScrollFadeIn } from '@/components/ui/scroll-fade-in';
import { InKindDonationsSlider } from '@/components/dashboard/in-kind-donations-slider';
import { CampaignHeroSlider } from '@/components/dashboard/campaign-hero-slider';
import { AllUpdatesFeed } from '@/components/dashboard/all-updates-feed';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { ExpenseChart } from '@/components/dashboard/expense-chart';
import { dashboardStats } from '@/lib/data';

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

        <ScrollFadeIn>
            <Card>
                <CardHeader>
                    <CardTitle>Expense Breakdown</CardTitle>
                    <CardDescription>
                    How funds are being allocated across categories.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                    <ExpenseChart data={dashboardStats.spendingBreakdown} />
                    <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
                    {dashboardStats.spendingBreakdown.map((entry, index) => (
                        <div key={entry.name} className="flex items-center gap-2 rounded-full border bg-muted px-3 py-1">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: `hsl(var(--chart-${index + 1}))` }} />
                        <span className="font-medium">{entry.name}</span>
                        </div>
                    ))}
                    </div>
                </CardContent>
            </Card>
        </ScrollFadeIn>
      
    </div>
  );
}
