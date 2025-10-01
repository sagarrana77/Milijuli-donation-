
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { TrendingUp, CheckCircle } from 'lucide-react';
import { ProjectCard } from '@/components/projects/project-card';
import { HallOfFameDonors } from '@/components/projects/hall-of-fame-donors';

export default async function DashboardPage() {
    const projects = await getProjects();
    
    const featuredJobs = jobOpenings.filter(job => job.featured).slice(0, 2);

    const educationExpenses = projects
        .filter(p => p.id === 'education-for-all-nepal')
        .reduce((sum, p) => sum + (p.expenses?.reduce((acc, exp) => acc + exp.amount, 0) || 0), 0);
    
    const healthExpenses = projects
        .filter(p => ['clean-water-initiative', 'community-health-posts'].includes(p.id))
        .reduce((sum, p) => sum + (p.expenses?.reduce((acc, exp) => acc + exp.amount, 0) || 0), 0);

    const reliefExpenses = projects
        .filter(p => p.id === 'disaster-relief-fund')
        .reduce((sum, p) => sum + (p.expenses?.reduce((acc, exp) => acc + exp.amount, 0) || 0), 0);
    
    const initialSpendingBreakdown = [
      { name: 'Education', value: educationExpenses, key: 'education' },
      { name: 'Health', value: healthExpenses, key: 'health' },
      { name: 'Relief', value: reliefExpenses, key: 'relief' },
      { name: 'Operational', value: 0, key: 'operational' },
    ];
    
    const approvedProjects = projects.filter(p => p.verified);
    const runningProjects = approvedProjects.filter(p => p.raisedAmount < p.targetAmount);
    const finishedProjects = approvedProjects.filter(p => p.raisedAmount >= p.targetAmount);


  return (
    <div className="flex flex-col gap-8">
        <ScrollFadeIn>
            <CampaignHeroSlider projects={projects} />
        </ScrollFadeIn>

        <DashboardStats allProjects={projects} />

        <ScrollFadeIn>
            <InKindDonationsSlider allProjects={projects} />
        </ScrollFadeIn>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                 <ScrollFadeIn asChild>
                    <section>
                      <div className="mb-4 flex items-center gap-3">
                          <TrendingUp className="h-6 w-6 text-primary" />
                          <h2 className="text-2xl font-bold">Active Campaigns</h2>
                      </div>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                          {runningProjects.slice(0, 2).map((project, index) => (
                              <ScrollFadeIn key={project.id} delay={index * 100}>
                                  <ProjectCard project={project} />
                              </ScrollFadeIn>
                          ))}
                      </div>
                    </section>
                 </ScrollFadeIn>
                 <ScrollFadeIn asChild>
                    <section>
                      <div className="mb-4 flex items-center gap-3">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                          <h2 className="text-2xl font-bold">Successfully Funded</h2>
                      </div>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                          {finishedProjects.slice(0, 2).map((project, index) => (
                              <ScrollFadeIn key={project.id} delay={index * 100}>
                                  <ProjectCard project={project} />
                              </ScrollFadeIn>
                          ))}
                      </div>
                    </section>
                 </ScrollFadeIn>
            </div>
             <div className="lg:col-span-1 space-y-8">
                 <ScrollFadeIn asChild>
                    <section>
                        <HallOfFameDonors donations={allDonations} />
                    </section>
                </ScrollFadeIn>
                 <ScrollFadeIn>
                  <Card>
                      <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                              <UserPlus className="h-6 w-6 text-purple-500" />
                              We're Hiring!
                          </CardTitle>
                          <CardDescription>
                              Join our mission to build a transparent world.
                          </CardDescription>
                      </CardHeader>
                      <CardContent>
                          <ul className="space-y-4">
                              {featuredJobs.map(job => (
                                  <li key={job.id} className="p-3 rounded-md border bg-background/50 hover:bg-muted/50 md:flex md:items-center md:justify-between">
                                      <div>
                                          <p className="font-semibold">{job.title}</p>
                                          <p className="text-sm text-muted-foreground">{job.location}</p>
                                      </div>
                                      <Badge variant={job.type === 'Volunteer' ? 'secondary' : 'default'} className="mt-2 md:mt-0">{job.type}</Badge>
                                  </li>
                              ))}
                          </ul>
                      </CardContent>
                      <CardFooter>
                          <Button asChild variant="outline" className="w-full">
                              <Link href="/careers">View All Openings <ArrowRight className="ml-2 h-4 w-4" /></Link>
                          </Button>
                      </CardFooter>
                  </Card>
                </ScrollFadeIn>
            </div>
        </div>

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
