
'use client';

import { useState } from 'react';
import { Package } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InKindDonationsClient } from './in-kind-donations-client';
import { HallOfFameDonors } from '@/components/projects/hall-of-fame-donors';
import { getInKindDonations, getAllDonations, getUsers } from '@/services/donations-service';
import { getProjects } from '@/services/projects-service';
import { type Project, type PhysicalDonation, type User, type Donation } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect } from 'react';

export default function InKindDonationsPage() {
  const [physicalDonations, setPhysicalDonations] = useState<PhysicalDonation[]>([]);
  const [allDonationsData, setAllDonationsData] = useState<Donation[]>([]);
  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const [usersData, setUsersData] = useState<User[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const [pd, ad, p, u] = await Promise.all([
        getInKindDonations(),
        getAllDonations(),
        getProjects(),
        getUsers()
      ]);
      setPhysicalDonations(pd);
      setAllDonationsData(ad);
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
      
      <HallOfFameDonors donations={allDonationsData} />

      <Card>
        <CardHeader>
          <CardTitle>Completed In-Kind Donations by Project</CardTitle>
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
    </div>
  );
}
