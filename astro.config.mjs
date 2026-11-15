import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://nekoyashiki.life',
  trailingSlash: 'always',
  build: { inlineStylesheets: 'always' },
});
