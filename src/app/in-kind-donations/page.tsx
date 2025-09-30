
import { Package } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InKindDonationsClient } from './in-kind-donations-client';
import { HallOfFameDonors } from '@/components/projects/hall-of-fame-donors';
import { getInKindDonations, getAllDonations, getUsers } from '@/services/donations-service';
import { getProjects } from '@/services/projects-service';

export default async function InKindDonationsPage() {
  // Fetch all required data using service functions
  const [
    physicalDonations,
    allDonationsData,
    projectsData,
    usersData
  ] = await Promise.all([
    getInKindDonations(),
    getAllDonations(),
    getProjects(),
    getUsers()
  ]);

  // Ensure all data is treated as an array, even if fetching fails or returns nothing
  const completedDonations = Array.isArray(physicalDonations)
    ? physicalDonations.filter((d) => d.status === 'Completed')
    : [];

  const projects = Array.isArray(projectsData) ? projectsData : [];
  const users = Array.isArray(usersData) ? usersData : [];
  const allDonations = Array.isArray(allDonationsData) ? allDonationsData : [];

  const projectsWithDonations = projects.filter((project) =>
    completedDonations.some((donation) => donation.projectName === project.name)
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
      
      <HallOfFameDonors donations={allDonations} />

      <Card>
          <CardHeader>
              <CardTitle>Completed In-Kind Donations by Project</CardTitle>
              <CardDescription>A showcase of successfully donated physical items, organized by campaign.</CardDescription>
          </CardHeader>
          <CardContent>
            {projectsWithDonations.length > 0 ? (
                <Tabs defaultValue={projectsWithDonations[0].id} className="w-full">
                <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
                    {projectsWithDonations.map((project) => (
                    <TabsTrigger key={project.id} value={project.id}>
                        {project.name}
                    </TabsTrigger>
                    ))}
                </TabsList>
                {projectsWithDonations.map((project) => {
                    const projectDonations = completedDonations.filter(
                    (d) => d.projectName === project.name
                    );
                    return (
                    <TabsContent key={project.id} value={project.id} className="mt-4">
                        <InKindDonationsClient
                            project={project}
                            donations={projectDonations}
                            users={users}
                        />
                    </TabsContent>
                    );
                })}
                </Tabs>
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
