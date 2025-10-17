import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ site }) => {
  // Get all blog posts
  const posts = await Promise.all(
    Object.entries(
      import.meta.glob<{ frontmatter: any }>('../pages/blog/posts/*.md')
    ).map(async ([path, resolver]) => {
      const post = await resolver();
      return {
        ...post,
        slug: path.replace('../pages/blog/posts/', '').replace('.md', ''),
      };
    })
  );

  // Filter only published posts
  const publishedPosts = posts.filter(
    (post) => post.frontmatter.published !== false
  );

  // Use site URL or fallback to localhost for development
  const siteUrl = site || 'http://localhost:4321';

  // Generate sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
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

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
