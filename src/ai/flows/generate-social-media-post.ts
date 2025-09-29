'use server';
/**
 * @fileOverview A flow to generate social media posts for campaigns.
 *
 * - generateSocialMediaPost - A function that generates a social media post for a specific project and platform.
 * - GenerateSocialMediaPostInput - The input type for the generateSocialMediaPost function.
 * - GenerateSocialMediaPostOutput - The return type for the generateSocialMediaPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { projects } from '@/lib/data';

// Tool to get project details for the social media post
const getProjectDetailsForSocialPost = ai.defineTool(
  {
    name: 'getProjectDetailsForSocialPost',
    description: 'Returns key details for a given project ID to be used in a social media post.',
    inputSchema: z.object({
      projectId: z.string().describe('The unique ID of the project.'),
    }),
    outputSchema: z.object({
      name: z.string(),
      description: z.string(),
      raisedAmount: z.number(),
      targetAmount: z.number(),
      donors: z.number(),
      projectUrl: z.string(),
    }),
  },
  async ({ projectId }) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    // In a real app, this URL would be dynamically generated based on the domain
    const projectUrl = `https://claritychain.com/projects/${projectId}`;
    return {
      name: project.name,
      description: project.description,
      raisedAmount: project.raisedAmount,
      targetAmount: project.targetAmount,
      donors: project.donors,
      projectUrl: projectUrl,
    };
  }
);


const GenerateSocialMediaPostInputSchema = z.object({
  projectId: z.string().describe('The ID of the project to generate a post for.'),
  platform: z.enum(['Twitter', 'Facebook']).describe('The social media platform to generate the post for.'),
});
export type GenerateSocialMediaPostInput = z.infer<typeof GenerateSocialMediaPostInputSchema>;

const GenerateSocialMediaPostOutputSchema = z.object({
  post: z.string().describe('The generated social media post content.'),
});
export type GenerateSocialMediaPostOutput = z.infer<typeof GenerateSocialMediaPostOutputSchema>;

export async function generateSocialMediaPost(
  input: GenerateSocialMediaPostInput
): Promise<GenerateSocialMediaPostOutput> {
  return generateSocialMediaPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSocialMediaPostPrompt',
  input: {schema: GenerateSocialMediaPostInputSchema},
  output: {schema: GenerateSocialMediaPostOutputSchema},
  tools: [getProjectDetailsForSocialPost],
  prompt: `You are a social media marketing expert for a non-profit fundraising platform called ClarityChain. Your task is to generate a compelling social media post for the project with ID '{{{projectId}}}' to be posted on {{{platform}}}.

Use the getProjectDetailsForSocialPost tool to get the project details.

Based on the fetched data and the target platform, create a post that:
1.  Is engaging, concise, and emotionally resonant.
2.  Clearly states the project's goal.
3.  Includes a call to action, encouraging people to donate or share.
4.  Mentions the project's URL.
5.  Includes relevant and popular hashtags (e.g., #NonProfit, #Charity, #Nepal, #Donate, #Transparency).
6.  Adheres to the platform's conventions (e.g., character limits for Twitter/X). For Facebook, write a slightly longer, more descriptive post. For Twitter, be very concise.

The tone should be hopeful, urgent, and inspiring.`,
});

const generateSocialMediaPostFlow = ai.defineFlow(
  {
    name: 'generateSocialMediaPostFlow',
    inputSchema: GenerateSocialMediaPostInputSchema,
    outputSchema: GenerateSocialMediaPostOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
