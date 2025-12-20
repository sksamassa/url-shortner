'use server';

import { categorizeLink } from '@/ai/flows/link-categorization';

export async function getLinkCategories(url: string) {
  try {
    const { categories } = await categorizeLink({ url });
    return { success: true, data: categories };
  } catch (error) {
    console.error('Error categorizing link:', error);
    return { success: false, error: 'Failed to categorize link.' };
  }
}
