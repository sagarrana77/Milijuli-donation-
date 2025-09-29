'use server';
/**
 * @fileOverview A flow to generate SEO suggestions for projects.
 *
 * - generateSeoSuggestions - A function that generates SEO keywords and a meta description.
 * - GenerateSeoSuggestionsInput - The input type for the function.
 * - GenerateSeoSuggestionsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { projects } from '@/lib/data';

// Tool to get project details for SEO
const getProjectDetailsForSeo = ai.defineTool(
  {
    name: 'getProjectDetailsForSeo',
    description: 'Returns the name and full description for a given project ID to be used for SEO optimization.',
    inputSchema: z.object({
      projectId: z.string().describe('The unique ID of the project.'),
    }),
    outputSchema: z.object({
      name: z.string(),
      longDescription: z.string(),
    }),
  },
  async ({ projectId }) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    return {
      name: project.name,
      longDescription: project.longDescription,
    };
  }
);

export const GenerateSeoSuggestionsInputSchema = z.object({
  projectId: z.string().describe('The ID of the project to generate SEO suggestions for.'),
});
export type GenerateSeoSuggestionsInput = z.infer<typeof GenerateSeoSuggestionsInputSchema>;

export const GenerateSeoSuggestionsOutputSchema = z.object({
  keywords: z.array(z.string()).describe('A list of 5-7 highly relevant SEO keywords for the project.'),
  metaDescription: z.string().describe('A compelling, SEO-friendly meta description (max 160 characters).'),
});
export type GenerateSeoSuggestionsOutput = z.infer<typeof GenerateSeoSuggestionsOutputSchema>;

export async function generateSeoSuggestions(
  input: GenerateSeoSuggestionsInput
): Promise<GenerateSeoSuggestionsOutput> {
  return generateSeoSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSeoSuggestionsPrompt',
  input: {schema: GenerateSeoSuggestionsInputSchema},
  output: {schema: GenerateSeoSuggestionsOutputSchema},
  tools: [getProjectDetailsForSeo],
  prompt: `You are an SEO expert specializing in content optimization for non-profit and fundraising websites.
Your task is to generate SEO suggestions for the project with ID '{{{projectId}}}'.

Use the getProjectDetailsForSeo tool to fetch the project's name and long description.

Based on the fetched content, please provide the following:
1.  **Keywords**: A list of 5-7 relevant, high-impact SEO keywords. Include a mix of short-tail and long-tail keywords. Focus on terms that potential donors might use to search for such a project.
2.  **Meta Description**: A compelling, concise meta description. It must be under 160 characters and should entice users to click through from a search engine results page. It should summarize the project's goal and include a call to action.
`,
});

const generateSeoSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateSeoSuggestionsFlow',
    inputSchema: GenerateSeoSuggestionsInputSchema,
    outputSchema: GenerateSeoSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
