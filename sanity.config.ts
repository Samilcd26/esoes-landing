import {defineConfig, SchemaTypeDefinition} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './lib/sanity/schemas'

export default defineConfig({
  name: 'default',
  title: 'esoes',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes as SchemaTypeDefinition[],
  },

  // Studio URL'i
  basePath: '/studio',

  // CORS ve API ayarları
  cors: {
    credentials: 'include',
  },

  // API ayarları
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  },
})
