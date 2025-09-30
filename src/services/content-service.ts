/**
 * @fileOverview A service for fetching and managing site content.
 */
'use server';

import { faqs as initialFaqs, type FAQ } from '@/lib/data';

// In-memory store for FAQs to allow for mutation on the admin page.
// In a real app, this would be a database like Firestore.
let faqStore = [...initialFaqs];

/**
 * Fetches all FAQs.
 * @returns A promise that resolves to an array of all FAQs.
 */
export async function getFaqs(): Promise<FAQ[]> {
  return [...faqStore];
}

/**
 * Overwrites the entire list of FAQs.
 * @param newFaqs The new array of FAQ objects.
 */
export async function setFaqs(newFaqs: FAQ[]): Promise<void> {
  faqStore = newFaqs;
}
