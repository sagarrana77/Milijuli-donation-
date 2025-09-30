
'use server';

/**
 * @fileOverview A flow to generate a personalized thank-you email for a donation.
 *
 * - sendThankYouEmail - A function that generates and "sends" a thank-you email.
 * - SendThankYouEmailInput - The input type for the sendThankYouEmail function.
 * - SendThankYouEmailOutput - The return type for the sendThankYouEmail function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SendThankYouEmailInputSchema = z.object({
  donorName: z.string().describe('The name of the person who made the donation.'),
  amount: z.number().describe('The amount of money that was donated.'),
  projectName: z.string().describe('The name of the project the donation was for.'),
  donorEmail: z.string().email().describe('The email address of the donor.'),
});
export type SendThankYouEmailInput = z.infer<
  typeof SendThankYouEmailInputSchema
>;

const SendThankYouEmailOutputSchema = z.object({
  subject: z.string().describe('The subject line of the thank-you email.'),
  body: z.string().describe('The body content of the thank-you email.'),
});
export type SendThankYouEmailOutput = z.infer<
  typeof SendThankYouEmailOutputSchema
>;

export async function sendThankYouEmail(
  input: SendThankYouEmailInput
): Promise<SendThankYouEmailOutput> {
  return sendThankYouEmailFlow(input);
}

const prompt = ai.definePrompt({
  name: 'sendThankYouEmailPrompt',
  input: {schema: SendThankYouEmailInputSchema},
  output: {schema: SendThankYouEmailOutputSchema},
  prompt: `You are an expert in donor communications for a non-profit organization called milijuli donation sewa. Your task is to write a warm, professional, and heartfelt thank-you email to a donor.

The email should:
1.  Have a clear and appreciative subject line.
2.  Personally thank the donor by their name.
3.  Acknowledge the specific amount they donated and the project they supported. The currency is Nepalese Rupees (NPR).
4.  Briefly reiterate the importance of their contribution to the project's success.
5.  Maintain a friendly and sincere tone.

Do not include any placeholders like "[Your Name]" or "[Your Title]". The email should be ready to send as is.

Donor Name: {{{donorName}}}
Donation Amount: NPR {{{amount}}}
Project Name: {{{projectName}}}
`,
});

const sendThankYouEmailFlow = ai.defineFlow(
  {
    name: 'sendThankYouEmailFlow',
    inputSchema: SendThankYouEmailInputSchema,
    outputSchema: SendThankYouEmailOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    const emailContent = output!;

    // In a real application, you would use an email service like SendGrid or Resend here.
    // For this prototype, we'll just log the email to the console to simulate sending.
    console.log('--- Sending Thank You Email ---');
    console.log(`To: ${input.donorEmail}`);
    console.log(`Subject: ${emailContent.subject}`);
    console.log(`Body:\n${emailContent.body}`);
    console.log('-----------------------------');

    return emailContent;
  }
);
