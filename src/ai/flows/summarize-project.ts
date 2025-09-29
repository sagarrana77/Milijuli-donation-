
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

const SummarizeProjectInputSchema = z.object({
  name: z.string().describe("The name of the project."),
  longDescription: z.string().describe("The full description or story of the project to be summarized."),
});
export type SummarizeProjectInput = z.infer<typeof SummarizeProjectInputSchema>;

const SummarizeProjectOutputSchema = z.object({
  summary: z.string().describe('A concise, compelling summary of the project description.'),
});
export type SummarizeProjectOutput = z.infer<typeof SummarizeProjectOutputSchema>;


export async function summarizeProject(input: SummarizeProjectInput): Promise<SummarizeProjectOutput> {
  return summarizeProjectFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeProjectPrompt',
  input: {schema: SummarizeProjectInputSchema},
  output: {schema: SummarizeProjectOutputSchema},
  prompt: `You are an expert copywriter for a non-profit. Your task is to summarize the following project description into a single, concise, and compelling paragraph for a potential donor.

Project Name: "{{{name}}}"
Full Description:
"{{{longDescription}}}"

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
