# Naming Conventions Guide

## Overview

This document outlines the production-grade naming conventions used throughout Toppy's Digital Playground. These conventions ensure consistency, maintainability, and professional standards across the entire codebase.

## 🎯 **Core Principles**

### **1. Clarity Over Brevity**
- Names should be self-explanatory and descriptive
- Avoid abbreviations unless they're universally understood
- Use full words instead of shortened versions

### **2. Consistency Across Layers**
- Same naming patterns for similar functionality
- Consistent casing conventions
- Uniform file organization

### **3. Industry Standards**
- Follow established conventions for the technology stack
- Align with community best practices
- Maintain compatibility with tooling and frameworks

## 📁 **File and Directory Naming**

### **Components**
```
src/components/
├── BlogCard.astro          ✅ PascalCase, descriptive
├── Footer.astro            ✅ PascalCase, clear purpose
├── Navbar.astro            ✅ PascalCase, standard term
├── ThemeToggle.astro       ✅ PascalCase, action + object
├── GradualSpacing.astro    ✅ PascalCase, descriptive
├── RotateWords.astro       ✅ PascalCase, action + object
├── StaggeredFade.astro     ✅ PascalCase, descriptive
└── TypingEffect.astro      ✅ PascalCase, descriptive
```

**Rules:**
- **PascalCase** for all component files
- **Descriptive names** that clearly indicate functionality
- **No unnecessary suffixes** (removed "Pure" suffix)
- **Action + Object pattern** for interactive components

### **Layouts**
```
src/layouts/
├── Layout.astro            ✅ PascalCase, generic layout
└── BlogPost.astro         ✅ PascalCase, specific layout
```

**Rules:**
- **PascalCase** for layout files
- **Generic names** for reusable layouts
- **Specific names** for specialized layouts

### **Pages**
```
src/pages/
├── index.astro             ✅ lowercase, homepage
├── blog/
│   ├── index.astro         ✅ lowercase, blog listing
│   ├── [...slug].astro     ✅ lowercase, dynamic route
│   └── posts/
│       ├── 2023-year-in-review.md    ✅ kebab-case, date prefix
│       ├── aws-authentication.md     ✅ kebab-case, descriptive
│       └── springboot-rest-api-guide.md ✅ kebab-case, descriptive
└── sitemap.xml.ts          ✅ lowercase, file type suffix
```

**Rules:**
- **lowercase** for page files
- **kebab-case** for blog post files
- **Date prefix** for time-sensitive content
- **Descriptive names** for blog posts

### **Configuration Files**
```
├── astro.config.mjs        ✅ lowercase, framework convention
├── package.json            ✅ lowercase, standard
├── tailwind.config.mjs     ✅ lowercase, framework convention
├── tsconfig.json           ✅ lowercase, standard
└── .github/
    └── workflows/
        ├── deployment.yml  ✅ lowercase, descriptive
        └── sync-master.yml ✅ lowercase, descriptive
```

**Rules:**
- **lowercase** for configuration files
- **Framework conventions** (e.g., `astro.config.mjs`)
- **Descriptive names** for custom files

## 🏗️ **Code Naming Conventions**

### **Variables and Functions**
```typescript
// ✅ Good - Descriptive and clear
const sortedPosts = getAllPosts();
const publishedTime = formatDate(frontmatter.date);
const allKeywords = [...frontmatter.tags, ...additionalTags];

// ❌ Bad - Unclear abbreviations
const sp = getAllPosts();
const pt = formatDate(frontmatter.date);
const ak = [...frontmatter.tags, ...additionalTags];
```

**Rules:**
- **camelCase** for variables and functions
- **Descriptive names** that explain purpose
- **Avoid abbreviations** unless universally understood

### **Interfaces and Types**
```typescript
// ✅ Good - PascalCase with descriptive names
interface Frontmatter {
  title: string;
  date: string;
  description: string;
  tags: string[];
}

interface BlogPostProps {
  title: string;
  description: string;
  date: string;
  slug: string;
}

// ❌ Bad - Unclear or abbreviated
interface FM {
  t: string;
  d: string;
  desc: string;
  tags: string[];
}
```

**Rules:**
- **PascalCase** for interfaces and types
- **Descriptive names** that indicate purpose
- **Consistent naming** across similar structures

### **CSS Classes**
```css
/* ✅ Good - BEM methodology with descriptive names */
.blog-card {
  /* Base element */
}

.blog-card__title {
  /* Element modifier */
}

.blog-card--featured {
  /* Modifier */
}

.blog-card:hover {
  /* State modifier */
}

/* ❌ Bad - Unclear or inconsistent */
.card {
  /* Too generic */
}

.cardTitle {
  /* Inconsistent casing */
}

.card-featured {
  /* Inconsistent methodology */
}
```

**Rules:**
- **kebab-case** for CSS classes
- **BEM methodology** for complex components
- **Descriptive names** that indicate purpose
- **Consistent patterns** across components

## 📝 **Content Naming**

### **Blog Posts**
```
2023-year-in-review.md                    ✅ Date prefix, descriptive
2024-mid-year-reflection.md               ✅ Date prefix, descriptive
aws-authentication.md                     ✅ Technology + topic
springboot-rest-api-guide.md             ✅ Technology + topic + type
golang-restapi-with-gin.md               ✅ Technology + topic + framework
file-security.md                          ✅ Topic + category
vault-security-guide.md                  ✅ Technology + topic + type
```

**Rules:**
- **kebab-case** for all blog post files
- **Date prefix** for time-sensitive content (YYYY-MM-DD or YYYY)
- **Technology + topic** for technical posts
- **Descriptive names** that indicate content type
- **No double extensions** (fixed `.md.md` issue)

### **Documentation Files**
```
README.md                    ✅ Standard convention
ARCHITECTURE.md              ✅ PascalCase, descriptive
CONTRIBUTING.md              ✅ PascalCase, standard
BLOG_GUIDE.md               ✅ UPPER_CASE, descriptive
SEO_GUIDE.md                ✅ UPPER_CASE, descriptive
PERFORMANCE_GUIDE.md        ✅ UPPER_CASE, descriptive
SEMANTIC_HTML5_GUIDE.md     ✅ UPPER_CASE, descriptive
NAMING_CONVENTIONS.md       ✅ UPPER_CASE, descriptive
```

**Rules:**
- **UPPER_CASE** for documentation files
- **Descriptive names** that indicate content
- **Consistent patterns** for similar documents

## 🔧 **Technical Naming**

### **Git Branches**
```
main                        ✅ Standard primary branch
master                      ✅ Legacy branch (synced with main)
feature/semantic-html5     ✅ feature/ prefix, kebab-case
fix/blog-naming-issues     ✅ fix/ prefix, kebab-case
docs/naming-conventions    ✅ docs/ prefix, kebab-case
```

**Rules:**
- **lowercase** with hyphens for branch names
- **Prefixes** to indicate branch type (feature/, fix/, docs/)
- **Descriptive names** that explain the change

### **Git Commits**
```
feat: implement semantic HTML5 structure
fix: resolve blog post naming issues
docs: add comprehensive naming conventions
style: improve code formatting consistency
refactor: rename components to production standards
```

**Rules:**
- **Conventional Commits** format
- **lowercase** type with colon
- **Descriptive messages** that explain the change
- **Present tense** for commit messages

## 🚫 **Anti-Patterns to Avoid**

### **❌ Poor Naming Examples**
```typescript
// Unclear abbreviations
const u = getUser();
const p = getPosts();
const d = getDate();

// Inconsistent casing
const userName = 'john';
const user_email = 'john@example.com';
const UserAge = 25;

// Generic names
const data = fetchData();
const item = getItem();
const thing = processThing();

// Unnecessary suffixes
const UserComponentPure = () => {};
const DataServiceUtil = {};
const HelperFunctionHelper = () => {};
```

### **✅ Improved Examples**
```typescript
// Clear and descriptive
const currentUser = getUser();
const publishedPosts = getPosts();
const formattedDate = getDate();

// Consistent casing
const userName = 'john';
const userEmail = 'john@example.com';
const userAge = 25;

// Specific names
const userProfileData = fetchData();
const blogPostItem = getItem();
const paymentProcessor = processThing();

// Clean names without unnecessary suffixes
const UserComponent = () => {};
const DataService = {};
const ValidationHelper = () => {};
```

## 📊 **Naming Checklist**

### **Before Creating New Files**
- [ ] Does the name clearly indicate the file's purpose?
- [ ] Is the naming convention consistent with similar files?
- [ ] Does it follow the established casing rules?
- [ ] Is it descriptive enough for future developers?

### **Before Creating New Components**
- [ ] Is the name in PascalCase?
- [ ] Does it clearly describe the component's functionality?
- [ ] Is it consistent with other component names?
- [ ] Does it avoid unnecessary suffixes or prefixes?

### **Before Creating New Variables**
- [ ] Is the name in camelCase?
- [ ] Does it clearly describe the variable's purpose?
- [ ] Is it descriptive enough to understand without context?
- [ ] Does it avoid abbreviations unless universally understood?

### **Before Creating New Functions**
- [ ] Is the name in camelCase?
- [ ] Does it clearly describe what the function does?
- [ ] Does it follow verb-noun patterns for actions?
- [ ] Is it consistent with similar functions?

## 🔄 **Migration Guidelines**

### **When Renaming Files**
1. **Update all imports** in files that reference the renamed file
2. **Update documentation** that references the old name
3. **Test all functionality** to ensure nothing is broken
4. **Commit changes** with descriptive commit messages
5. **Update any external references** (README, guides, etc.)

### **When Renaming Components**
1. **Update component file** with new name
2. **Update all imports** across the codebase
3. **Update component usage** in templates
4. **Update documentation** and examples
5. **Test all pages** that use the component

### **When Renaming Variables**
1. **Use IDE refactoring tools** when possible
2. **Update all references** to the variable
3. **Test functionality** to ensure no broken references
4. **Update comments** that reference the old name

## 🛠️ **Tools and Automation**

### **IDE Configuration**
- **ESLint rules** for naming conventions
- **Prettier configuration** for consistent formatting
- **TypeScript strict mode** for better naming enforcement

### **Git Hooks**
- **Pre-commit hooks** to check naming conventions
- **Automated linting** to catch naming issues
- **Documentation updates** when files are renamed

### **CI/CD Integration**
- **Automated testing** after renames
- **Documentation validation** to ensure consistency
- **Naming convention checks** in pull requests

## 📚 **Resources**

### **Industry Standards**
- [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [TypeScript Coding Guidelines](https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines)

### **Framework Conventions**
- [Astro Component Guidelines](https://docs.astro.build/en/guides/components/)
- [Tailwind CSS Naming](https://tailwindcss.com/docs/customizing-colors)
- [React Component Naming](https://reactjs.org/docs/components-and-props.html)

### **Best Practices**
- [Clean Code Naming](https://clean-code-developer.com/grades/grade-1-red/)
- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

This naming convention guide ensures that Toppy's Digital Playground maintains professional, consistent, and maintainable code standards throughout the entire project lifecycle.
