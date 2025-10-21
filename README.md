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

```
/
├── public/                 # Static assets
│   ├── favicon.svg         # Site favicon
│   └── robots.txt         # SEO robots file
├── src/
│   ├── components/         # Reusable Astro components
│   │   ├── Navbar.astro   # Navigation with theme toggle
│   │   ├── Footer.astro   # Site footer
│   │   ├── BlogCard.astro # Blog post preview cards
│   │   └── ThemeToggle.astro # Dark/light mode toggle
│   ├── layouts/           # Page layouts
│   │   ├── Layout.astro   # Main site layout with SEO
│   │   └── BlogPost.astro # Blog post layout
│   ├── pages/             # Astro pages (file-based routing)
│   │   ├── index.astro    # Homepage
│   │   ├── blog/          # Blog pages
│   │   └── sitemap.xml.ts # Dynamic sitemap generation
│   ├── plugins/           # Custom Astro plugins
│   │   └── remark-mermaid-astro.js # Mermaid diagram support
│   └── assets/            # Static assets
├── astro.config.mjs       # Astro configuration
├── tailwind.config.mjs    # Tailwind CSS configuration
└── package.json           # Dependencies and scripts
```

## 🛠️ Development

### Available Scripts

| Command | Action |
| :------ | :----- |
| `pnpm dev` | Start development server with hot reload |
| `pnpm build` | Build production site to `./dist/` |
| `pnpm preview` | Preview production build locally |
| `pnpm astro` | Run Astro CLI commands |

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
title: "Your Post Title"
date: "2024-01-01"
description: "Brief description of your post"
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

### GitHub Pages

The site is automatically deployed to GitHub Pages on every push to main:

1. Push changes to the `main` branch
2. GitHub Actions builds and deploys the site
3. Site updates at `https://topkoong.github.io`

### Manual Deployment

```bash
# Build the site
pnpm build

# Deploy dist/ folder to your hosting provider
```

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

- **Static Generation**: Pre-built pages for fast loading
- **Code Splitting**: Automatic chunking of JavaScript
- **Image Optimization**: Responsive images with proper formats
- **Prefetching**: Automatic link prefetching for navigation
- **Minimal JavaScript**: Only loads JS when needed

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
