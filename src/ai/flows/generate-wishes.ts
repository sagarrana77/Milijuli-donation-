'use server';
/**
 * @fileOverview A flow to generate professional, occasion-based wishes for users.
 *
 * - generateWish - A function that generates a wish based on an occasion.
 * - GenerateWishInput - The input type for the generateWish function.
 * - GenerateWishOutput - The return type for the generateWish function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWishInputSchema = z.object({
  occasion: z.string().describe('The occasion for the wish (e.g., New Year, Holiday Season, Anniversary).'),
});
export type GenerateWishInput = z.infer<typeof GenerateWishInputSchema>;

const GenerateWishOutputSchema = z.object({
  wish: z
    .string()
    .describe('A professional and heartfelt wish message suitable for sending to all users.'),
});
export type GenerateWishOutput = z.infer<typeof GenerateWishOutputSchema>;

export async function generateWish(
  input: GenerateWishInput
): Promise<GenerateWishOutput> {
  return generateWishFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWishPrompt',
  input: {schema: GenerateWishInputSchema},
  output: {schema: GenerateWishOutputSchema},
  prompt: `You are a communications expert for a non-profit organization called milijuli donation sewa. Your task is to write a professional and heartfelt wish for all users of the platform for the following occasion: {{{occasion}}}.

The message should:
1.  Be warm, sincere, and inclusive.
2.  Briefly thank the users for their continued support and belief in the mission of transparency.
3.  Be general enough to be sent to all users (donors, project creators, etc.).
4.  Do not include a specific year unless it's part of the occasion (e.g., "Happy New Year 2024").
5.  End with a warm closing from "The milijuli donation sewa Team".
6.  The entire response should be contained within the 'wish' field.`,
});

const generateWishFlow = ai.defineFlow(
  {
    name: 'generateWishFlow',
    inputSchema: GenerateWishInputSchema,
    outputSchema: GenerateWishOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
