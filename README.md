# Toppy's Digital Playground

A modern, responsive personal blog built with Astro, featuring dark/light mode, animated components, and optimized performance. This site serves as a digital notebook for sharing insights on full-stack development, automation, and scaling knowledge.

## 🌟 Features

- **Modern Tech Stack**: Built with Astro 5.x for optimal performance
- **Dark/Light Mode**: Seamless theme switching with localStorage persistence
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Animated Components**: Custom animations and interactive elements
- **SEO Optimized**: Comprehensive meta tags, structured data, and sitemap generation
- **Performance Focused**: Optimized builds, prefetching, and minimal JavaScript
- **Blog System**: Markdown-based blog posts with syntax highlighting
- **Mermaid Diagrams**: Support for technical diagrams in blog posts

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/topkoong/topkoong.github.io.git
cd topkoong.github.io

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The site will be available at `http://localhost:4321`

## 📁 Project Structure

### Directory Overview

```
topkoong.github.io/
├── .github/                    # GitHub Actions workflows
│   └── workflows/
│       ├── deploy.yml         # Deployment workflow
│       └── sync-master.yml    # Branch synchronization
├── public/                    # Static assets (served as-is)
│   ├── favicon.svg           # Site favicon
│   └── robots.txt            # SEO robots file
├── src/                      # Source code
│   ├── components/           # Reusable Astro components
│   │   ├── Navbar.astro      # Navigation with theme toggle
│   │   ├── Footer.astro      # Site footer with contact info
│   │   ├── BlogCard.astro    # Blog post preview cards
│   │   ├── ThemeToggle.astro # Dark/light mode toggle
│   │   └── *Pure.astro       # Animation components
│   ├── layouts/              # Page layouts
│   │   ├── Layout.astro      # Main site layout with SEO
│   │   └── BlogPost.astro    # Blog post layout
│   ├── pages/                # Astro pages (file-based routing)
│   │   ├── index.astro       # Homepage
│   │   ├── blog/             # Blog pages and posts
│   │   ├── sitemap.xml.ts    # Dynamic sitemap generation
│   │   └── social-preview.astro # Social media preview
│   ├── plugins/              # Custom Astro plugins
│   │   └── remark-mermaid-astro.js # Mermaid diagram support
│   └── assets/               # Static assets processed by Astro
├── astro.config.mjs          # Astro configuration
├── tailwind.config.mjs       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies and scripts
├── sync-master.sh           # Branch synchronization script
└── README.md                # Project documentation
```

### Key Directories Explained

#### `src/components/`

- **Purpose**: Reusable Astro components
- **Convention**: PascalCase naming (e.g., `BlogCard.astro`)
- **Documentation**: All components have comprehensive JSDoc comments
- **Types**: TypeScript interfaces for props and data structures

#### `src/layouts/`

- **Layout.astro**: Main site layout with SEO, theme management, and global styles
- **BlogPost.astro**: Specialized layout for blog posts with enhanced typography

#### `src/pages/`

- **File-based routing**: Each `.astro` file becomes a route
- **Blog posts**: Markdown files in `blog/posts/` directory
- **Dynamic routes**: `[slug].astro` for dynamic blog post pages

#### `src/plugins/`

- **Custom plugins**: Extend Astro's markdown processing
- **Mermaid support**: Enables diagram rendering in blog posts

#### `.github/workflows/`

- **Automated deployment**: Builds and deploys on push to main
- **Branch sync**: Keeps master synchronized with main

## 🛠️ Development

### Development Workflow

1. **Setup Environment**:

   ```bash
   # Clone and install dependencies
   git clone https://github.com/topkoong/topkoong.github.io.git
   cd topkoong.github.io
   pnpm install
   ```

2. **Start Development**:

   ```bash
   # Start local development server
   pnpm dev
   # Site available at http://localhost:4321
   ```

3. **Make Changes**:

   - Edit components in `src/components/`
   - Add blog posts in `src/pages/blog/posts/`
   - Update layouts in `src/layouts/`

4. **Test and Build**:

   ```bash
   # Preview production build
   pnpm preview

   # Build for production
   pnpm build
   ```

### Available Scripts

| Command        | Action                                   |
| :------------- | :--------------------------------------- |
| `pnpm dev`     | Start development server with hot reload |
| `pnpm build`   | Build production site to `./dist/`       |
| `pnpm preview` | Preview production build locally         |
| `pnpm astro`   | Run Astro CLI commands                   |

### Development Guidelines

- **Code Style**: Follow TypeScript strict mode
- **Components**: Use Astro components with proper JSDoc comments
- **Styling**: Prefer Tailwind CSS classes over custom CSS
- **Dark Mode**: Always consider dark/light mode compatibility
- **Performance**: Optimize images and minimize JavaScript usage

### Key Technologies

- **Astro 5.x**: Modern static site generator
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type-safe development
- **Shiki**: Syntax highlighting for code blocks
- **Mermaid**: Diagram generation in markdown
- **Partytown**: Third-party script optimization

## 📝 Blog System

### Creating Blog Posts

1. Create a new `.md` file in `src/pages/blog/posts/`
2. Add frontmatter with required fields:

```yaml
---
title: 'Your Post Title'
date: '2024-01-01'
description: 'Brief description of your post'
published: true # Optional, defaults to true
---
```

### Supported Features

- **Mermaid Diagrams**: Use `\`\`\`mermaid` code blocks
- **Syntax Highlighting**: Automatic highlighting for all languages
- **Responsive Images**: Automatic optimization
- **SEO**: Automatic meta tags and structured data

## 🎨 Theming

The site supports both dark and light modes with:

- **Automatic Detection**: Respects system preferences
- **Manual Toggle**: Theme toggle button in navigation
- **Persistence**: Theme choice saved in localStorage
- **No Flash**: Theme applied before page render

## 🚀 Deployment

### Automated Deployment (GitHub Pages)

The site uses GitHub Actions for automatic deployment:

1. **Trigger**: Push changes to the `main` branch
2. **Build Process**:
   - Install dependencies with pnpm
   - Build static site with Astro
   - Deploy to GitHub Pages
3. **Result**: Site updates at `https://topkoong.github.io`

### Deployment Workflow

```yaml
# .github/workflows/deploy.yml (simplified)
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: pnpm install
      - run: pnpm build
      - uses: peaceiris/actions-gh-pages@v3
```

### Manual Deployment

For other hosting providers:

```bash
# Build the site
pnpm build

# The dist/ folder contains the static site
# Deploy dist/ contents to your hosting provider

# Examples:
# - Netlify: Drag and drop dist/ folder
# - Vercel: Connect GitHub repo
# - AWS S3: Upload dist/ contents
# - Custom server: Copy dist/ to web root
```

### Deployment Checklist

- [ ] Site builds without errors (`pnpm build`)
- [ ] All pages load correctly
- [ ] Images and assets load properly
- [ ] Dark/light mode toggle works
- [ ] Blog posts render correctly
- [ ] SEO meta tags are present
- [ ] Sitemap is generated
- [ ] Performance metrics are acceptable

## 🔧 Configuration

### Astro Configuration (`astro.config.mjs`)

- **Site URL**: Configured for GitHub Pages
- **Integrations**: Tailwind, Sitemap, Partytown
- **Build Optimizations**: Inline stylesheets, manual chunks
- **Markdown**: Shiki syntax highlighting, Mermaid support

### Tailwind Configuration (`tailwind.config.mjs`)

- **Dark Mode**: Class-based strategy
- **Content**: Scans all file types for classes
- **Plugins**: Typography plugin for prose styling

## 📊 Performance

The site is optimized for performance with:

- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Static Generation**: Pre-built pages for fast loading
- **Code Splitting**: Automatic chunking of JavaScript
- **Image Optimization**: WebP format with responsive sizing
- **Font Optimization**: Preconnect and font-display: swap
- **Prefetching**: Automatic link prefetching for navigation
- **GPU Acceleration**: Hardware-accelerated animations
- **Minimal JavaScript**: Only loads JS when needed

### Performance Features

- **Partytown Integration**: Third-party scripts moved to web workers
- **Critical CSS**: Inline critical styles for faster rendering
- **Resource Hints**: DNS prefetch and preconnect for external resources
- **Caching Strategy**: Optimized cache headers for static assets
- **Bundle Optimization**: Separate chunks for better caching
- **Animation Performance**: GPU-accelerated CSS animations

## ♿ Accessibility & Semantic HTML5

### Semantic Structure

The site uses semantic HTML5 elements for better accessibility and SEO:

- **Navigation**: `<nav>` elements with proper ARIA labels
- **Content Structure**: `<main>`, `<section>`, `<article>` elements
- **Headers & Footers**: `<header>` and `<footer>` elements
- **Time Elements**: `<time>` with datetime attributes
- **Contact Info**: `<address>` elements for contact information
- **ARIA Labels**: Descriptive labels for screen readers

### Accessibility Features

- **Screen Reader Support**: Proper semantic structure and ARIA labels
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG AA compliant color schemes
- **Focus Management**: Visible focus indicators
- **Alternative Text**: Proper alt text for images
- **Heading Hierarchy**: Logical H1 → H2 → H3 structure

### Implementation

All components follow semantic HTML5 best practices:

```astro
<!-- Semantic navigation -->
<nav>
  <section aria-label='Main navigation'>
    <!-- Navigation links -->
  </section>
</nav>

<!-- Semantic article structure -->
<article>
  <header>
    <h1>Article Title</h1>
    <section aria-label='Article metadata'>
      <time datetime='2024-01-01'>January 1, 2024</time>
      <address>Theeruttop (Toppy)</address>
    </section>
  </header>
  <section>
    <!-- Article content -->
  </section>
</article>
```

## 🔍 SEO Optimization

### Built-in SEO Features

The site includes comprehensive SEO optimization:

- **Meta Tags**: Automatic generation of title, description, and keywords
- **Open Graph**: Facebook and social media sharing optimization
- **Twitter Cards**: Enhanced Twitter sharing with large images
- **Structured Data**: JSON-LD schema for search engines
- **Sitemap**: Automatic XML sitemap generation
- **Robots.txt**: Proper crawling instructions
- **Canonical URLs**: Prevents duplicate content issues

### SEO Implementation

#### Automatic SEO (Layout.astro)

```astro
<!-- SEO meta tags are automatically generated -->
<Layout
  title="Page Title"
  description="Page description"
  image="/path/to/image.jpg"
  url="https://topkoong.github.io/page"
  type="article" // or "website"
  publishedTime="2024-01-01T00:00:00Z"
  author="Theeruttop (Toppy)"
  keywords="keyword1, keyword2, keyword3"
>
```

#### Blog Post SEO

Blog posts automatically get SEO optimization:

```yaml
---
title: 'Your Post Title' # Used for <title> tag
date: '2024-01-01' # Used for publication date
description: 'Brief description' # Used for meta description
tags: ['tag1', 'tag2'] # Used for keywords
---
```

#### Manual SEO Configuration

For custom pages, add SEO props to Layout:

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout
  title="Custom Page Title"
  description="Custom page description for SEO"
  image="/custom-image.jpg"
  keywords="custom, keywords, for, this, page"
>
  <!-- Page content -->
</Layout>
```

### SEO Checklist

- [ ] Unique title tags for each page
- [ ] Meta descriptions under 160 characters
- [ ] Proper heading hierarchy (H1 → H2 → H3)
- [ ] Alt text for all images
- [ ] Internal linking between related content
- [ ] Fast loading times (Core Web Vitals)
- [ ] Mobile-responsive design
- [ ] HTTPS enabled
- [ ] XML sitemap generated
- [ ] Robots.txt configured

### SEO Tools Integration

- **Google Search Console**: Monitor search performance
- **Google Analytics**: Track user behavior and traffic
- **Core Web Vitals**: Monitor loading performance
- **Schema Markup**: Rich snippets in search results

## 📚 Documentation

### Available Documentation

- **README.md**: This file - project overview and quick start
- **ARCHITECTURE.md**: Detailed technical architecture and build process
- **CONTRIBUTING.md**: Development guidelines and code standards
- **BLOG_GUIDE.md**: Blog post structure and content guidelines
- **SEO_GUIDE.md**: Comprehensive SEO implementation and optimization guide
- **PERFORMANCE_GUIDE.md**: Performance optimization and Core Web Vitals guide
- **SEMANTIC_HTML5_GUIDE.md**: Semantic HTML5 implementation and accessibility guide

### Code Documentation

- **JSDoc Comments**: All components have comprehensive documentation
- **TypeScript Interfaces**: Proper type definitions for all props
- **Inline Comments**: Complex logic explained with comments
- **Component Structure**: Consistent patterns across all components

### Documentation Standards

- **Code Comments**: Explain the "why" not just the "what"
- **API Documentation**: All public interfaces documented
- **Examples**: Code examples for complex functionality
- **Maintenance**: Documentation updated with code changes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Contact

- **Email**: theeruttop@gmail.com
- **GitHub**: [@topkoong](https://github.com/topkoong)
- **Twitter/X**: [@toptheerut](https://x.com/toptheerut)

---

Built with ❤️ using Astro
