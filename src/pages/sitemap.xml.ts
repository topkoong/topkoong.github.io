/**
 * Dynamic Sitemap Generator
 * 
 * This API route generates an XML sitemap for the blog website.
 * It automatically includes all published blog posts and main pages
 * to help search engines discover and index the content.
 * 
 * Features:
 * - Automatically discovers all published blog posts
 * - Generates proper XML sitemap format
 * - Sets appropriate priority and change frequency
 * - Includes last modification dates
 * - Caches response for 1 hour
 * 
 * @fileoverview Sitemap generation for SEO optimization
 */

import type { APIRoute } from 'astro';

/**
 * GET handler for sitemap.xml
 * Generates a complete XML sitemap including all published content
 * 
 * @param {Object} context - Astro API context
 * @param {string} context.site - The configured site URL
 * @returns {Response} XML sitemap response
 */
export const GET: APIRoute = async ({ site }) => {
  // Get all blog posts from the posts directory
  // Uses dynamic imports to discover all markdown files
  const posts = await Promise.all(
    Object.entries(
      // Import all markdown files in the posts directory
      import.meta.glob<{ frontmatter: any }>('../pages/blog/posts/*.md')
    ).map(async ([path, resolver]) => {
      // Resolve each markdown file to get its content and frontmatter
      const post = await resolver();
      return {
        ...post,
        // Extract slug from file path for URL generation
        slug: path.replace('../pages/blog/posts/', '').replace('.md', ''),
      };
    })
  );

  // Filter only published posts
  // Posts with published: false are excluded from the sitemap
  const publishedPosts = posts.filter(
    (post) => post.frontmatter.published !== false
  );

  // Use site URL from config or fallback to localhost for development
  const siteUrl = site || 'http://localhost:4321';

  // Generate XML sitemap following the sitemap protocol
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage - highest priority -->
  <url>
    <loc>${siteUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Blog index page - high priority -->
  <url>
    <loc>${siteUrl}/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- Individual blog posts - medium priority -->
  ${publishedPosts
    .map(
      (post) => `  <url>
    <loc>${siteUrl}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.frontmatter.date).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
    )
    .join('\n')}
</urlset>`;

  // Return XML response with proper headers
  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      // Cache for 1 hour to reduce server load
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
