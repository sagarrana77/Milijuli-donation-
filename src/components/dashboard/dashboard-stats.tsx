
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  DollarSign,
  HandCoins,
  Briefcase,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import { ExpenseChart } from '@/components/dashboard/expense-chart';
import { operationalCostsFund as initialOperationalCostsFund, salaries, equipment, miscExpenses, platformSettings, allDonations as initialAllDonations } from '@/lib/data';
import type { Project, Donation } from '@/lib/data';
import { ScrollFadeIn } from '@/components/ui/scroll-fade-in';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ProjectCard } from '../projects/project-card';
import { HallOfFameDonors } from '../projects/hall-of-fame-donors';

interface DashboardStatsProps {
    allProjects: Project[];
}

export function DashboardStats({ allProjects }: DashboardStatsProps) {
  const [stats, setStats] = useState({
    totalFunds: 0,
    monthlyIncrease: 2012300,
    totalDonors: 4950,
    newDonors: 213,
    projectsFunded: 0,
    countries: 1,
    totalSpent: 0,
    fundsInHand: 0,
    spendingBreakdown: [
      { name: 'Education', value: 0, key: 'education' },
      { name: 'Health', value: 0, key: 'health' },
      { name: 'Relief', value: 0, key: 'relief' },
      { name: 'Operational', value: 0, key: 'operational' },
    ],
  });
  const [operationalFund, setOperationalFund] = useState(initialOperationalCostsFund);
  const [allDonations, setAllDonations] = useState<Donation[]>(initialAllDonations);
  
  useEffect(() => {
    const calculateStats = () => {
        const totalSalaryCosts = salaries.reduce((acc, s) => {
            const nprAmount = s.currency === 'USD' ? s.salary * 133 : s.salary;
            return acc + nprAmount;
        }, 0);
        const totalEquipmentCosts = equipment.reduce((acc, e) => acc + e.cost, 0);
        const totalMiscCosts = miscExpenses.reduce((acc, e) => acc + e.cost, 0);
        const currentOperationalExpenses = (totalSalaryCosts * 12) + totalEquipmentCosts + totalMiscCosts;

        const educationExpenses = allProjects
            .filter(p => p.id === 'education-for-all-nepal')
            .reduce((sum, p) => sum + (p.expenses?.reduce((acc, exp) => acc + exp.amount, 0) || 0), 0);
        
        const healthExpenses = allProjects
            .filter(p => ['clean-water-initiative', 'community-health-posts'].includes(p.id))
            .reduce((sum, p) => sum + (p.expenses?.reduce((acc, exp) => acc + exp.amount, 0) || 0), 0);

        const reliefExpenses = allProjects
            .filter(p => p.id === 'disaster-relief-fund')
            .reduce((sum, p) => sum + (p.expenses?.reduce((acc, exp) => acc + exp.amount, 0) || 0), 0);

        const totalRaised = allProjects.reduce((acc, p) => acc + p.raisedAmount, 0) + initialOperationalCostsFund.raisedAmount;
        const totalProjectExpenses = allProjects.reduce(
            (acc, p) => acc + (p.expenses?.reduce((sum, e) => sum + e.amount, 0) || 0),
            0
        );
        const totalSpending = totalProjectExpenses + currentOperationalExpenses;
        const fundsInHand = totalRaised - totalSpending;
        
        setStats(prev => ({
            ...prev,
            totalFunds: totalRaised,
            projectsFunded: allProjects.filter(p => p.raisedAmount >= p.targetAmount).length,
            totalSpent: totalSpending,
            fundsInHand: fundsInHand,
            spendingBreakdown: [
                { name: 'Education', value: educationExpenses, key: 'education' },
                { name: 'Health', value: healthExpenses, key: 'health' },
                { name: 'Relief', value: reliefExpenses, key: 'relief' },
                { name: 'Operational', value: currentOperationalExpenses, key: 'operational' },
            ],
        }));
        setOperationalFund({...initialOperationalCostsFund});
        setAllDonations([...initialAllDonations]);
    };

    calculateStats();
    const interval = setInterval(calculateStats, 5000); // Re-calculate every 5 seconds to simulate real-time

    return () => clearInterval(interval);
  }, [allProjects]);

  const opsPercentage = Math.round(
    (operationalFund.raisedAmount / operationalFund.targetAmount) * 100
  );
  const showOpsTarget = platformSettings.showOperationalCostsTarget && operationalFund.targetAmount > 0;
  const operationalDonors = allDonations.filter(d => d.project === 'Operational Costs').slice(0, 5);
  
  const approvedProjects = allProjects.filter(p => p.verified);
  const runningProjects = approvedProjects.filter(p => p.raisedAmount < p.targetAmount);
  const finishedProjects = approvedProjects.filter(p => p.raisedAmount >= p.targetAmount);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ScrollFadeIn>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Funds Raised</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-chart-1">
                Rs.{stats.totalFunds.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +Rs.{stats.monthlyIncrease.toLocaleString()} from last month
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
              <div className="text-xl md:text-2xl font-bold text-chart-2">
                Rs.{stats.fundsInHand.toLocaleString()}
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
              <CardTitle className="text-sm font-medium">Total Funds Spent</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-chart-3">
                Rs.{stats.totalSpent.toLocaleString()}
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
              <CardTitle className="text-sm font-medium">Operational Costs Fund</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-2">
              <div className="w-full">
                <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                  <span>Rs.{operationalFund.raisedAmount.toLocaleString()} Received</span>
                  <span>{operationalFund.donors} Donors</span>
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
        </div>
    </div>
    </>
  );
}
