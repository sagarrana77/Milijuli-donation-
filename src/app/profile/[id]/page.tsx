
'use server';

import { notFound } from 'next/navigation';
import { getInKindDonations, getUser, getAllDonations } from '@/services/donations-service';
import type { User } from '@/lib/data';
import { getProjects } from '@/services/projects-service';
import { ProfilePageClient } from './profile-page-client';

async function getUserData(id: string): Promise<User | undefined> {
  // In a real app, you would fetch this from your database
  return getUser(id);
}

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const user = await getUserData(params.id);

  if (!user) {
    notFound();
  }

  // Fetch data on the server
  const allDonations = await getAllDonations();
  const physicalDonations = await getInKindDonations();
  const projects = await getProjects();
  const allUsers = await require('@/services/donations-service').getUsers();


  return (
    <ProfilePageClient
      user={user}
      allDonations={allDonations}
      physicalDonations={physicalDonations}
      projects={projects}
      allUsers={allUsers}
    />
  );
}
