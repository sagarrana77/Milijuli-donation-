'use server';
/**
 * @fileOverview A flow to generate SEO suggestions for projects.
 *
 * - generateSeoSuggestions - A function that generates SEO keywords and a meta description.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { 
    GenerateSeoSuggestionsInputSchema, 
    GenerateSeoSuggestionsOutputSchema, 
    type GenerateSeoSuggestionsInput, 
    type GenerateSeoSuggestionsOutput 
} from '@/ai/schemas/seo-suggestions';


export async function generateSeoSuggestions(
  input: GenerateSeoSuggestionsInput
): Promise<GenerateSeoSuggestionsOutput> {
  return generateSeoSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSeoSuggestionsPrompt',
  input: {schema: GenerateSeoSuggestionsInputSchema},
  output: {schema: GenerateSeoSuggestionsOutputSchema},
  prompt: `You are an SEO expert specializing in content optimization for non-profit and fundraising websites.
Your task is to generate SEO suggestions for the following project:

Project Name: "{{{name}}}"
Project Description: "{{{longDescription}}}"

Based on the provided content, please provide the following:
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
