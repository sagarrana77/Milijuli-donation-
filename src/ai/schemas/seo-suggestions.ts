/**
 * @fileOverview Zod schemas and TypeScript types for the SEO suggestions flow.
 */
import {z} from 'genkit';

export const GenerateSeoSuggestionsInputSchema = z.object({
  projectId: z.string().describe('The ID of the project to generate SEO suggestions for.'),
});
export type GenerateSeoSuggestionsInput = z.infer<typeof GenerateSeoSuggestionsInputSchema>;

export const GenerateSeoSuggestionsOutputSchema = z.object({
  keywords: z.array(z.string()).describe('A list of 5-7 highly relevant SEO keywords for the project.'),
  metaDescription: z.string().describe('A compelling, SEO-friendly meta description (max 160 characters).'),
});
export type GenerateSeoSuggestionsOutput = z.infer<typeof GenerateSeoSuggestionsOutputSchema>;
