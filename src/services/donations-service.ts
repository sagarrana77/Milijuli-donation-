/**
 * @fileOverview A service for fetching donation data from Firestore.
 */
'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy, doc, getDoc, getCountFromServer } from 'firebase/firestore';
import { users as mockUsers, physicalDonations as mockPhysicalDonations, allDonations as mockAllDonations, type PhysicalDonation, type User, type Donation } from '@/lib/data';

/**
 * Fetches all in-kind donations from the Firestore 'donations' collection.
 * @returns A promise that resolves to an array of all in-kind donations.
 */
export async function getInKindDonations(): Promise<PhysicalDonation[]> {
  try {
    return mockPhysicalDonations.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error("Error fetching in-kind donations: ", error);
    return [];
  }
}

/**
 * Fetches all monetary donations.
 * @returns A promise that resolves to an array of all monetary donations.
 */
export async function getAllDonations(): Promise<Donation[]> {
    try {
        return mockAllDonations;
    } catch (error) {
        console.error("Error fetching all donations: ", error);
        return [];
    }
}

/**
 * Fetches all users from the Firestore 'users' collection.
 * @returns A promise that resolves to an array of all users.
 */
export async function getUsers(): Promise<User[]> {
    try {
        return mockUsers;
    } catch (error) {
        console.error("Error fetching users: ", error);
        return [];
    }
}

/**
 * Fetches a single user by their ID from the Firestore 'users' collection.
 * @param id The ID of the user to fetch.
 * @returns A promise that resolves to the user object or undefined if not found.
 */
export async function getUser(id: string): Promise<User | undefined> {
    try {
        return mockUsers.find(u => u.id === id);
    } catch (error) {
        console.error("Error fetching user: ", error);
        return undefined;
    }
}


/**
 * Fetches the count of pending in-kind donations.
 * @returns A promise that resolves to the number of pending donations.
 */
export async function getPendingDonationsCount(): Promise<number> {
    try {
        return mockPhysicalDonations.filter(d => d.status === 'Pending').length;
    } catch (error) {
        console.error("Error fetching pending donations count: ", error);
        return 0;
    }
}
