'use server';

/**
 * @fileOverview A flow to generate donor-friendly reports summarizing project status and fund allocation.
 *
 * - generateDonorFriendlyReport - A function that generates a donor-friendly report for a specific project.
 * - GenerateDonorFriendlyReportInput - The input type for the generateDonorFriendlyReport function.
 * - GenerateDonorFriendlyReportOutput - The return type for the generateDonorFriendlyReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { projects } from '@/lib/data';

// Define a tool for the AI to get project financial data
const getProjectFinancials = ai.defineTool(
    {
      name: 'getProjectFinancials',
      description: 'Returns financial and status data for a given project ID.',
      inputSchema: z.object({
        projectId: z.string().describe('The unique ID of the project.'),
      }),
      outputSchema: z.object({
        name: z.string(),
        targetAmount: z.number(),
        raisedAmount: z.number(),
        donors: z.number(),
        expenses: z.array(z.object({ item: z.string(), amount: z.number() })),
      }),
    },
    async ({ projectId }) => {
      const project = projects.find(p => p.id === projectId);
      if (!project) {
        throw new Error('Project not found');
      }
      return {
        name: project.name,
        targetAmount: project.targetAmount,
        raisedAmount: project.raisedAmount,
        donors: project.donors,
        expenses: project.expenses.map(e => ({ item: e.item, amount: e.amount })),
      };
    }
  );


const GenerateDonorFriendlyReportInputSchema = z.object({
  projectId: z
    .string()
    .describe(
      'The ID of the project to generate a report for.'
    ),
});
export type GenerateDonorFriendlyReportInput = z.infer<
  typeof GenerateDonorFriendlyReportInputSchema
>;

const GenerateDonorFriendlyReportOutputSchema = z.object({
  report: z
    .string()
    .describe(
      'A comprehensive, well-structured, and donor-friendly report in Markdown format.'
    ),
});
export type GenerateDonorFriendlyReportOutput = z.infer<
  typeof GenerateDonorFriendlyReportOutputSchema
>;

export async function generateDonorFriendlyReport(
  input: GenerateDonorFriendlyReportInput
): Promise<GenerateDonorFriendlyReportOutput> {
  return generateDonorFriendlyReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDonorFriendlyReportPrompt',
  input: {schema: GenerateDonorFriendlyReportInputSchema},
  output: {schema: GenerateDonorFriendlyReportOutputSchema},
  tools: [getProjectFinancials],
  prompt: `You are an expert in creating engaging and transparent reports for non-profit donors. Your task is to generate a report for the project with ID '{{{projectId}}}'.

Use the getProjectFinancials tool to fetch the project's data.

Analyze the fetched data (funds raised vs. target, expenses, donor count) and generate a concise, easy-to-understand summary. The report should be written in Markdown and include:
- A clear title.
- A brief, encouraging summary of the project's progress.
- A simple breakdown of how funds have been spent so far.
- A concluding sentence that thanks the donors and reinforces the project's importance.

The tone should be positive, appreciative, and professional. Highlight the impact of the donations.`,
});

const generateDonorFriendlyReportFlow = ai.defineFlow(
  {
    name: 'generateDonorFriendlyReportFlow',
    inputSchema: GenerateDonorFriendlyReportInputSchema,
    outputSchema: GenerateDonorFriendlyReportOutputSchema,
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
