# Architecture Documentation

This document provides a comprehensive overview of the project architecture, build process, and deployment strategy for Toppy's Digital Playground.

## 🏗️ Project Architecture

### Technology Stack

- **Framework**: Astro 5.x - Modern static site generator
- **Styling**: Tailwind CSS 3.x - Utility-first CSS framework
- **Language**: TypeScript - Type-safe development
- **Package Manager**: pnpm - Fast, disk space efficient package manager
- **Deployment**: GitHub Pages - Static site hosting

### Core Dependencies

```json
{
  "astro": "^5.1.1",                    // Core framework
  "@astrojs/tailwind": "^5.1.4",       // Tailwind integration
  "@astrojs/sitemap": "^3.6.0",        // SEO sitemap generation
  "@astrojs/partytown": "^2.1.4",      // Third-party script optimization
  "tailwindcss": "^3.4.17",            // CSS framework
  "@tailwindcss/typography": "^0.5.15", // Prose styling
  "mermaid": "^11.7.0",                // Diagram generation
  "framer-motion": "^12.23.24"        // Animation library (future use)
}
```

## 📁 Project Structure

```
topkoong.github.io/
├── public/                    # Static assets (served as-is)
│   ├── favicon.svg           # Site favicon
│   └── robots.txt            # SEO robots file
├── src/
│   ├── components/           # Reusable Astro components
│   │   ├── Navbar.astro     # Navigation with theme toggle
│   │   ├── Footer.astro     # Site footer with contact info
│   │   ├── BlogCard.astro   # Blog post preview cards
│   │   ├── ThemeToggle.astro # Dark/light mode toggle
│   │   └── *Pure.astro      # Animation components
│   ├── layouts/             # Page layouts
│   │   ├── Layout.astro     # Main site layout with SEO
│   │   └── BlogPost.astro   # Blog post layout
│   ├── pages/               # Astro pages (file-based routing)
│   │   ├── index.astro      # Homepage
│   │   ├── blog/            # Blog pages and posts
│   │   ├── sitemap.xml.ts   # Dynamic sitemap generation
│   │   └── social-preview.astro # Social media preview
│   ├── plugins/             # Custom Astro plugins
│   │   └── remark-mermaid-astro.js # Mermaid diagram support
│   └── assets/              # Static assets processed by Astro
├── astro.config.mjs         # Astro configuration
├── tailwind.config.mjs      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

## 🔧 Configuration Files

### Astro Configuration (`astro.config.mjs`)

The Astro configuration handles:

- **Site URL**: Configured for GitHub Pages deployment
- **Integrations**: Tailwind, Sitemap, Partytown
- **Build Optimizations**: 
  - Inline stylesheets for small CSS files
  - Manual chunks for better caching
  - Prefetch configuration for navigation
- **Markdown Processing**:
  - Shiki syntax highlighting with Dracula theme
  - Custom Mermaid diagram support
  - Remark plugins for enhanced functionality

### Tailwind Configuration (`tailwind.config.mjs`)

- **Dark Mode**: Class-based strategy for theme switching
- **Content Scanning**: All file types in `src/` directory
- **Plugins**: Typography plugin for prose styling
- **Extensibility**: Ready for custom theme extensions

### TypeScript Configuration (`tsconfig.json`)

- **Strict Mode**: Enabled for type safety
- **Astro Integration**: Proper module resolution
- **Modern Target**: ES2020 for optimal performance

## 🎨 Component Architecture

### Layout System

1. **Layout.astro**: Main site layout with:
   - SEO meta tags and structured data
   - Theme initialization script
   - Navigation and footer inclusion
   - Global styles and transitions

2. **BlogPost.astro**: Blog post layout with:
   - Enhanced typography styling
   - Code block syntax highlighting
   - Mermaid diagram support
   - Reading time calculation

### Component Categories

#### Core Components
- **Navbar**: Navigation with theme toggle
- **Footer**: Site footer with contact information
- **BlogCard**: Blog post preview cards

#### Animation Components
- **GradualSpacingPure**: Letter-by-letter animation
- **TypingEffectPure**: Typewriter effect
- **StaggeredFadePure**: Word-by-word fade-in
- **RotateWordsPure**: 3D word rotation

#### Theme System
- **ThemeToggle**: Dark/light mode switching
- **Theme Persistence**: localStorage-based theme storage
- **No Flash**: Theme applied before page render

## 📝 Content Management

### Blog System

Blog posts are managed through:

1. **File-based Routing**: Posts in `src/pages/blog/posts/`
2. **Frontmatter**: YAML metadata for each post
3. **Markdown Processing**: Enhanced with plugins
4. **Automatic Generation**: Blog index and individual pages

### Frontmatter Schema

```yaml
---
title: "Post Title"           # Required
date: "2024-01-01"           # Required (ISO format)
description: "Brief description" # Required
published: true               # Optional (defaults to true)
---
```

### Supported Features

- **Mermaid Diagrams**: Use `\`\`\`mermaid` code blocks
- **Syntax Highlighting**: Automatic for all languages
- **Responsive Images**: Automatic optimization
- **SEO**: Automatic meta tags and structured data

## 🚀 Build Process

### Development Workflow

1. **Development Server**: `pnpm dev`
   - Hot reload for instant updates
   - Local server at `localhost:4321`
   - Source maps for debugging

2. **Build Process**: `pnpm build`
   - Static site generation
   - Asset optimization
   - Code splitting and chunking
   - Sitemap generation

3. **Preview**: `pnpm preview`
   - Local preview of production build
   - Performance testing

### Build Optimizations

- **Static Generation**: Pre-built pages for fast loading
- **Code Splitting**: Automatic JavaScript chunking
- **Asset Optimization**: Image compression and format optimization
- **CSS Optimization**: Tailwind purging and minification
- **Prefetching**: Automatic link prefetching for navigation

## 🌐 Deployment Strategy

### GitHub Pages Deployment

The site is automatically deployed using GitHub Actions:

1. **Trigger**: Push to `main` branch
2. **Build Process**: 
   - Install dependencies with pnpm
   - Build static site
   - Deploy to GitHub Pages
3. **URL**: `https://topkoong.github.io`

### Deployment Configuration

- **Base Path**: Configured for GitHub Pages
- **Asset URLs**: Automatic relative path resolution
- **Sitemap**: Generated and deployed automatically
- **Robots.txt**: SEO-friendly configuration

## 🎯 Performance Strategy

### Core Web Vitals Optimization

- **LCP (Largest Contentful Paint)**: Optimized images and fonts
- **FID (First Input Delay)**: Minimal JavaScript, Partytown integration
- **CLS (Cumulative Layout Shift)**: Proper image dimensions, font loading

### Performance Features

- **Static Generation**: Pre-built pages for instant loading
- **Code Splitting**: Automatic chunking for optimal caching
- **Image Optimization**: Responsive images with proper formats
- **Font Optimization**: Preconnect and display: swap
- **Prefetching**: Automatic link prefetching for navigation

## 🔒 Security Considerations

### Content Security Policy

- **Script Sources**: Restricted to trusted domains
- **Style Sources**: Self and trusted CDNs
- **Image Sources**: Self and trusted image hosts

### Security Headers

- **X-Frame-Options**: Prevent clickjacking
- **X-Content-Type-Options**: Prevent MIME sniffing
- **Referrer-Policy**: Control referrer information

## 📊 SEO Strategy

### Technical SEO

- **Structured Data**: JSON-LD for articles and website
- **Meta Tags**: Comprehensive Open Graph and Twitter Cards
- **Sitemap**: Automatic generation and submission
- **Robots.txt**: Proper crawling instructions

### Content SEO

- **Semantic HTML**: Proper heading hierarchy
- **Alt Text**: Descriptive image alt attributes
- **Internal Linking**: Strategic cross-references
- **Reading Time**: User engagement metrics

## 🔄 Maintenance and Updates

### Regular Maintenance

- **Dependency Updates**: Monthly security and feature updates
- **Content Updates**: Regular blog post publishing
- **Performance Monitoring**: Core Web Vitals tracking
- **Security Audits**: Regular security assessments

### Development Guidelines

- **Code Standards**: ESLint and Prettier configuration
- **Type Safety**: TypeScript strict mode
- **Component Documentation**: JSDoc comments
- **Testing Strategy**: Manual testing and browser compatibility

## 🚧 Future Enhancements

### Planned Features

- **Search Functionality**: Client-side search for blog posts
- **RSS Feed**: Automatic RSS generation
- **Comments System**: Disqus or similar integration
- **Analytics**: Privacy-focused analytics integration

### Technical Improvements

- **PWA Support**: Service worker and manifest
- **Internationalization**: Multi-language support
- **Advanced Animations**: Framer Motion integration
- **Performance Monitoring**: Real User Monitoring (RUM)

---

This architecture provides a solid foundation for a modern, performant, and maintainable personal blog while remaining flexible for future enhancements.
