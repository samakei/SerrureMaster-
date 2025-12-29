# ⚡ Quick Reference Card

## 🚀 Essential Commands

```bash
# Setup
npm install                    # Install dependencies

# Development
npm run dev                    # Start dev server (port 5173)
npm run build                  # Production build
npm run preview                # Preview production build

# Testing
npm test                       # Tests in watch mode (development)
npm test -- --run             # Run tests once (CI mode)
npm run test:ui               # Interactive test UI
npm run test:coverage         # Generate coverage report

# Code Quality
npm run lint                   # Check for linting errors
npm run lint:fix              # Fix auto-fixable linting errors
npm run format:check          # Check code formatting
npm run format                # Auto-format all code
npm run type-check            # TypeScript type checking
npm run stylelint             # Check CSS/Tailwind
```

---

## 🔄 Common Workflows

### Starting a New Feature

```bash
npm run dev                    # Start dev server
npm test                       # Watch tests
# In another terminal, edit code
# Tests auto-run on file changes
```

### Before Committing

```bash
npm run lint:fix              # Auto-fix linting issues
npm run format                # Auto-format code
npm test -- --run             # Run all tests once
npm run type-check            # Verify TypeScript
npm run build                  # Verify build succeeds
```

### Running CI Locally

```bash
npm run lint && \
npm run type-check && \
npm test -- --run && \
npm run build
```

### Checking Coverage

```bash
npm run test:coverage          # Generate report
open coverage/index.html       # View in browser (macOS)
start coverage/index.html      # View in browser (Windows)
```

---

## 📂 Key Files & Locations

### Source Code

```
src/
├── components/         # React components
├── contexts/          # State management
├── services/          # API & business logic
├── App.tsx           # Main app component
└── index.tsx         # Entry point
```

### Tests

```
__tests__/
├── types.test.ts              # Type validation
├── utils.test.ts              # Utility functions
├── services.test.ts           # Service mocking
├── ProductCard.test.tsx       # Components
└── contexts.integration.test.tsx  # Context integration
```

### Configuration

```
vitest.config.ts      # Vitest configuration
vitest.setup.ts       # Test environment setup
.eslintrc.json        # Linting rules
.prettierrc            # Code formatting
.stylelintrc.json     # CSS linting
```

### Documentation

```
TESTING_GUIDE.md           # Testing documentation
E2E_TESTING_GUIDE.md       # Playwright E2E guide
CODE_QUALITY.md            # Code standards
CONTRIBUTING.md            # Contribution process
SCRIPTS_GUIDE.md           # All npm scripts
DOCUMENTATION_INDEX.md     # Complete documentation index
```

---

## 🧪 Test Examples

### Run Specific Tests

```bash
# Run single test file
npm test -- types.test.ts

# Run tests matching pattern
npm test -- --grep "ProductCard"

# Run tests excluding pattern
npm test -- --grep "Integration"
```

### Debug Tests

```bash
# Verbose output
npm test -- --reporter=verbose

# Debug mode
npm test -- --inspect-brk

# Screenshot on failure
npm test -- --reporter=html
```

---

## 📊 Coverage Reports

### Generate & View Coverage

```bash
# Generate coverage
npm run test:coverage

# View report (different OS)
open coverage/index.html        # macOS
start coverage/index.html       # Windows
xdg-open coverage/index.html    # Linux
```

### Coverage Goals

- Lines: 80%
- Functions: 80%
- Branches: 80%
- Statements: 80%

---

## 🔐 Security Check

### Local Security Audit

```bash
npm audit                      # Check vulnerabilities
npm audit --fix               # Auto-fix vulnerabilities
npm audit --audit-level=high  # Check high severity
```

---

## 🏗️ Build & Deploy

### Production Build

```bash
npm run build                  # Create dist/

# Then deploy dist/ to:
# - Vercel: vercel deploy --prod
# - Netlify: netlify deploy --prod
# - AWS: aws s3 sync dist/ s3://bucket-name
```

### Build Options

```bash
npm run build -- --minify false      # No minification
npm run build -- --outDir build      # Custom output dir
npm run build -- --emptyOutDir false # Don't clear dir
```

---

## 🐛 Troubleshooting

### Tests Won't Run

```bash
# Clear test cache
npm test -- --clearCache

# Reinstall test dependencies
npm install --save-dev vitest @testing-library/react

# Check Node version (need 18+)
node --version
```

### Port Already in Use

```bash
# macOS/Linux - Find process
lsof -i :5173

# Windows - Find process
netstat -ano | findstr :5173

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### Build Errors

```bash
# Clear dependencies and reinstall
rm -rf node_modules
npm install
npm run build
```

---

## 📚 Documentation Quick Links

| Need              | Read This                                        |
| ----------------- | ------------------------------------------------ |
| How to test       | [TESTING_GUIDE.md](TESTING_GUIDE.md)             |
| E2E testing       | [E2E_TESTING_GUIDE.md](E2E_TESTING_GUIDE.md)     |
| Code standards    | [CODE_QUALITY.md](CODE_QUALITY.md)               |
| How to contribute | [CONTRIBUTING.md](CONTRIBUTING.md)               |
| All scripts       | [SCRIPTS_GUIDE.md](SCRIPTS_GUIDE.md)             |
| Setup             | [SETUP_GUIDE.md](SETUP_GUIDE.md)                 |
| Full index        | [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) |

---

## ⌨️ Keyboard Shortcuts (Test UI)

When running `npm run test:ui`:

```
a     - Run all tests
d     - Debug test
p     - Filter by filename
t     - Filter by test name
?     - Show help
ESC   - Clear filters
q     - Quit
```

---

## 💾 Git Workflow

### Create Feature Branch

```bash
git checkout -b feature/my-feature
```

### Commit Changes

```bash
# Follow conventional commits
git commit -m "feat(ComponentName): description"
# Types: feat, fix, docs, style, refactor, test, chore
```

### Create Pull Request

- Push: `git push origin feature/my-feature`
- Create PR on GitHub
- Verify CI/CD checks pass
- Request review
- Merge when approved

---

## 🔍 Useful Patterns

### Debug Test

```typescript
// Add to test to pause execution
test('my test', () => {
  debugger; // Pauses here when using --inspect
  // ...
});
```

### Log Variables

```typescript
console.log('value:', value);
// Run with: npm test -- --reporter=verbose
```

### Skip Test

```typescript
it.skip('should do something', () => {
  // This test will be skipped
});
```

### Focus on Test

```typescript
it.only('should do something', () => {
  // Only this test will run
});
```

---

## 📱 Mobile Testing

### Test on Mobile Size

```bash
# In browser DevTools:
# 1. Press F12
# 2. Click device toggle
# 3. Select device or custom size
```

### Responsive Sizes

```
Mobile:    375 x 667 (iPhone SE)
Tablet:    768 x 1024 (iPad)
Desktop:   1920 x 1080 (Monitor)
```

---

## 🎯 Pre-deployment Checklist

```bash
# 1. Install dependencies
npm install

# 2. Run full test suite
npm test -- --run

# 3. Check code quality
npm run lint && npm run type-check

# 4. Generate coverage
npm run test:coverage

# 5. Build for production
npm run build

# 6. Preview production build
npm run preview

# ✅ Ready to deploy!
```

---

## 🆘 Need Help?

### Documentation

- All docs in project root (`*.md` files)
- Index: [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)
- Search: Use `Ctrl+F` or `Cmd+F`

### GitHub

- Create issue with details
- Check existing issues
- Review discussions

### Team

- Ask more experienced team members
- Share knowledge at standup
- Contribute documentation improvements

---

## 🎓 Learning Resources

- [Vitest Docs](https://vitest.dev/)
- [Testing Library](https://testing-library.com/react)
- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## ⏱️ Expected Command Times

```
npm install         ~30-60s (first time)
npm run dev         ~5s (starts instantly)
npm test            <1s (first run)
npm run lint        ~10s
npm run build       ~20-30s
npm run test:coverage ~15-20s
```

---

## 📋 Version Info

- **Node**: 18+ (check with `node --version`)
- **npm**: 8+ (check with `npm --version`)
- **Vitest**: ^1.0.0
- **React**: 18.2
- **TypeScript**: 5.2

---

## ✨ Pro Tips

1. Use `npm run test:ui` for visual debugging
2. Run `npm test` while developing (watch mode)
3. Keep this card open while working
4. Use `--grep` to run specific tests quickly
5. Check coverage regularly: `npm run test:coverage`
6. Commit early and often with good messages
7. Run full check before creating PR

---

**Last Updated**: 26 Décembre 2025
**Status**: ✅ Current & Accurate

Keep this card handy! 📌
