/**
 * Astro Configuration File
 * 
 * This file configures the Astro build system with integrations, performance optimizations,
 * and markdown processing settings for the personal blog website.
 * 
 * Key Features:
 * - Tailwind CSS for styling
 * - Sitemap generation for SEO
 * - Partytown for third-party script optimization
 * - Shiki syntax highlighting with Dracula theme
 * - Custom Mermaid diagram support
 * - Performance optimizations for production builds
 */

// @ts-check
import { defineConfig } from 'astro/config';
import partytown from '@astrojs/partytown';
import remarkMermaidAstro from './src/plugins/remark-mermaid-astro.js';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  // Production site URL for GitHub Pages deployment
  site: 'https://topkoong.github.io',
  
  // Astro integrations for enhanced functionality
  integrations: [
    // Tailwind CSS integration for utility-first styling
    tailwind(),
    
    // Automatic sitemap generation for SEO
    sitemap(),
    
    // Partytown for offloading third-party scripts to web workers
    // Improves main thread performance by moving analytics scripts
    partytown({
      config: {
        // Forward Google Analytics dataLayer.push calls
        forward: ['dataLayer.push'],
      },
    }),
  ],
  
  // Build optimizations for production
  build: {
    // Automatically inline small CSS files to reduce HTTP requests
    inlineStylesheets: 'auto',
  },
  
  // Vite configuration for advanced build optimizations
  vite: {
    build: {
      rollupOptions: {
        output: {
          // Create separate chunks for large libraries to improve caching
          manualChunks: {
            // Separate chunk for Framer Motion (if used in future)
            'framer-motion': ['framer-motion'],
          },
        },
      },
    },
  },
  
  // Prefetch configuration for improved navigation performance
  prefetch: {
    // Prefetch all links on the page for instant navigation
    prefetchAll: true,
    // Only prefetch links that are currently in the viewport
    defaultStrategy: 'viewport',
  },
  
  // Markdown processing configuration
  markdown: {
    // Shiki syntax highlighting configuration
    shikiConfig: {
      // Use Dracula theme for both light and dark modes
      // Provides consistent, professional code highlighting
      themes: {
        light: 'dracula',
        dark: 'dracula',
      },
      // Default to light mode (overridden by dark mode class)
      defaultColor: 'light',
      // Wrap long lines in code blocks
      wrap: true,
      // Custom transformers for enhanced code block functionality
      transformers: [
        {
          name: 'add-language-class',
          // Add language-specific CSS classes for custom styling
          code(node) {
            node.properties.class = `language-${node.properties['data-language']}`;
          },
        },
      ],
    },
    
    // Remark plugins for markdown processing
    remarkPlugins: [
      // Custom plugin for Mermaid diagram support
      remarkMermaidAstro,
    ],
    
    // Rehype plugins for HTML processing
    rehypePlugins: [
      // Placeholder for future HTML transformations
      () => (tree) => {
        return tree;
      },
    ],
    
    // Use Shiki for syntax highlighting (better than Prism)
    syntaxHighlight: 'shiki',
  },
});
