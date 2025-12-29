#!/usr/bin/env node

/**
 * Stripe Configuration Verification Script
 * Vérifie que la configuration Stripe est correctement mise en place
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

console.log(`\n${colors.blue}🏦 Stripe Configuration Verification${colors.reset}\n`);

// Checks
const checks = [];

// Check 1: .env.local exists
const envLocalPath = path.join(__dirname, '.env.local');
const envLocalExists = fs.existsSync(envLocalPath);
checks.push({
  name: '.env.local file exists',
  passed: envLocalExists,
  fix: 'Create .env.local with VITE_STRIPE_PUBLIC_KEY',
});

// Check 2: .env.local has Stripe public key
if (envLocalExists) {
  const envLocal = fs.readFileSync(envLocalPath, 'utf-8');
  const hasPublicKey = envLocal.includes('VITE_STRIPE_PUBLIC_KEY');
  const hasValidKey = /VITE_STRIPE_PUBLIC_KEY=pk_test_/.test(envLocal);

  checks.push({
    name: 'VITE_STRIPE_PUBLIC_KEY defined',
    passed: hasPublicKey,
    fix: 'Add VITE_STRIPE_PUBLIC_KEY=pk_test_YOUR_KEY to .env.local',
  });

  checks.push({
    name: 'VITE_STRIPE_PUBLIC_KEY uses test key',
    passed: hasValidKey,
    fix: 'Use a test key starting with pk_test_',
  });
}

// Check 3: .env.example exists
const envExamplePath = path.join(__dirname, '.env.example');
const envExampleExists = fs.existsSync(envExamplePath);
checks.push({
  name: '.env.example template exists',
  passed: envExampleExists,
  fix: 'Documentation template for environment setup',
});

// Check 4: package.json has Stripe
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const hasStripe =
    packageJson.dependencies?.['@stripe/js'] ||
    packageJson.dependencies?.['stripe'] ||
    packageJson.devDependencies?.['stripe'];

  checks.push({
    name: 'Stripe JS library in dependencies',
    passed: !!hasStripe,
    fix: 'npm install @stripe/js',
  });
}

// Check 5: stripeService.ts exists
const stripeServicePath = path.join(__dirname, 'services', 'stripeService.ts');
const stripeServiceExists = fs.existsSync(stripeServicePath);
checks.push({
  name: 'Stripe service file exists',
  passed: stripeServiceExists,
  fix: 'Create services/stripeService.ts',
});

// Check 6: Stripe checkout function exists
const stripeFunctionPath = path.join(
  __dirname,
  'supabase',
  'functions',
  'stripe-checkout',
  'index.ts'
);
const stripeFunctionExists = fs.existsSync(stripeFunctionPath);
checks.push({
  name: 'Stripe checkout edge function exists',
  passed: stripeFunctionExists,
  fix: 'Create supabase/functions/stripe-checkout/index.ts',
});

// Print results
console.log(`${colors.blue}Checks:${colors.reset}\n`);

let passedCount = 0;
checks.forEach((check) => {
  const status = check.passed ? `${colors.green}✓${colors.reset}` : `${colors.red}✗${colors.reset}`;

  console.log(`${status} ${check.name}`);

  if (!check.passed) {
    console.log(`  ${colors.yellow}→ ${check.fix}${colors.reset}`);
  } else {
    passedCount++;
  }
});

console.log(`\n${colors.blue}Summary:${colors.reset}`);
console.log(`${passedCount}/${checks.length} checks passed\n`);

// Overall status
if (passedCount === checks.length) {
  console.log(`${colors.green}✓ Stripe configuration verified!${colors.reset}\n`);
  process.exit(0);
} else {
  console.log(`${colors.yellow}⚠ Some checks failed. See above for details.${colors.reset}\n`);
  console.log(`${colors.blue}Next steps:${colors.reset}`);
  console.log('1. Get test keys from https://dashboard.stripe.com');
  console.log('2. Update .env.local with your keys');
  console.log('3. Run this script again to verify\n');
  process.exit(1);
}
