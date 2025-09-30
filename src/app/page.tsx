

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  DollarSign,
  Users,
  Briefcase,
  HandCoins,
  CheckCircle,
  TrendingUp,
  UserPlus,
  ArrowRight,
  Award,
} from 'lucide-react';
import { ExpenseChart } from '@/components/dashboard/expense-chart';
import { OperationalCosts } from '@/components/dashboard/operational-costs';
import { operationalCostsFund, jobOpenings, salaries, equipment, miscExpenses, teamMembers, platformSettings, allDonations } from '@/lib/data';
import { getProjects } from '@/services/projects-service';
import { ProjectCard } from '@/components/projects/project-card';
import { Badge } from '@/components/ui/badge';
import { ScrollFadeIn } from '@/components/ui/scroll-fade-in';
import { InKindDonationsSlider } from '@/components/dashboard/in-kind-donations-slider';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { CampaignHeroSlider } from '@/components/dashboard/campaign-hero-slider';
import { HallOfFameDonors } from '@/components/projects/hall-of-fame-donors';
import { AllUpdatesFeed } from '@/components/dashboard/all-updates-feed';

export default async function DashboardPage() {
    const projects = await getProjects();
    
    // Calculate operational costs
    const totalSalaryCosts = salaries.reduce((acc, s) => {
        const nprAmount = s.currency === 'USD' ? s.salary * 133 : s.salary;
        return acc + nprAmount;
    }, 0); // Monthly in NPR
    const totalEquipmentCosts = equipment.reduce((acc, e) => acc + e.cost, 0);
    const totalMiscCosts = miscExpenses.reduce((acc, e) => acc + e.cost, 0);
    const currentOperationalExpenses = (totalSalaryCosts * 12) + totalEquipmentCosts + totalMiscCosts; // Annualized for target

    // Calculate project expenses by category
    const educationExpenses = projects
      .filter(p => p.id === 'education-for-all-nepal')
      .reduce((sum, p) => sum + (p.expenses?.reduce((acc, exp) => acc + exp.amount, 0) || 0), 0);

    const healthExpenses = projects
      .filter(p => ['clean-water-initiative', 'community-health-posts'].includes(p.id))
      .reduce((sum, p) => sum + (p.expenses?.reduce((acc, exp) => acc + exp.amount, 0) || 0), 0);

    const reliefExpenses = projects
      .filter(p => p.id === 'disaster-relief-fund')
      .reduce((sum, p) => sum + (p.expenses?.reduce((acc, exp) => acc + exp.amount, 0) || 0), 0);

    // Calculate totals for dashboard stats
    const totalRaised = projects.reduce((acc, p) => acc + p.raisedAmount, 0) + operationalCostsFund.raisedAmount;
    const totalProjectExpenses = projects.reduce(
      (acc, p) => acc + (p.expenses?.reduce((sum, e) => sum + e.amount, 0) || 0),
      0
    );
    const totalSpending = totalProjectExpenses + currentOperationalExpenses;
    const fundsInHand = totalRaised - totalSpending;
    
    const dashboardStats = {
        totalFunds: totalRaised,
        monthlyIncrease: 2012300,
        totalDonors: 4950,
        newDonors: 213,
        projectsFunded: projects.filter(p => p.raisedAmount >= p.targetAmount).length,
        countries: 1,
        totalSpent: totalSpending,
        fundsInHand: fundsInHand,
        spendingBreakdown: [
            { name: 'Education', value: educationExpenses, key: 'education' },
            { name: 'Health', value: healthExpenses, key: 'health' },
            { name: 'Relief', value: reliefExpenses, key: 'relief' },
            { name: 'Operational', value: currentOperationalExpenses, key: 'operational' },
        ],
    };


    const opsPercentage = Math.round(
    (operationalCostsFund.raisedAmount / operationalCostsFund.targetAmount) * 100
  );

  const showOpsTarget = platformSettings.showOperationalCostsTarget && operationalCostsFund.targetAmount > 0;

  const approvedProjects = projects.filter(p => p.verified);
  const runningProjects = approvedProjects.filter(p => p.raisedAmount < p.targetAmount);
  const finishedProjects = approvedProjects.filter(p => p.raisedAmount >= p.targetAmount);
  const featuredJobs = jobOpenings.filter(job => job.featured).slice(0, 2);
  const operationalDonors = allDonations.filter(d => d.project === 'Operational Costs').slice(0, 5);


  return (
    <div className="flex flex-col gap-8">
        <ScrollFadeIn>
            <CampaignHeroSlider projects={projects} />
        </ScrollFadeIn>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ScrollFadeIn>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Funds Raised
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-1">
                Rs.{(dashboardStats.totalFunds || 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +Rs.{(dashboardStats.monthlyIncrease || 0).toLocaleString()} from last
                month
              </p>
            </CardContent>
          </Card>
        </ScrollFadeIn>
        <ScrollFadeIn delay={100}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Funds in Hand</CardTitle>
              <HandCoins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-2">
                Rs.{(dashboardStats.fundsInHand || 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Remaining funds after all expenses
              </p>
            </CardContent>
          </Card>
        </ScrollFadeIn>
        <ScrollFadeIn delay={200}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Funds Spent
              </CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-3">
                Rs.{(dashboardStats.totalSpent || 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Includes project and operational costs
              </p>
            </CardContent>
          </Card>
        </ScrollFadeIn>
        <ScrollFadeIn delay={300}>
          <Card className="flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Operational Costs Fund
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-2">
              <div className="w-full">
                  <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                      <span>
                      Rs.{operationalCostsFund.raisedAmount.toLocaleString()} Received
                      </span>
                      <span>{operationalCostsFund.donors} Donors</span>
                  </div>
                  {showOpsTarget && (
                    <Progress value={opsPercentage} aria-label={`${opsPercentage}% funded`} />
                  )}
              </div>
              {operationalDonors.length > 0 && (
                <div className="flex -space-x-2 overflow-hidden">
                    <TooltipProvider>
                        {operationalDonors.map(donation => (
                            <Tooltip key={donation.id}>
                                <TooltipTrigger asChild>
                                    <Link href={donation.donor.profileUrl} className="relative inline-block">
                                        <Avatar className="inline-block h-8 w-8 rounded-full ring-2 ring-background hover:ring-primary transition-all">
                                            <AvatarImage src={donation.donor.avatarUrl} alt={donation.donor.name} />
                                            <AvatarFallback>{donation.donor.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{donation.donor.name} donated Rs.{donation.amount.toLocaleString()}</p>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                     </TooltipProvider>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                  <Link href="/operational-costs">View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        </ScrollFadeIn>
      </div>
      
      <ScrollFadeIn>
        <InKindDonationsSlider allProjects={projects} />
      </ScrollFadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <ScrollFadeIn asChild>
                    <section>
                        <HallOfFameDonors donations={allDonations} />
                    </section>
                </ScrollFadeIn>
            </div>
            <div className="lg:col-span-1">
                 <ScrollFadeIn asChild>
                     <AllUpdatesFeed allProjects={projects} />
                 </ScrollFadeIn>
            </div>
        </div>

      <ScrollFadeIn asChild>
        <section>
            <div className="mb-4 flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Active Campaigns</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {runningProjects.map((project, index) => (
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
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {finishedProjects.map((project, index) => (
                <ScrollFadeIn key={project.id} delay={index * 100}>
                    <ProjectCard project={project} />
                </ScrollFadeIn>
            ))}
            </div>
        </section>
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
                    View All Openings <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {featuredJobs.map((job, index) => (
                <ScrollFadeIn key={job.id} delay={index * 100}>
                <Card className="flex flex-col">
                    <CardHeader>
                    <CardTitle>{job.title}</CardTitle>
                    <CardDescription>{job.location}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                    <Badge variant={job.type === 'Volunteer' ? 'secondary' : 'default'}>
                        {job.type}
                    </Badge>
                    </CardContent>
                    <CardFooter>
                    <Button asChild variant="default" className="w-full">
                        <Link href="/careers">Learn More</Link>
                    </Button>
                    </CardFooter>
                </Card>
                </ScrollFadeIn>
            ))}
            </div>
        </section>
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
