/**
 * @fileOverview A service for fetching donation data from Firestore.
 */
'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy, doc, getDoc, getCountFromServer } from 'firebase/firestore';
import type { PhysicalDonation, User } from '@/lib/data';

/**
 * Fetches all in-kind donations from the Firestore 'donations' collection.
 * @returns A promise that resolves to an array of all in-kind donations.
 */
export async function getInKindDonations(): Promise<PhysicalDonation[]> {
  try {
    const donationsCollection = collection(db, 'donations');
    const q = query(
        donationsCollection, 
        where('type', '==', 'in-kind'), 
        orderBy('pledgedAt', 'desc')
    );
    const donationSnapshot = await getDocs(q);
    const donationsList = donationSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as PhysicalDonation[];
    return donationsList;
  } catch (error) {
    console.error("Error fetching in-kind donations: ", error);
    return [];
  }
}

/**
 * Fetches all users from the Firestore 'users' collection.
 * @returns A promise that resolves to an array of all users.
 */
export async function getUsers(): Promise<User[]> {
    try {
        const usersCollection = collection(db, 'users');
        const userSnapshot = await getDocs(usersCollection);
        const usersList = userSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as User[];
        return usersList;
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
        const userRef = doc(db, 'users', id);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return { id: userSnap.id, ...userSnap.data() } as User;
        } else {
            console.log(`No user found with id: ${id}`);
            return undefined;
        }
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
        const donationsCollection = collection(db, 'donations');
        const q = query(
            donationsCollection,
            where('type', '==', 'in-kind'),
            where('status', '==', 'Pending')
        );
        const snapshot = await getCountFromServer(q);
        return snapshot.data().count;
    } catch (error) {
        console.error("Error fetching pending donations count: ", error);
        return 0;
    }
}