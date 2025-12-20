// src/ai/flows/link-categorization.ts
'use server';

/**
 * @fileOverview A link categorization AI agent.
 *
 * - categorizeLink - A function that handles the link categorization process.
 * - CategorizeLinkInput - The input type for the categorizeLink function.
 * - CategorizeLinkOutput - The return type for the categorizeLink function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeLinkInputSchema = z.object({
  url: z.string().url().describe('The URL to categorize.'),
});
export type CategorizeLinkInput = z.infer<typeof CategorizeLinkInputSchema>;

const CategorizeLinkOutputSchema = z.object({
  categories: z.array(z.string()).describe('Suggested categories for the link.'),
});
export type CategorizeLinkOutput = z.infer<typeof CategorizeLinkOutputSchema>;

export async function categorizeLink(input: CategorizeLinkInput): Promise<CategorizeLinkOutput> {
  return categorizeLinkFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeLinkPrompt',
  input: {schema: CategorizeLinkInputSchema},
  output: {schema: CategorizeLinkOutputSchema},
  prompt: `You are an expert in classifying URLs into descriptive categories.

  Analyze the content of the following URL and suggest one or more appropriate categories.

  URL: {{{url}}}

  Categories:`,
});

const categorizeLinkFlow = ai.defineFlow(
  {
    name: 'categorizeLinkFlow',
    inputSchema: CategorizeLinkInputSchema,
    outputSchema: CategorizeLinkOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
