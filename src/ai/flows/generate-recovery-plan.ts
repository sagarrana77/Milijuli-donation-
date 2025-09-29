'use server';
/**
 * @fileOverview A flow to generate a financial recovery plan for a negative fund balance.
 *
 * - generateRecoveryPlan - A function that generates a recovery plan.
 * - GenerateRecoveryPlanInput - The input type for the generateRecoveryPlan function.
 * - GenerateRecoveryPlanOutput - The return type for the generateRecoveryPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRecoveryPlanInputSchema = z.object({
  negativeAmount: z.number().describe('The current negative fund balance in NPR.'),
});
export type GenerateRecoveryPlanInput = z.infer<typeof GenerateRecoveryPlanInputSchema>;

const GenerateRecoveryPlanOutputSchema = z.object({
  plan: z.string().describe('A detailed, actionable, and encouraging financial recovery plan in Markdown format.'),
});
export type GenerateRecoveryPlanOutput = z.infer<typeof GenerateRecoveryPlanOutputSchema>;

export async function generateRecoveryPlan(
  input: GenerateRecoveryPlanInput
): Promise<GenerateRecoveryPlanOutput> {
  return generateRecoveryPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecoveryPlanPrompt',
  input: {schema: GenerateRecoveryPlanInputSchema},
  output: {schema: GenerateRecoveryPlanOutputSchema},
  prompt: `You are an expert financial advisor for non-profit organizations. The user is an admin of a fundraising platform called "milijuli sewa" and is facing a negative fund balance.

Current Deficit: Rs. {{{negativeAmount}}}

Your task is to generate a strategic, actionable, and encouraging recovery plan. The plan should be written in Markdown and include the following sections:
1.  **Immediate Actions**: Suggest 2-3 steps that can be taken right away to mitigate the situation. This could involve reviewing recent expenses, pausing non-essential spending, or internal fund transfers.
2.  **Short-Term Strategy (1-4 Weeks)**: Provide ideas for quick fundraising pushes. Examples include launching a targeted "Operational Costs" campaign, running a social media donation drive, or sending a special appeal to past major donors.
3.  **Long-Term Strategy (1-3 Months)**: Suggest sustainable strategies for increasing revenue and controlling costs. This could involve creating a subscription/membership model, planning a larger fundraising event, or optimizing operational costs.
4.  **Communication Plan**: Briefly advise on how to communicate this situation transparently to the community, if necessary, focusing on the steps being taken to resolve it.

The tone should be professional, calm, and empowering. Avoid alarmist language. The goal is to provide a clear, step-by-step roadmap to get back to a positive balance.
`,
});

const generateRecoveryPlanFlow = ai.defineFlow(
  {
    name: 'generateRecoveryPlanFlow',
    inputSchema: GenerateRecoveryPlanInputSchema,
    outputSchema: GenerateRecoveryPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
