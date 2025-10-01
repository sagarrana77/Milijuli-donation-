
'use client';

import { useState } from 'react';
import { Package, Users, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InKindDonationsClient } from './in-kind-donations-client';
import { AllInKindDonors } from './all-in-kind-donors';
import { getInKindDonations, getUsers } from '@/services/donations-service';
import { getProjects } from '@/services/projects-service';
import { type Project, type PhysicalDonation, type User } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect } from 'react';
import { InKindPledges } from '@/components/dashboard/in-kind-pledges';

export default function InKindDonationsPage() {
  const [physicalDonations, setPhysicalDonations] = useState<PhysicalDonation[]>([]);
  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const [usersData, setUsersData] = useState<User[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const [pd, p, u] = await Promise.all([
        getInKindDonations(),
        getProjects(),
        getUsers()
      ]);
      setPhysicalDonations(pd);
      setProjectsData(p);
      setUsersData(u);
    }
    fetchData();
  }, []);

  const completedDonations = physicalDonations.filter((d) => d.status === 'Completed');
  const projectsWithDonations = projectsData.filter((project) =>
    completedDonations.some((donation) => donation.projectName === project.name)
  );

  useEffect(() => {
    if (projectsWithDonations.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projectsWithDonations[0].id);
    }
  }, [projectsWithDonations, selectedProjectId]);

  const selectedProject = projectsData.find(p => p.id === selectedProjectId);
  const selectedProjectDonations = selectedProject
    ? completedDonations.filter(d => d.projectName === selectedProject.name)
    : [];
  
  const inKindDonors = usersData.filter(user => 
    completedDonations.some(donation => donation.donorId === user.id)
  );

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="text-center">
        <Package className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
          In-Kind Donations
        </h1>
        <p className="mt-2 text-base md:text-lg text-muted-foreground">
          A heartfelt thank you to our donors for these generous physical
          contributions.
        </p>
      </div>
      
      <Tabs defaultValue="gallery">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="gallery"><Package className="mr-2 h-4 w-4" /> Completed Donations</TabsTrigger>
          <TabsTrigger value="donors"><Users className="mr-2 h-4 w-4" /> All Donors</TabsTrigger>
          <TabsTrigger value="feed"><Activity className="mr-2 h-4 w-4" /> Live Feed</TabsTrigger>
        </TabsList>

        <TabsContent value="gallery" className="mt-6">
            <Card>
                <CardHeader>
                <CardTitle>Donations by Project</CardTitle>
                <CardDescription>A showcase of successfully donated physical items, organized by campaign.</CardDescription>
                </CardHeader>
                <CardContent>
                {projectsWithDonations.length > 0 ? (
                    <div className="space-y-4">
                    <Select
                        value={selectedProjectId || ''}
                        onValueChange={(value) => setSelectedProjectId(value)}
                    >
                        <SelectTrigger className="w-full md:w-72">
                        <SelectValue placeholder="Select a project" />
                        </SelectTrigger>
                        <SelectContent>
                        {projectsWithDonations.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                            {project.name}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    {selectedProject && (
                        <div className="mt-4">
                        <InKindDonationsClient
                            project={selectedProject}
                            donations={selectedProjectDonations}
                            users={usersData}
                        />
                        </div>
                    )}
                    </div>
                ) : (
                    <div className="py-24 text-center text-muted-foreground">
                    <p>No completed in-kind donations to display yet.</p>
                    </div>
                )}
                </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="donors" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>Our In-Kind Donors</CardTitle>
                    <CardDescription>A list of all the generous individuals who have donated physical items.</CardDescription>
                </CardHeader>
                <CardContent>
                    <AllInKindDonors donors={inKindDonors} allDonations={completedDonations} />
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="feed" className="mt-6">
            <InKindPledges />
        </TabsContent>

      </Tabs>
    </div>
  );
}
