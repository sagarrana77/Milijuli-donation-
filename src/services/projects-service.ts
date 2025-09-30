/**
 * @fileOverview A service for fetching project data from Firestore.
 */
'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, where, orderBy,getCountFromServer } from 'firebase/firestore';
import { teamMembers, type TeamMember, type Project } from '@/lib/mock-data';

/**
 * Fetches all projects from the Firestore 'projects' collection.
 * @returns A promise that resolves to an array of all projects.
 */
export async function getProjects(): Promise<Project[]> {
  try {
    const projectsCollection = collection(db, 'projects');
    const q = query(projectsCollection, orderBy('createdAt', 'desc'));
    const projectSnapshot = await getDocs(q);
    const projectsList = projectSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Project[];
    return projectsList;
  } catch (error) {
    console.error("Error fetching projects: ", error);
    return [];
  }
}

/**
 * Fetches a single project by its ID from the Firestore 'projects' collection.
 * @param id The ID of the project to fetch.
 * @returns A promise that resolves to the project object or undefined if not found.
 */
export async function getProject(id: string): Promise<Project | undefined> {
  try {
    const projectRef = doc(db, 'projects', id);
    const projectSnap = await getDoc(projectRef);

    if (projectSnap.exists()) {
      return { id: projectSnap.id, ...projectSnap.data() } as Project;
    } else {
      console.log(`No project found with id: ${id}`);
      return undefined;
    }
  } catch (error) {
    console.error("Error fetching project: ", error);
    return undefined;
  }
}

/**
 * Fetches a single team member by their ID.
 * @param id The ID of the team member to fetch.
 * @returns A promise that resolves to the team member object or undefined if not found.
 */
export async function getTeamMember(id: string): Promise<TeamMember | undefined> {
  // In a real app, this might fetch from a 'teamMembers' collection in Firestore.
  // For this demo, we're filtering an in-memory array.
  return teamMembers.find((member) => member.id === id);
}


/**
 * Fetches the count of pending (unverified) projects.
 * @returns A promise that resolves to the number of pending projects.
 */
export async function getPendingCampaignsCount(): Promise<number> {
    try {
        const projectsCollection = collection(db, 'projects');
        const q = query(
            projectsCollection, 
            where('verified', '==', false),
            where('ownerId', '!=', 'milijuli-sewa-admin')
        );
        const snapshot = await getCountFromServer(q);
        return snapshot.data().count;
    } catch (error) {
        console.error("Error fetching pending campaigns count: ", error);
        return 0;
    }
}
