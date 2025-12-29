# Code Quality Standards

## ESLint Configuration

### Active Rules

- `eslint:recommended` - Rules de base ESLint
- TypeScript Parser pour support `.tsx` / `.ts`
- React Plugin (implicite)

### Disabled Rules (Par Intention)

- `react/forbid-component-props` - OFF

  - Raison: Styles inline dynamiques nécessaires (animations)
  - Exemples: `animationDelay`, positions dynamiques

- `react/no-unknown-property` - OFF
  - Raison: Support des propriétés CSS dynamiques

## Stylelint Configuration

### Accepted Rules

- Directives Tailwind: `@tailwind`, `@apply`, `@layer`
  - Traitées par PostCSS/Tailwind
  - Ne sont pas du CSS standard

### CSS Modern Properties

- `scrollbar-width` - CSS Level 4 (2024)
- `scrollbar-color` - CSS Level 4 (2024)
- Support: Chrome 121+, Safari 15.4+, Firefox 64+, Edge 121+

## Code Style Standards

### Naming Conventions

- **Components**: PascalCase (`ProductCard.tsx`)
- **Hooks**: camelCase starting with `use` (`useProducts()`)
- **Functions**: camelCase (`handleClick()`)
- **Constants**: UPPER_SNAKE_CASE (`MOCK_USER_ID`)
- **Types**: PascalCase (`Product`, `User`)
- **CSS Classes**: kebab-case (Tailwind default)

### TypeScript

- Strict mode: Enabled
- No implicit `any`
- Consistent casing for files (Windows compatibility)

### React

- Functional components only
- Hooks only (no class components)
- Props interface for each component
- Error boundaries recommended for major sections

### CSS/Tailwind

- Utility-first approach (Tailwind)
- Custom CSS only for animations/special cases
- Mobile-first responsive design

## Performance Standards

### Bundle Size

- Goal: < 500KB gzip
- Monitor with `npm run build`

### Images

- Lazy loading on all images
- Responsive images with srcset
- WebP format when possible

### Code Splitting

- Automatic by Vite
- Route-based code splitting

## Accessibility Standards (WCAG 2.1 AA)

### Forms

- All inputs must have labels
- Error messages associated with inputs
- Form validation feedback

### Navigation

- Keyboard navigation support
- Focus indicators visible
- Semantic HTML

### Images

- All images have alt text
- Decorative images have `alt=""`

### Color

- Not sole indicator of status
- Sufficient contrast ratio (4.5:1)

### Dynamic Content

- Screen reader announcements for updates
- ARIA labels where appropriate

## Security Standards

### External Links

- `rel="noopener noreferrer"` on `target="_blank"`
- Validation of URLs

### User Input

- XSS prevention (React auto-escapes)
- CSRF tokens for forms
- Validation client + server

### API Communication

- HTTPS only in production
- Secure headers configured

## Git Standards

### Commit Messages

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

### Branch Naming

- `main` - Production ready
- `develop` - Development branch
- `feature/name` - Feature branches
- `bugfix/name` - Bug fixes
- `hotfix/name` - Urgent production fixes

## Documentation Standards

### Code Comments

- **SHOULD**: Explain "why", not "what"
- **SHOULD NOT**: Comment obvious code
- **JSDoc**: For exported functions/types

### README

- Setup instructions
- Available scripts
- Project structure
- Contributing guidelines

### Commit Messages

- Clear, descriptive subject line (50 chars max)
- Reference related issues

---

**Enforcement**: ESLint + Stylelint + Prettier + Git Hooks (recommended)
