'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting the best bus based on origin and destination.
 *
 * - suggestBestBus - A function that suggests the best bus based on origin and destination.
 * - TripPlannerInput - The input type for the suggestBestBus function.
 * - TripPlannerOutput - The return type for the suggestBestBus function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TripPlannerInputSchema = z.object({
  origin: z.string().describe('The origin location.'),
  destination: z.string().describe('The destination location.'),
});
export type TripPlannerInput = z.infer<typeof TripPlannerInputSchema>;

const TripPlannerOutputSchema = z.object({
  bestBus: z.string().describe('The number of the suggested best bus.'),
  eta: z.string().describe('The estimated time of arrival for the best bus.'),
});
export type TripPlannerOutput = z.infer<typeof TripPlannerOutputSchema>;

export async function suggestBestBus(input: TripPlannerInput): Promise<TripPlannerOutput> {
  return tripPlannerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'tripPlannerPrompt',
  input: {schema: TripPlannerInputSchema},
  output: {schema: TripPlannerOutputSchema},
  prompt: `You are a helpful assistant that suggests the best bus for a user based on their origin and destination.

Consider factors like ETA, crowd level, and historical patterns to determine the best bus.

Origin: {{{origin}}}
Destination: {{{destination}}}

Suggest the best bus and its ETA.`,
});

const tripPlannerFlow = ai.defineFlow(
  {
    name: 'tripPlannerFlow',
    inputSchema: TripPlannerInputSchema,
    outputSchema: TripPlannerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
