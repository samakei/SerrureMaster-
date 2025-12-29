# 🎯 Contributing Guide

## Welcome Contributors! 👋

Thank you for your interest in contributing to **SerrureMaster**. This guide will help you get started.

---

## 🚀 Getting Started

### 1. Fork & Clone

```bash
# Clone the repository
git clone https://github.com/yourusername/serruremaster.git

# Navigate to project
cd serruremaster

# Add upstream remote
git remote add upstream https://github.com/original/serruremaster.git
```

### 2. Setup Development Environment

```bash
# Install dependencies
npm install

# Create feature branch
git checkout -b feature/your-feature-name

# Start development server
npm run dev
```

---

## 📋 Development Workflow

### Before Starting

1. **Check existing issues** - Is someone already working on this?
2. **Create an issue** - Describe what you want to build
3. **Wait for approval** - Get feedback from maintainers
4. **Create a branch** - From the latest `develop` branch

### During Development

```bash
# Keep your branch updated
git fetch upstream
git rebase upstream/develop

# Make frequent commits
git commit -m "feat: add new feature"

# Push to your fork
git push origin feature/your-feature-name
```

### Commit Message Format

Follow conventional commits:

```
type(scope): subject

body

footer
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples**:

```
feat(ProductCard): add image fallback handling
fix(CartContext): resolve total calculation bug
docs(README): update installation instructions
test(ProductCard): add unit tests
```

---

## ✅ Pre-submission Checklist

Before creating a Pull Request, ensure:

### Code Quality

- [ ] Code follows [Code Quality Standards](CODE_QUALITY.md)
- [ ] TypeScript strict mode passes: `npm run type-check`
- [ ] ESLint passes: `npm run lint:fix`
- [ ] Prettier formatting applied: `npm run format`
- [ ] Stylelint passes: `npm run stylelint:fix`

### Testing

- [ ] Unit tests written: `npm test`
- [ ] Integration tests if applicable
- [ ] All tests passing: `npm test -- --run`
- [ ] Coverage maintained at 80%+: `npm run test:coverage`
- [ ] E2E tests passing (if UI changes): `npm run test:e2e`

### Documentation

- [ ] JSDoc comments added for functions
- [ ] Complex logic commented
- [ ] README updated if needed
- [ ] Type definitions exported in `types.ts`

### Accessibility

- [ ] Form inputs have `aria-label` or `aria-labelledby`
- [ ] Images have `alt` text
- [ ] Color contrast meets WCAG AA standards
- [ ] Keyboard navigation works

### Build & Performance

- [ ] Build succeeds: `npm run build`
- [ ] No console errors or warnings
- [ ] No performance regressions
- [ ] Assets optimized

---

## 🧪 Testing Guidelines

### Writing Tests

```typescript
// ✅ GOOD - Clear, focused, descriptive
describe('ProductCard', () => {
  it('should display product title and price', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Product Title')).toBeInTheDocument();
  });
});

// ❌ BAD - Vague, tests implementation
describe('ProductCard', () => {
  it('should work', () => {
    const { container } = render(<ProductCard product={mockProduct} />);
    expect(container).toBeTruthy();
  });
});
```

### Test Coverage Requirements

- **New Features**: 80%+ coverage
- **Bugfixes**: Coverage for the fixed issue
- **Refactors**: Maintain existing coverage

---

## 🎨 Code Style Guide

### TypeScript

```typescript
// ✅ Proper types
interface Product {
  id: string;
  title: string;
  price: number;
  features: string[];
}

// ✅ Clear function signature
const addToCart = (product: Product, quantity: number): void => {
  // ...
};

// ❌ Avoid implicit any
const processData = (data) => {
  // ❌
  // ...
};
```

### React Components

```typescript
// ✅ Clear, typed components
interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <article role="article" aria-label={product.title}>
      {/* ... */}
    </article>
  );
};

// ❌ Avoid implicit types
export const ProductCard = (props) => {
  // ...
};
```

### Tailwind CSS

```tsx
// ✅ Organize classes logically
<div className="
  flex flex-col gap-4
  p-4 bg-white rounded-lg shadow
  dark:bg-gray-900
  hover:shadow-lg transition-shadow
">
  {/* ... */}
</div>

// ❌ Avoid inline styles when possible
<div style={{ display: 'flex', flexDirection: 'column' }}>
  {/* ... */}
</div>
```

---

## 🔄 Pull Request Process

### 1. Create Pull Request

```
Title: feat(ComponentName): description of changes

## Description
Brief explanation of what changed and why.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added
- [ ] Integration tests added
- [ ] E2E tests added (if UI change)

## Checklist
- [ ] Code review guidelines followed
- [ ] Tests pass locally
- [ ] Build succeeds
- [ ] Documentation updated
```

### 2. Address Feedback

- Respond to all comments
- Make requested changes
- Push new commits
- Mark conversations as resolved

### 3. Merge

Once approved:

- Squash commits if requested
- Delete feature branch
- PR is merged to `develop`

---

## 🐛 Bug Reports

### Creating an Issue

```markdown
## Description

Brief description of the bug.

## Steps to Reproduce

1. Step 1
2. Step 2
3. ...

## Expected Behavior

What should happen.

## Actual Behavior

What actually happens.

## Environment

- Browser: Chrome 121
- OS: macOS 14
- Node version: 18.x

## Screenshots

[if applicable]
```

---

## 📚 Documentation Standards

### Comments

```typescript
// ✅ Good - explains WHY, not WHAT
// Process payment immediately for standard membership tier
// (Premium tiers are queued for async processing)
const isStandardTier = tier === 'standard';

// ❌ Bad - states the obvious
// Set isStandardTier to true
const isStandardTier = tier === 'standard';
```

### JSDoc

```typescript
/**
 * Validates email address format
 * @param email - Email address to validate
 * @returns true if email is valid, false otherwise
 * @throws Error if email is null or undefined
 * @example
 * validateEmail('user@example.com') // true
 */
function validateEmail(email: string): boolean {
  // ...
}
```

---

## 🔐 Security Guidelines

When contributing:

- ❌ Never commit API keys or secrets
- ❌ Don't store passwords in code
- ❌ Validate all user inputs
- ❌ Sanitize HTML content
- ✅ Use environment variables for sensitive data
- ✅ Follow OWASP guidelines
- ✅ Report security issues privately

---

## 🎯 Areas Needing Help

We welcome contributions in these areas:

### High Priority

- [ ] E2E test coverage
- [ ] Performance optimizations
- [ ] Mobile responsiveness
- [ ] Accessibility improvements

### Medium Priority

- [ ] Documentation improvements
- [ ] UI/UX enhancements
- [ ] Bug fixes
- [ ] Code refactoring

### Low Priority

- [ ] Example code
- [ ] Translations
- [ ] Minor style tweaks

---

## 💬 Questions?

- **Discord**: [Join our server]
- **GitHub Discussions**: [Ask questions]
- **Issues**: [Create an issue]
- **Email**: support@serruremaster.com

---

## 📝 Code Review Checklist

Maintainers will verify:

- [ ] Code quality (lint, format, types)
- [ ] Test coverage (80%+ minimum)
- [ ] Documentation completeness
- [ ] No breaking changes without discussion
- [ ] Follows project standards
- [ ] Accessibility compliance
- [ ] Performance impact
- [ ] Security considerations

---

## 🎓 Learning Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Vitest Guide](TESTING_GUIDE.md)
- [Playwright Guide](E2E_TESTING_GUIDE.md)
- [Code Quality Standards](CODE_QUALITY.md)

---

## 🙏 Thank You!

Every contribution, whether code, documentation, or feedback, helps improve SerrureMaster.

We appreciate your effort and look forward to working with you! 🚀

---

**Last Updated**: 26 Décembre 2025
