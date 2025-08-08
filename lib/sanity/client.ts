import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import { SanityDocument } from '@sanity/client';

export const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  apiVersion: '2024-01-01', // Use today's date or the version you're using
  useCdn: process.env.NODE_ENV === 'production',
};

// Sanity client
export const sanityClient = createClient(config);

// Image builder
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: string) {
  return builder.image(source);
}

// Sanity query helper
export async function sanityQuery<T>(query: string, params?: Record<string, unknown>): Promise<T> {
  return await sanityClient.fetch(query, params);
}

// Sanity mutation helper
export async function sanityMutation<T>(mutations: SanityDocument<Record<string, unknown>>  []): Promise<T> {
  return await sanityClient.mutate(mutations);
}
