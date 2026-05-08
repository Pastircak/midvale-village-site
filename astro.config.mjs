import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://midvaleohio.org',
  integrations: [sitemap()],

  build: {
    inlineStylesheets: 'auto',
  },

  vite: {
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: true,
    },
  },

  compressHTML: true,
  adapter: cloudflare(),
});