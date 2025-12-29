# 🔨 Available Scripts

## 📦 Installation

```bash
# Install dependencies
npm install

# or with pnpm
pnpm install

# or with yarn
yarn install
```

---

## 🚀 Development

### Start Development Server

```bash
npm run dev
```

- Launches Vite dev server on `http://localhost:5173`
- Hot Module Replacement (HMR) enabled
- Automatic browser refresh on file changes

### Build for Production

```bash
npm run build
```

- Optimized production build
- Code splitting & minification
- Assets hash for cache busting
- Output in `dist/` folder

### Preview Production Build

```bash
npm run preview
```

- Serves the production build locally
- Useful for testing before deployment

---

## 🧪 Testing

### Unit & Integration Tests

```bash
# Run tests in watch mode (recommended for development)
npm test

# Run tests once
npm test -- --run

# Run specific test file
npm test -- ProductCard.test.tsx

# Run tests matching a pattern
npm test -- --grep "ProductCard"
```

### Test UI (Visual Test Runner)

```bash
# Interactive test UI
npm run test:ui

# Open in specific browser
npm run test:ui -- --ui=chromium
```

### Code Coverage

```bash
# Generate coverage report
npm run test:coverage

# View coverage report
npx vitest --coverage --reporter=html
open coverage/index.html
```

### E2E Tests with Playwright

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests in UI mode (recommended)
npm run test:e2e:ui

# Run E2E tests in headed mode (see browser)
npm run test:e2e:headed

# Debug E2E tests
npm run test:e2e:debug

# Run specific E2E test
npm run test:e2e -- auth.spec.ts

# Generate HTML report
npx playwright show-report
```

---

## 📝 Code Quality

### Linting

```bash
# Check for linting errors
npm run lint

# Fix auto-fixable linting errors
npm run lint:fix

# Lint specific file
npm run lint -- src/components/ProductCard.tsx
```

### Formatting

```bash
# Check code formatting
npm run format:check

# Auto-format all files
npm run format

# Format specific file
npx prettier --write src/App.tsx
```

### CSS Linting

```bash
# Check CSS/Tailwind issues
npm run stylelint

# Fix CSS issues
npm run stylelint:fix
```

### Type Checking

```bash
# Check TypeScript types
npm run type-check

# Watch mode type checking
npm run type-check -- --watch
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions

Tests are automatically run on:

- **Push** to `main` or `develop` branches
- **Pull Requests** to `main` or `develop`

#### Available Workflows

| Workflow      | Trigger | What it does                       |
| ------------- | ------- | ---------------------------------- |
| Lint          | Push/PR | ESLint, Prettier, Stylelint checks |
| Type Check    | Push/PR | TypeScript compilation check       |
| Unit Tests    | Push/PR | Vitest coverage report             |
| Build         | Push/PR | Vite production build              |
| E2E Tests     | PR      | Playwright tests on Chromium       |
| Security Scan | Push/PR | npm audit, Snyk scan               |

### Local CI Simulation

```bash
# Run full test suite locally (like CI)
npm run lint && npm run type-check && npm test -- --run && npm run build
```

---

## 🐛 Debugging

### Debug Mode

```bash
# Debug tests
npm test -- --inspect-brk
# Then open chrome://inspect in Chrome

# Debug Vite server
NODE_DEBUG=http npm run dev

# Debug E2E tests
npm run test:e2e:debug
```

### View Logs

```bash
# Show test output with details
npm test -- --reporter=verbose

# Show build logs
npm run build -- --outDir dist --logLevel info
```

---

## 📊 Reporting

### Generate Reports

```bash
# Unit test coverage report
npm run test:coverage
open coverage/index.html

# E2E test report
npx playwright show-report

# Bundle analysis
npm run build -- --analyze
```

---

## 🚢 Deployment

### Build & Deploy to Production

```bash
# 1. Build the application
npm run build

# 2. Deploy the 'dist' folder to hosting
# - Netlify: Connect to GitHub for auto-deploy
# - Vercel: `vercel deploy --prod`
# - AWS S3: `aws s3 sync dist/ s3://bucket-name`
```

### Environment Variables

Create `.env.local` for local development:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_key
VITE_GEMINI_API_KEY=your_gemini_key
```

For production, set these in your hosting platform's environment variables.

---

## 📚 Additional Commands

### Database

```bash
# Generate Supabase types
npx supabase gen types typescript --db-url postgresql://...

# Run migrations
npx supabase db push
npx supabase db pull
```

### Clean Up

```bash
# Clean build artifacts
rm -rf dist

# Clean node modules
rm -rf node_modules
npm install

# Clean test cache
npm test -- --clearCache

# Clean all cache
npm run clean  # if implemented
```

---

## 🆘 Troubleshooting

### Port Already in Use

```bash
# Find process using port 5173
lsof -i :5173  # macOS/Linux
netstat -ano | findstr :5173  # Windows

# Kill the process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### Cache Issues

```bash
# Clear npm cache
npm cache clean --force

# Clear pnpm cache
pnpm store prune

# Clear Vite cache
rm -rf node_modules/.vite
```

### Tests Not Running

```bash
# Reinstall test dependencies
npm install --save-dev vitest @testing-library/react jsdom

# Clear vitest cache
npm test -- --clearCache

# Run with verbose output
npm test -- --reporter=verbose
```

---

## 📖 Documentation

- [Setup Guide](SETUP_GUIDE.md) - Complete installation instructions
- [Testing Guide](TESTING_GUIDE.md) - How to write and run tests
- [E2E Testing](E2E_TESTING_GUIDE.md) - Playwright documentation
- [Code Quality](CODE_QUALITY.md) - Standards and best practices
- [Linting Notes](LINTING_NOTES.md) - Understanding linting warnings
- [Audit Results](AUDIT_RESULTS.md) - Full audit findings

---

## 🎯 Quick Reference

| Command                 | Purpose            | Duration |
| ----------------------- | ------------------ | -------- |
| `npm run dev`           | Start dev server   | Instant  |
| `npm test`              | Run tests          | 5-10s    |
| `npm run lint`          | Check code quality | 10-15s   |
| `npm run build`         | Production build   | 20-30s   |
| `npm run test:coverage` | Coverage report    | 15-20s   |
| `npm run test:e2e`      | E2E tests          | 30-60s   |

---

## ✅ Pre-commit Checklist

Before committing:

```bash
# 1. Run tests
npm test -- --run

# 2. Check linting
npm run lint

# 3. Check types
npm run type-check

# 4. Check formatting
npm run format:check

# 5. Build for production
npm run build
```

Or run all at once:

```bash
npm run lint && npm run type-check && npm test -- --run && npm run build
```

---

**Last Updated**: 26 Décembre 2025
