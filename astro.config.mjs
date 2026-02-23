// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'businessWebsite';

// https://astro.build/config
export default defineConfig({
  site: 'https://apptrackit.github.io',
  base: process.env.GITHUB_ACTIONS ? `/${repositoryName}` : '/',
  integrations: [react()]
});