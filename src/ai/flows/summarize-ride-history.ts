'use server';
/**
 * @fileOverview Summarizes a patient's ride history to identify patterns and potential cost savings.
 *
 * - summarizeRideHistory - A function that summarizes ride history.
 * - SummarizeRideHistoryInput - The input type for the summarizeRideHistory function.
 * - SummarizeRideHistoryOutput - The return type for the summarizeRideHistory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeRideHistoryInputSchema = z.object({
  rideHistory: z.string().describe('The ride history of the patient.'),
});
export type SummarizeRideHistoryInput = z.infer<typeof SummarizeRideHistoryInputSchema>;

const SummarizeRideHistoryOutputSchema = z.object({
  summary: z.string().describe('A summary of the patient ride history.'),
  commonDestinations: z.string().describe('The most common destinations in the ride history.'),
  potentialSavings: z.string().describe('Potential cost savings opportunities.'),
});
export type SummarizeRideHistoryOutput = z.infer<typeof SummarizeRideHistoryOutputSchema>;

export async function summarizeRideHistory(input: SummarizeRideHistoryInput): Promise<SummarizeRideHistoryOutput> {
  return summarizeRideHistoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeRideHistoryPrompt',
  input: {schema: SummarizeRideHistoryInputSchema},
  output: {schema: SummarizeRideHistoryOutputSchema},
  prompt: `You are a helpful assistant that summarizes a patient's ride history to identify patterns, common destinations, and potential cost savings.

  Summarize the ride history provided below. Identify common destinations and suggest potential cost savings.

  Ride History:
  {{rideHistory}}`,
});

const summarizeRideHistoryFlow = ai.defineFlow(
  {
    name: 'summarizeRideHistoryFlow',
    inputSchema: SummarizeRideHistoryInputSchema,
    outputSchema: SummarizeRideHistoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
