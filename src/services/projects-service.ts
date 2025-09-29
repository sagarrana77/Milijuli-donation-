'use server';
/**
 * @fileOverview A mock service for fetching project data.
 * This is a temporary solution to resolve build errors and will be replaced
 * with a full Firestore implementation.
 */

import { projects, type Project } from '@/lib/data';

/**
 * Fetches a single project by its ID from the mock data.
 * @param id The ID of the project to fetch.
 * @returns The project object or undefined if not found.
 */
export async function getProject(id: string): Promise<Project | undefined> {
  // Simulate async behavior
  await new Promise(resolve => setTimeout(resolve, 50));
  return projects.find(p => p.id === id);
}

/**
 * Fetches all projects from the mock data.
 * @returns An array of all projects.
 */
export async function getProjects(): Promise<Project[]> {
    // Simulate async behavior
    await new Promise(resolve => setTimeout(resolve, 50));
    return projects;
}
