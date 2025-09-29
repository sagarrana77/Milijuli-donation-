'use server';
/**
 * @fileOverview A flow to generate a full campaign story from a title.
 *
 * - generateCampaignStory - A function that generates a campaign story.
 * - GenerateCampaignStoryInput - The input type for the generateCampaignStory function.
 * - GenerateCampaignStoryOutput - The return type for the generateCampaignStory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCampaignStoryInputSchema = z.object({
  campaignTitle: z.string().describe('The title of the campaign.'),
});
export type GenerateCampaignStoryInput = z.infer<typeof GenerateCampaignStoryInputSchema>;

const GenerateCampaignStoryOutputSchema = z.object({
  campaignStory: z.string().describe('A detailed, engaging, and emotionally resonant story for the campaign, written in Markdown.'),
});
export type GenerateCampaignStoryOutput = z.infer<typeof GenerateCampaignStoryOutputSchema>;

export async function generateCampaignStory(
  input: GenerateCampaignStoryInput
): Promise<GenerateCampaignStoryOutput> {
  return generateCampaignStoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCampaignStoryPrompt',
  input: {schema: GenerateCampaignStoryInputSchema},
  output: {schema: GenerateCampaignStoryOutputSchema},
  prompt: `You are an expert non-profit storyteller and copywriter. Your task is to write a full, detailed, and emotionally resonant campaign story based on the following title: "{{{campaignTitle}}}".

The story should be at least 3-4 paragraphs long and written in Markdown. It must:
1.  Introduce the problem or need in a relatable way.
2.  Explain the proposed solution and what the campaign aims to achieve.
3.  Describe the impact the donor's contribution will have on the community or cause.
4.  End with a powerful call to action that inspires people to donate.

The tone should be hopeful, empathetic, and urgent. Make the reader feel like they can be a hero by contributing.`,
});

const generateCampaignStoryFlow = ai.defineFlow(
  {
    name: 'generateCampaignStoryFlow',
    inputSchema: GenerateCampaignStoryInputSchema,
    outputSchema: GenerateCampaignStoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
