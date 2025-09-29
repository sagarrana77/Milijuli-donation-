

'use client';

import { useState } from 'react';
import Link from 'next/link';
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
} from 'lucide-react';
import { ExpenseChart } from '@/components/dashboard/expense-chart';
import { OperationalCosts } from '@/components/dashboard/operational-costs';
import { dashboardStats, operationalCostsFund, projects, jobOpenings, salaries, equipment, miscExpenses } from '@/lib/data';
import { RealtimeLedger } from '@/components/dashboard/realtime-ledger';
import { ProjectCard } from '@/components/projects/project-card';
import { Badge } from '@/components/ui/badge';
import { ScrollFadeIn } from '@/components/ui/scroll-fade-in';
import { InKindDonationsSlider } from '@/components/dashboard/in-kind-donations-slider';

export default function DashboardPage() {
    const [currentDashboardStats, setCurrentDashboardStats] = useState(dashboardStats);
    
    const opsPercentage = Math.round(
    (operationalCostsFund.raisedAmount / operationalCostsFund.targetAmount) * 100
  );

  const sortedProjects = [...projects].sort((a, b) => Number(b.verified) - Number(a.verified));
  const runningProjects = sortedProjects.filter(p => p.raisedAmount < p.targetAmount);
  const finishedProjects = sortedProjects.filter(p => p.raisedAmount >= p.targetAmount);
  const featuredJobs = jobOpenings.filter(job => job.featured).slice(0, 2);


  return (
    <div className="flex flex-col gap-8">
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
              <div className="text-2xl font-bold">
                ${currentDashboardStats.totalFunds.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +${currentDashboardStats.monthlyIncrease.toLocaleString()} from last
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
              <div className="text-2xl font-bold">
                ${currentDashboardStats.fundsInHand.toLocaleString()}
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
              <div className="text-2xl font-bold">
                ${currentDashboardStats.totalSpent.toLocaleString()}
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
            <CardContent className="flex-1">
              <div className="w-full">
                  <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                      <span>
                      ${operationalCostsFund.raisedAmount.toLocaleString()} raised
                      </span>
                      <span>{opsPercentage}%</span>
                  </div>
                  <Progress value={opsPercentage} aria-label={`${opsPercentage}% funded`} />
              </div>
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
        <OperationalCosts salaries={salaries} equipment={equipment} miscExpenses={miscExpenses} />
      </ScrollFadeIn>
      
      <ScrollFadeIn>
        <RealtimeLedger />
      </ScrollFadeIn>
      
      <ScrollFadeIn>
        <InKindDonationsSlider />
      </ScrollFadeIn>

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
              <ExpenseChart data={currentDashboardStats.spendingBreakdown} />
               <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
                  {currentDashboardStats.spendingBreakdown.map((entry) => (
                      <div key={entry.name} className="flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.fill }} />
                          <span className="text-foreground">{entry.name}</span>
                      </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </ScrollFadeIn>

    </div>
  );
}
