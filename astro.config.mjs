// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'businessWebsite';
const configuredBase = process.env.ASTRO_BASE_PATH;
const basePath = configuredBase ?? (process.env.GITHUB_ACTIONS ? `/${repositoryName}` : '/');

// https://astro.build/config
export default defineConfig({
  site: 'https://tarckit.com',
  base: basePath,
  integrations: [react()]
});