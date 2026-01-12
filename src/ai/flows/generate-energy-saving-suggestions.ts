'use server';

/**
 * @fileOverview An AI agent that generates personalized energy-saving recommendations based on household data and usage patterns.
 *
 * - generateEnergySavingSuggestions - A function that generates energy-saving suggestions.
 * - GenerateEnergySavingSuggestionsInput - The input type for the generateEnergySavingSuggestions function.
 * - GenerateEnergySavingSuggestionsOutput - The return type for the generateEnergySavingSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEnergySavingSuggestionsInputSchema = z.object({
  householdData: z
    .string()
    .describe(
      'A JSON string containing household data, including appliance usage, energy consumption patterns, and user preferences.'
    ),
});

export type GenerateEnergySavingSuggestionsInput = z.infer<
  typeof GenerateEnergySavingSuggestionsInputSchema
>;

const GenerateEnergySavingSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe(
      'A list of personalized energy-saving suggestions tailored to the user provided household data.'
    ),
});

export type GenerateEnergySavingSuggestionsOutput = z.infer<
  typeof GenerateEnergySavingSuggestionsOutputSchema
>;

export async function generateEnergySavingSuggestions(
  input: GenerateEnergySavingSuggestionsInput
): Promise<GenerateEnergySavingSuggestionsOutput> {
  return generateEnergySavingSuggestionsFlow(input);
}

const generateEnergySavingSuggestionsPrompt = ai.definePrompt({
  name: 'generateEnergySavingSuggestionsPrompt',
  input: {schema: GenerateEnergySavingSuggestionsInputSchema},
  output: {schema: GenerateEnergySavingSuggestionsOutputSchema},
  prompt: `You are an AI energy advisor who provides personalized energy-saving recommendations to users based on their household data and usage patterns.

  Analyze the following household data and provide a list of actionable suggestions to reduce energy consumption and save money. Make the suggestions very specific.
  For example, instead of "Use less air conditioning", say "Adjust your AC temperature to 25°C between 2 PM and 6 PM to save 15% on your energy bill".

  Household Data: {{{householdData}}}
  `, // Ensure householdData is accessible within the Handlebars template
});

const generateEnergySavingSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateEnergySavingSuggestionsFlow',
    inputSchema: GenerateEnergySavingSuggestionsInputSchema,
    outputSchema: GenerateEnergySavingSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await generateEnergySavingSuggestionsPrompt(input);
    return output!;
  }
);
