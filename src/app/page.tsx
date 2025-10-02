
import { getProjects } from '@/services/projects-service';
import { ScrollFadeIn } from '@/components/ui/scroll-fade-in';
import { InKindDonationsSlider } from '@/components/dashboard/in-kind-donations-slider';
import { CampaignHeroSlider } from '@/components/dashboard/campaign-hero-slider';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExpenseChart } from '@/components/dashboard/expense-chart';
import { useState, useEffect } from 'react';


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
      
    </div>
  );
}
