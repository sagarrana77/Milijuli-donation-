
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getProjects } from '@/services/projects-service';
import { getInKindDonations, getUsers } from '@/services/donations-service';
import { Package } from 'lucide-react';
import { InKindDonationsClient } from './in-kind-donations-client';

export default async function InKindDonationsPage() {
  const projects = await getProjects();
  const physicalDonations = await getInKindDonations();
  const users = await getUsers();

  const completedDonations = physicalDonations.filter(
    (d) => d.status === 'Completed'
  );

  const projectsWithDonations = projects.filter((project) =>
    completedDonations.some((donation) => donation.projectId === project.id)
  );

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="text-center">
        <Package className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
          Donation Hall of Fame
        </h1>
        <p className="mt-2 text-base md:text-lg text-muted-foreground">
          A heartfelt thank you to our donors for these generous physical
          contributions.
        </p>
      </div>

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
              (d) => d.projectId === project.id
            );
            return (
              <TabsContent key={project.id} value={project.id}>
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
        <Card>
          <CardContent className="py-24 text-center text-muted-foreground">
            <p>No completed in-kind donations to display yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
