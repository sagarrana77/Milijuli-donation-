'use server';
/**
 * @fileOverview A flow to generate a full campaign story from a title and an optional draft.
 *
 * - generateCampaignStory - A function that generates a campaign story.
 * - GenerateCampaignStoryInput - The input type for the generateCampaignStory function.
 * - GenerateCampaignStoryOutput - The return type for the generateCampaignStory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCampaignStoryInputSchema = z.object({
  campaignTitle: z.string().describe('The title of the campaign.'),
  storyDraft: z.string().optional().describe('An optional draft of the story to be elaborated upon.'),
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
  prompt: `You are an expert non-profit storyteller and copywriter. Your task is to write a full, detailed, and emotionally resonant campaign story based on the provided campaign title and draft.

Campaign Title: "{{{campaignTitle}}}"

{{#if storyDraft}}
The user has provided the following draft. Your job is to take this draft, elaborate on it, and rewrite it to be more professional, appealing, and emotionally engaging. Make sure to:
1.  Expand on the ideas presented in the draft.
2.  Structure it into a cohesive narrative of at least 3-4 paragraphs.
3.  Ensure it introduces the problem, explains the solution, describes the donor's impact, and has a strong call to action.
4.  The final output should be in Markdown.

User's Draft:
"{{{storyDraft}}}"
{{else}}
The user has not provided a draft. Your job is to write a new campaign story from scratch based on the title. The story should be at least 3-4 paragraphs long and written in Markdown. It must:
1.  Introduce the problem or need in a relatable way.
2.  Explain the proposed solution and what the campaign aims to achieve.
3.  Describe the impact the donor's contribution will have on the community or cause.
4.  End with a powerful call to action that inspires people to donate.
{{/if}}

The tone should be hopeful, empathetic, and urgent. Make the reader feel like they can be a hero by contributing.`,
});

const generateCampaignStoryFlow = ai.defineFlow(
  {
    name: 'generateCampaignStoryFlow',
    inputSchema: GenerateCampaignStoryInputSchema,
    outputSchema: GenerateCampaignStoryOutputSchema,
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
