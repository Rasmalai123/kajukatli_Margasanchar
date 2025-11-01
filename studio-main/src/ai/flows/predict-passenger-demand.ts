'use server';

/**
 * @fileOverview This file defines a Genkit flow to predict passenger demand for a selected station.
 *
 * - predictPassengerDemand - A function that predicts passenger demand for a given station.
 * - PredictPassengerDemandInput - The input type for the predictPassengerDemand function.
 * - PredictPassengerDemandOutput - The return type for the predictPassengerDemand function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictPassengerDemandInputSchema = z.object({
  station: z.string().describe('The name of the station to predict passenger demand for.'),
});
export type PredictPassengerDemandInput = z.infer<typeof PredictPassengerDemandInputSchema>;

const PredictPassengerDemandOutputSchema = z.object({
  station: z.string().describe('The name of the station.'),
  predicted_passengers_15min: z.number().describe('The predicted number of passengers in 15 minutes.'),
  predicted_passengers_60min: z.number().describe('The predicted number of passengers in 60 minutes.'),
  peak_probability: z.number().describe('The probability of a peak in passenger demand.'),
});
export type PredictPassengerDemandOutput = z.infer<typeof PredictPassengerDemandOutputSchema>;

export async function predictPassengerDemand(input: PredictPassengerDemandInput): Promise<PredictPassengerDemandOutput> {
  return predictPassengerDemandFlow(input);
}

const predictPassengerDemandPrompt = ai.definePrompt({
  name: 'predictPassengerDemandPrompt',
  input: {schema: PredictPassengerDemandInputSchema},
  output: {schema: PredictPassengerDemandOutputSchema},
  prompt: `You are an AI assistant that predicts passenger demand for a given bus station.

  Given the station name, you will predict the number of passengers in the next 15 and 60 minutes, and the probability of a peak in passenger demand.

  Station Name: {{{station}}}
  `,
});

const predictPassengerDemandFlow = ai.defineFlow(
  {
    name: 'predictPassengerDemandFlow',
    inputSchema: PredictPassengerDemandInputSchema,
    outputSchema: PredictPassengerDemandOutputSchema,
  },
  async input => {
    // Dummy data for demo purposes
    const dummyData: PredictPassengerDemandOutput = {
      station: input.station,
      predicted_passengers_15min: Math.floor(Math.random() * 50) + 10, // Random number between 10 and 60
      predicted_passengers_60min: Math.floor(Math.random() * 100) + 30, // Random number between 30 and 130
      peak_probability: Math.random(), // Random number between 0 and 1
    };

    // In a real application, this would call an actual prediction model
    // For this demo, we're just returning dummy data

    return dummyData;
  }
);
