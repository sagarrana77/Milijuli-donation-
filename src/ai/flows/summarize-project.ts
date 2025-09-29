
'use server';
/**
 * @fileOverview A flow to generate a concise summary of a project's description.
 *
 * - summarizeProject - A function that generates a summary for a project.
 * - SummarizeProjectInput - The input type for the summarizeProject function.
 * - SummarizeProjectOutput - The return type for the summarizeProject function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { projects } from '@/lib/data';

const SummarizeProjectInputSchema = z.object({
  projectId: z.string().describe('The ID of the project to summarize.'),
});
export type SummarizeProjectInput = z.infer<typeof SummarizeProjectInputSchema>;

const SummarizeProjectOutputSchema = z.object({
  summary: z.string().describe('A concise, compelling summary of the project description.'),
});
export type SummarizeProjectOutput = z.infer<typeof SummarizeProjectOutputSchema>;

// Tool to get project details for the summary
const getProjectContentForSummary = ai.defineTool(
  {
    name: 'getProjectContentForSummary',
    description: 'Returns the name and long description for a given project ID.',
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

export async function summarizeProject(input: SummarizeProjectInput): Promise<SummarizeProjectOutput> {
  return summarizeProjectFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeProjectPrompt',
  input: {schema: SummarizeProjectInputSchema},
  output: {schema: SummarizeProjectOutputSchema},
  tools: [getProjectContentForSummary],
  prompt: `You are an expert copywriter for a non-profit. Your task is to summarize the project with ID '{{{projectId}}}' into a single, concise, and compelling paragraph for a potential donor.

Use the getProjectContentForSummary tool to fetch the project's details.

The summary should:
- Be easy to read and understand.
- Capture the main goal and the importance of the project.
- Inspire the reader to donate.
- Be no more than 3-4 sentences long.`,
});

const summarizeProjectFlow = ai.defineFlow(
  {
    name: 'summarizeProjectFlow',
    inputSchema: SummarizeProjectInputSchema,
    outputSchema: SummarizeProjectOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input, {model: 'googleai/gemini-2.5-flash'});
      return output!;
    } catch (e: any) {
      if (e.cause?.status === 503) {
        console.log('gemini-2.5-flash is unavailable, falling back to gemini-pro');
        const {output} = await prompt(input, {model: 'googleai/gemini-pro'});
        return output!;
      }
      // Re-throw other errors
      throw e;
    }
  }
);
