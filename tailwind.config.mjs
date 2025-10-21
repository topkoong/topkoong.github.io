/**
 * Tailwind CSS Configuration File
 * 
 * This file configures Tailwind CSS for the Astro blog project.
 * It sets up the content paths, dark mode strategy, and plugins
 * for optimal styling and theming support.
 * 
 * Key Features:
 * - Class-based dark mode for theme switching
 * - Typography plugin for prose styling
 * - Comprehensive content scanning for all file types
 */

/** @type {import('tailwindcss').Config} */
export default {
  // Define which files Tailwind should scan for class names
  // Covers all possible file types in the src directory
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  
  // Enable class-based dark mode strategy
  // This allows us to toggle dark mode by adding/removing 'dark' class
  // Important: This must match the theme toggle implementation
  darkMode: 'class',
  
  // Extend the default Tailwind theme
  theme: {
    extend: {
      // Future custom theme extensions can be added here
      // Examples: custom colors, fonts, spacing, animations, etc.
    },
  },
  
  // Tailwind CSS plugins for enhanced functionality
  plugins: [
    // Typography plugin provides beautiful default styles for prose content
    // Essential for blog post styling and markdown content formatting
    require('@tailwindcss/typography'),
  ],
};
