# Contributing Guidelines

Thank you for your interest in contributing to Toppy's Digital Playground! This document provides guidelines and standards for contributing to the project.

## 🤝 How to Contribute

### Types of Contributions

We welcome various types of contributions:

- **Bug Reports**: Report issues and bugs
- **Feature Requests**: Suggest new features or improvements
- **Code Contributions**: Submit pull requests for fixes or features
- **Documentation**: Improve or add documentation
- **Content**: Submit blog post ideas or content suggestions

### Getting Started

1. **Fork the Repository**: Click the "Fork" button on GitHub
2. **Clone Your Fork**: 
   ```bash
   git clone https://github.com/YOUR_USERNAME/topkoong.github.io.git
   cd topkoong.github.io
   ```
3. **Install Dependencies**:
   ```bash
   pnpm install
   ```
4. **Start Development Server**:
   ```bash
   pnpm dev
   ```

## 📝 Development Guidelines

### Code Standards

#### TypeScript/JavaScript
- **Type Safety**: Use TypeScript for all new code
- **Strict Mode**: Follow TypeScript strict mode guidelines
- **Interfaces**: Define proper interfaces for all props and data structures
- **Comments**: Add JSDoc comments for all functions and components

#### Astro Components
- **Component Structure**: Follow the established pattern:
  ```astro
  ---
  /**
   * Component documentation
   * @fileoverview Brief description
   */
  
  // TypeScript interfaces
  interface Props {
    // Props definition
  }
  
  // Component logic
  const { prop1, prop2 } = Astro.props;
  ---
  
  <!-- Template with comments -->
  <div class="component">
    <!-- Content -->
  </div>
  
  <!-- Styles with comments -->
  <style>
    /* Component styles */
  </style>
  ```

#### CSS/Styling
- **Tailwind First**: Use Tailwind CSS classes whenever possible
- **Custom Styles**: Only add custom CSS when Tailwind doesn't provide the needed functionality
- **Dark Mode**: Always consider dark mode compatibility
- **Responsive Design**: Mobile-first approach with responsive breakpoints

### File Organization

#### Components
- **Location**: Place reusable components in `src/components/`
- **Naming**: Use PascalCase for component files (e.g., `BlogCard.astro`)
- **Documentation**: Include comprehensive JSDoc comments

#### Pages
- **Location**: Place pages in `src/pages/`
- **Routing**: Follow Astro's file-based routing conventions
- **Layouts**: Use appropriate layout components

#### Styles
- **Global Styles**: Add to layout components
- **Component Styles**: Use scoped styles in components
- **Tailwind Config**: Extend theme in `tailwind.config.mjs`

### Git Workflow

#### Branch Naming
- **Feature Branches**: `feature/description` (e.g., `feature/add-search`)
- **Bug Fixes**: `fix/description` (e.g., `fix/navbar-mobile`)
- **Documentation**: `docs/description` (e.g., `docs/api-reference`)

#### Commit Messages
Follow conventional commit format:
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
```
feat(blog): add search functionality
fix(navbar): resolve mobile menu toggle
docs(readme): update installation instructions
```

## 🧪 Testing Guidelines

### Manual Testing
- **Cross-browser**: Test in Chrome, Firefox, Safari, and Edge
- **Responsive**: Test on mobile, tablet, and desktop
- **Dark Mode**: Verify theme switching works correctly
- **Performance**: Check Core Web Vitals

### Testing Checklist
- [ ] Site builds without errors (`pnpm build`)
- [ ] Development server runs (`pnpm dev`)
- [ ] All pages load correctly
- [ ] Navigation works on all devices
- [ ] Theme toggle functions properly
- [ ] Blog posts render correctly
- [ ] Images load and are optimized
- [ ] No console errors

## 📚 Documentation Standards

### Code Documentation
- **JSDoc Comments**: Required for all functions and components
- **Inline Comments**: Explain complex logic
- **README Updates**: Update relevant sections when adding features
- **Architecture Docs**: Update `ARCHITECTURE.md` for structural changes

### Documentation Format
```typescript
/**
 * Brief description of the function/component
 * 
 * Detailed explanation of what it does, how it works,
 * and any important considerations.
 * 
 * @param param1 - Description of parameter
 * @param param2 - Description of parameter
 * @returns Description of return value
 * @example
 * ```typescript
 * const result = myFunction('example', 123);
 * ```
 */
```

## 🎨 Design Guidelines

### Visual Design
- **Consistency**: Follow established design patterns
- **Accessibility**: Ensure proper contrast ratios and ARIA labels
- **Typography**: Use Inter font for body text, JetBrains Mono for code
- **Colors**: Follow the established purple/blue color scheme

### Animation Guidelines
- **Performance**: Use CSS animations over JavaScript when possible
- **Accessibility**: Respect `prefers-reduced-motion`
- **Timing**: Use consistent timing functions (ease-out, ease-in-out)
- **Duration**: Keep animations under 500ms for UI interactions

### Responsive Design
- **Mobile First**: Design for mobile, then enhance for larger screens
- **Breakpoints**: Use Tailwind's default breakpoints
- **Touch Targets**: Ensure minimum 44px touch targets
- **Readability**: Maintain readable text sizes on all devices

## 🐛 Bug Reports

### Before Reporting
1. **Check Issues**: Search existing issues first
2. **Reproduce**: Ensure the bug is reproducible
3. **Environment**: Note your browser, OS, and device

### Bug Report Template
```markdown
## Bug Description
Brief description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
What you expected to happen

## Actual Behavior
What actually happened

## Environment
- OS: [e.g., macOS, Windows, Linux]
- Browser: [e.g., Chrome, Firefox, Safari]
- Device: [e.g., Desktop, Mobile, Tablet]

## Screenshots
If applicable, add screenshots

## Additional Context
Any other context about the problem
```

## 💡 Feature Requests

### Before Requesting
1. **Check Roadmap**: Review existing feature requests
2. **Justify**: Explain why this feature would be valuable
3. **Scope**: Define the feature clearly

### Feature Request Template
```markdown
## Feature Description
Brief description of the feature

## Problem Statement
What problem does this solve?

## Proposed Solution
How should this feature work?

## Alternatives Considered
What other solutions did you consider?

## Additional Context
Any other context or screenshots
```

## 🔄 Pull Request Process

### Before Submitting
1. **Fork and Branch**: Create a feature branch from `main`
2. **Make Changes**: Implement your changes following guidelines
3. **Test**: Ensure all tests pass and manual testing is complete
4. **Document**: Update documentation if needed
5. **Commit**: Use conventional commit messages

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Testing
- [ ] Manual testing completed
- [ ] Cross-browser testing done
- [ ] Responsive design verified
- [ ] Dark mode compatibility checked

## Screenshots
If applicable, add screenshots

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
- [ ] Build passes successfully
```

### Review Process
1. **Automated Checks**: CI/CD pipeline runs automatically
2. **Code Review**: Maintainer reviews code quality and standards
3. **Testing**: Manual testing by maintainer
4. **Approval**: Changes approved and merged

## 📞 Getting Help

### Communication Channels
- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For general questions and ideas
- **Email**: theeruttop@gmail.com for direct contact

### Response Times
- **Bug Reports**: Within 48 hours
- **Feature Requests**: Within 1 week
- **Pull Requests**: Within 3-5 business days
- **General Questions**: Within 1 week

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project (MIT License).

## 🙏 Recognition

Contributors will be recognized in:
- **README.md**: Listed as contributors
- **Release Notes**: Mentioned in relevant releases
- **GitHub**: Proper attribution in commit history

---

Thank you for contributing to Toppy's Digital Playground! Your contributions help make this project better for everyone.
