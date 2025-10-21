// @ts-check
import { defineConfig } from 'astro/config';
import remarkMermaidAstro from './src/plugins/remark-mermaid-astro.js';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';

// https://astro.build/config
export default defineConfig({
  site: 'https://topkoong.github.io',
  integrations: [
    tailwind(),
    sitemap(),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
  ],
  // Performance optimizations
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'framer-motion': ['framer-motion'],
          },
        },
      },
    },
  },
  // Enable prefetch for better performance
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: 'dracula',
        dark: 'dracula',
      },
      defaultColor: 'light',
      wrap: true,
      transformers: [
        {
          name: 'add-language-class',
          code(node) {
            node.properties.class = `language-${node.properties['data-language']}`;
          },
        },
      ],
    },
    remarkPlugins: [remarkMermaidAstro],
    rehypePlugins: [
      () => (tree) => {
        return tree;
      },
    ],
    syntaxHighlight: 'shiki',
  },
});
