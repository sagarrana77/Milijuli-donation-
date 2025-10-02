

import { getProjects } from '@/services/projects-service';
import { ScrollFadeIn } from '@/components/ui/scroll-fade-in';
import { CampaignHeroSlider } from '@/components/dashboard/campaign-hero-slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExpenseChart } from '@/components/dashboard/expense-chart';
import { useState, useEffect } from 'react';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { getUsers, getInKindDonations } from '@/services/donations-service';


export default async function DashboardPage() {
    const projects = await getProjects();
    const users = await getUsers();
    const physicalDonations = await getInKindDonations();
    
  return (
    <div className="flex flex-col gap-8">
        <ScrollFadeIn>
            <CampaignHeroSlider projects={projects} />
        </ScrollFadeIn>

        <DashboardStats allProjects={projects} physicalDonations={physicalDonations} users={users} />
      
    </div>
  );
}
