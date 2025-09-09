import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import type { Mutation, SanityDocument, FilteredResponseQueryOptions } from '@sanity/client';

export const config = {
  dataset:  'production',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  apiVersion: '2024-01-01', // Use today's date or the version you're using
  useCdn: process.env.NODE_ENV === 'production',
};

// Sanity client
export const sanityClient = createClient(config);

// Image builder
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Sanity query helper
export async function sanityQuery<T>(
  query: string,
  params?: Record<string, unknown>,
  fetchOptions?: FilteredResponseQueryOptions
): Promise<T> {
  if (fetchOptions) {
    return await sanityClient.fetch(query, params, fetchOptions);
  }
  return await sanityClient.fetch(query, params);
}

// Sanity mutation helper
export async function sanityMutation(mutations: Mutation[]): Promise<SanityDocument> {
  return await sanityClient.mutate(mutations);
}
