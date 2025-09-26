'use server';

/**
 * @fileOverview A flow to generate donor-friendly reports summarizing fund allocation.
 *
 * - generateDonorFriendlyReport - A function that generates a donor-friendly report.
 * - GenerateDonorFriendlyReportInput - The input type for the generateDonorFriendlyReport function.
 * - GenerateDonorFriendlyReportOutput - The return type for the generateDonorFriendlyReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDonorFriendlyReportInputSchema = z.object({
  fundAllocationData: z
    .string()
    .describe(
      'A string containing fund allocation data, including categories and amounts.'
    ),
});
export type GenerateDonorFriendlyReportInput = z.infer<
  typeof GenerateDonorFriendlyReportInputSchema
>;

const GenerateDonorFriendlyReportOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A donor-friendly summary of fund allocation, highlighting the impact of donations.'
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
  prompt: `You are an expert in creating donor-friendly reports. You will be provided with fund allocation data, and you will generate a concise and easy-to-understand summary that highlights the impact of the donations.

Fund Allocation Data: {{{fundAllocationData}}}

Summary:`,
});

const generateDonorFriendlyReportFlow = ai.defineFlow(
  {
    name: 'generateDonorFriendlyReportFlow',
    inputSchema: GenerateDonorFriendlyReportInputSchema,
    outputSchema: GenerateDonorFriendlyReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
