
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  UserPlus,
  ArrowRight,
} from 'lucide-react';
import { allDonations, jobOpenings } from '@/lib/data';
import { getProjects } from '@/services/projects-service';
import { Badge } from '@/components/ui/badge';
import { ScrollFadeIn } from '@/components/ui/scroll-fade-in';
import { InKindDonationsSlider } from '@/components/dashboard/in-kind-donations-slider';
import Link from 'next/link';
import { CampaignHeroSlider } from '@/components/dashboard/campaign-hero-slider';
import { AllUpdatesFeed } from '@/components/dashboard/all-updates-feed';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { ExpenseChart } from '@/components/dashboard/expense-chart';

export default async function DashboardPage() {
    const projects = await getProjects();
    
    const featuredJobs = jobOpenings.filter(job => job.featured).slice(0, 2);

    // This data is now calculated inside DashboardStats but we can get an initial snapshot
    // for the expense chart here if needed, or pass it down.
    // For simplicity, we'll let DashboardStats handle all stat calculations.
    // The data for the chart will be passed down from the parent.
    const educationExpenses = projects
        .filter(p => p.id === 'education-for-all-nepal')
        .reduce((sum, p) => sum + (p.expenses?.reduce((acc, exp) => acc + exp.amount, 0) || 0), 0);
    
    const healthExpenses = projects
        .filter(p => ['clean-water-initiative', 'community-health-posts'].includes(p.id))
        .reduce((sum, p) => sum + (p.expenses?.reduce((acc, exp) => acc + exp.amount, 0) || 0), 0);

    const reliefExpenses = projects
        .filter(p => p.id === 'disaster-relief-fund')
        .reduce((sum, p) => sum + (p.expenses?.reduce((acc, exp) => acc + exp.amount, 0) || 0), 0);
    
    // We are not calculating operational expenses here as it's complex and better handled client-side for real-time feel.
    // The initial chart might not show operational costs until the client-side component hydrates.
    const initialSpendingBreakdown = [
      { name: 'Education', value: educationExpenses, key: 'education' },
      { name: 'Health', value: healthExpenses, key: 'health' },
      { name: 'Relief', value: reliefExpenses, key: 'relief' },
      { name: 'Operational', value: 0, key: 'operational' },
    ]


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
                <ExpenseChart data={initialSpendingBreakdown} />
                <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
                {initialSpendingBreakdown.map((entry, index) => (
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
