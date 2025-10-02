
'use client';

import { useMemo } from 'react';
import type { Project, Donation } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Users, CircleDollarSign, PiggyBank } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

interface CategoryStatsCardProps {
    projects: Project[];
    allDonations: Donation[];
}

export function CategoryStatsCard({ projects, allDonations }: CategoryStatsCardProps) {
    const { totalRaised, totalSpent, totalDonors, isLoading } = useMemo(() => {
        if (!projects || projects.length === 0) {
            return { totalRaised: 0, totalSpent: 0, totalDonors: 0, isLoading: false };
        }

        const projectIds = new Set(projects.map(p => p.id));
        
        const totalRaised = projects.reduce((sum, p) => sum + p.raisedAmount, 0);
        
        const totalSpent = projects.reduce((sum, p) => {
            const projectExpenses = p.expenses?.reduce((expSum, exp) => expSum + exp.amount, 0) || 0;
            return sum + projectExpenses;
        }, 0);

        const categoryDonations = allDonations.filter(d => {
            const project = projects.find(p => p.name === d.project);
            return project && projectIds.has(project.id);
        });

        const totalDonors = new Set(categoryDonations.map(d => d.donor.id)).size;

        return { totalRaised, totalSpent, totalDonors, isLoading: false };
    }, [projects, allDonations]);
    
    const percentageSpent = totalRaised > 0 ? Math.round((totalSpent / totalRaised) * 100) : 0;
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Category Impact</CardTitle>
                <CardDescription>An overview of this category's financial activity.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {isLoading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-3 w-full" />
                        <div className="space-y-3">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-5 w-1/2" />
                            <Skeleton className="h-5 w-5/6" />
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="space-y-1">
                            <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                                <span>Rs. {totalSpent.toLocaleString()} spent</span>
                                <span>{percentageSpent}% of raised</span>
                            </div>
                            <Progress value={percentageSpent} className="h-3" aria-label={`${percentageSpent}% of funds spent`} />
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <PiggyBank className="h-4 w-4" />
                                    <span>Total Raised</span>
                                </div>
                                <span className="font-bold text-lg text-primary">Rs.{totalRaised.toLocaleString()}</span>
                            </div>
                             <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <CircleDollarSign className="h-4 w-4" />
                                    <span>Total Spent</span>
                                </div>
                                <span className="font-bold">Rs.{totalSpent.toLocaleString()}</span>
                            </div>
                             <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Users className="h-4 w-4" />
                                    <span>Unique Donors</span>
                                </div>
                                <span className="font-bold">{totalDonors.toLocaleString()}</span>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
