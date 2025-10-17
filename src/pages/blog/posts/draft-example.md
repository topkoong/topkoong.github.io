---
layout: ../../../layouts/BlogPost.astro
title: 'Draft Post Example 📝'
description: 'This is a draft post that will not be visible to users'
date: '2024-12-30'
published: false
---

# Draft Post Example

This is a draft post that demonstrates the `published: false` feature.

## How it works

When `published: false` is set in the frontmatter:
- The post will not appear on the home page
- The post will not appear on the blog index page  
- The post will not be accessible via direct URL
- The post will not be included in static path generation

## Usage

To hide a post, simply add `published: false` to the frontmatter:

```yaml
---
layout: ../../../layouts/BlogPost.astro
title: 'Your Post Title'
description: 'Your post description'
date: '2024-12-30'
published: false  # This hides the post
---
```

To show a post, either:
- Set `published: true` explicitly
- Omit the `published` field entirely (defaults to true)

This is useful for:
- Draft posts
- Posts under review
- Scheduled posts
- Experimental content
