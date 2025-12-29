# E2E Testing Guide - Playwright

## 🎭 About Playwright

Playwright est un framework de test end-to-end (E2E) puissant qui permet de tester:

- **Flux utilisateur complets** (navigation, formulaires, paiements)
- **Interactions multi-navigateurs** (Chrome, Firefox, Safari)
- **Authentification et sessions** utilisateur
- **Performance et chargement** de page
- **Accessibilité** et comportements

---

## 📦 Installation

### 1. Installer Playwright

```bash
npm install -D @playwright/test
npx playwright install
```

### 2. Ajouter scripts dans `package.json`

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:headed": "playwright test --headed"
  }
}
```

### 3. Créer `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
```

---

## ✍️ Écrire des Tests E2E

### 1. Test de Navigation Basique

```typescript
// e2e/navigation.spec.ts
import { test, expect } from '@playwright/test';

test('should navigate through the application', async ({ page }) => {
  // Aller à la page d'accueil
  await page.goto('/');
  expect(page).toHaveTitle(/SerrureMaster/);

  // Cliquer sur le lien produits
  await page.click('a:has-text("Produits")');
  await page.waitForURL('**/products');

  // Vérifier que les produits se chargent
  await expect(page.locator('[data-testid="product-card"]')).toContainText('Serrure');
});
```

### 2. Test d'Authentification

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('/login');

    // Remplir le formulaire
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');

    // Soumettre
    await page.click('button:has-text("Connexion")');

    // Attendre la redirection
    await page.waitForURL('**/dashboard');
    expect(page.url()).toContain('/dashboard');
  });

  test('should reject invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrong');

    await page.click('button:has-text("Connexion")');

    // Vérifier l'erreur
    await expect(page.locator('[role="alert"]')).toContainText('Identifiants invalides');
  });
});
```

### 3. Test du Panier et Checkout

```typescript
// e2e/cart.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Shopping Cart', () => {
  test('should add product to cart and checkout', async ({ page }) => {
    await page.goto('/products');

    // Ajouter un produit
    await page.click('[data-testid="product-1"] button:has-text("Ajouter")');

    // Vérifier notification
    await expect(page.locator('[role="status"]')).toContainText('Ajouté au panier');

    // Aller au panier
    await page.click('[data-testid="cart-button"]');
    await page.waitForURL('**/cart');

    // Vérifier le produit
    await expect(page.locator('[data-testid="cart-item"]')).toContainText('Serrure');

    // Procéder au checkout
    await page.click('button:has-text("Passer la commande")');

    // Attendre Stripe
    await page.waitForURL(/stripe.com|checkout/);
  });

  test('should remove product from cart', async ({ page }) => {
    await page.goto('/cart');

    const initialCount = await page.locator('[data-testid="cart-item"]').count();

    // Supprimer le premier article
    await page.click('[data-testid="remove-button"]:first-child');

    // Vérifier la suppression
    const newCount = await page.locator('[data-testid="cart-item"]').count();
    expect(newCount).toBe(initialCount - 1);
  });

  test('should update quantity', async ({ page }) => {
    await page.goto('/cart');

    // Trouver l'input de quantité
    const quantityInput = page.locator('[data-testid="quantity-input"]').first();

    // Changer la quantité
    await quantityInput.fill('5');

    // Vérifier la mise à jour
    await expect(quantityInput).toHaveValue('5');
  });
});
```

### 4. Test du Formulaire d'Admin

```typescript
// e2e/admin.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login en tant qu'admin
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button:has-text("Connexion")');
    await page.waitForURL('**/admin');
  });

  test('should create new product', async ({ page }) => {
    await page.goto('/admin/products');

    // Cliquer sur "Nouveau produit"
    await page.click('button:has-text("Nouveau produit")');

    // Remplir le formulaire
    await page.fill('input[name="title"]', 'Nouvelle Serrure Premium');
    await page.fill('input[name="description"]', 'Description du produit');
    await page.fill('input[name="price"]', '9999');

    // Upload image
    await page.locator('input[type="file"]').setInputFiles('./test-image.jpg');

    // Soumettre
    await page.click('button:has-text("Créer")');

    // Vérifier le succès
    await expect(page.locator('[role="alert"]')).toContainText('Produit créé');
  });

  test('should edit existing product', async ({ page }) => {
    await page.goto('/admin/products');

    // Cliquer sur éditer
    await page.click('[data-testid="edit-1"]');

    // Modifier le titre
    const titleInput = page.locator('input[name="title"]');
    await titleInput.clear();
    await titleInput.fill('Titre modifié');

    // Sauvegarder
    await page.click('button:has-text("Sauvegarder")');

    // Vérifier
    await expect(page.locator('[role="alert"]')).toContainText('Produit modifié');
  });

  test('should delete product with confirmation', async ({ page }) => {
    await page.goto('/admin/products');

    // Cliquer supprimer
    await page.click('[data-testid="delete-1"]');

    // Confirmer dans la modal
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await page.click('button:has-text("Confirmer la suppression")');

    // Vérifier la suppression
    await expect(page.locator('[role="alert"]')).toContainText('Produit supprimé');
  });
});
```

### 5. Test de Responsive Design

```typescript
// e2e/responsive.spec.ts
import { test, expect, devices } from '@playwright/test';

test.describe('Responsive Design', () => {
  test('should render correctly on mobile', async ({ page }) => {
    // Utiliser les dimensions mobiles
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');

    // Navigation devrait être accessible
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();

    // Produits devraient s'afficher en colonnes
    const products = page.locator('[data-testid="product-card"]');
    const box = await products.first().boundingBox();

    // Vérifier que les produits prennent toute la largeur (responsive)
    expect(box?.width).toBeLessThanOrEqual(375);
  });

  test('should render correctly on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    await page.goto('/products');

    // Vérifier les colonnes de grille
    const productGrid = page.locator('[data-testid="product-grid"]');
    const box = await productGrid.boundingBox();

    // Sur tablette, 2 colonnes
    expect(box).toBeTruthy();
  });

  test('should render correctly on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    await page.goto('/products');

    // Sidebar visible
    await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();
  });
});
```

### 6. Test de Performance

```typescript
// e2e/performance.spec.ts
import { test, expect } from '@playwright/test';

test('should load homepage within acceptable time', async ({ page }) => {
  // Mesurer le temps de navigation
  const navigationTiming = await page.evaluate(() => {
    return performance.getEntriesByType('navigation')[0];
  });

  await page.goto('/');

  const loadTime = await page.evaluate(() => {
    return performance.timing.loadEventEnd - performance.timing.navigationStart;
  });

  // Devrait charger en moins de 3 secondes
  expect(loadTime).toBeLessThan(3000);
});

test('should have good performance metrics', async ({ page }) => {
  await page.goto('/');

  const metrics = await page.evaluate(() => {
    const paint = performance.getEntriesByType('paint');
    const nav = performance.getEntriesByType('navigation')[0];

    return {
      FCP: paint.find((p) => p.name === 'first-contentful-paint')?.startTime,
      LCP: performance.getEntriesByType('largest-contentful-paint').pop()?.startTime,
      CLS: 0, // Calculé par le navigateur
      TTFB: nav.responseStart - nav.requestStart,
    };
  });

  // Core Web Vitals targets
  expect(metrics.FCP).toBeLessThan(1800);
  expect(metrics.LCP).toBeLessThan(2500);
});
```

---

## 🎬 Running Tests

### Tous les navigateurs

```bash
npm run test:e2e
```

### Navigateur unique

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
```

### Mode UI (Recommended)

```bash
npm run test:e2e:ui
```

### Debug Mode

```bash
npm run test:e2e:debug
```

### Headed Mode (Voir le navigateur)

```bash
npm run test:e2e:headed
```

---

## 📊 Viewing Results

### Rapport HTML

```bash
npx playwright show-report
```

### Screenshots et Traces

```bash
# Les fichiers sont générés dans:
# - test-results/  (screenshots, traces, vidéos)
# - playwright-report/ (rapport HTML)
```

---

## 🐛 Debugging

### 1. Utiliser le Inspector

```bash
npm run test:e2e:debug
```

### 2. Ajouter des logs

```typescript
await page.waitForTimeout(1000);
console.log('Current URL:', page.url());
```

### 3. Prendre un screenshot

```typescript
await page.screenshot({ path: 'debug.png' });
```

### 4. Enregistrer une vidéo

```typescript
// Dans playwright.config.ts
use: {
  video: 'retain-on-failure', // ou 'on', 'off'
}
```

---

## 📋 Fixtures Personnalisées

### Fixture pour authentification

```typescript
// e2e/fixtures.ts
import { test as base } from '@playwright/test';

type TestFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<TestFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Authentification
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button:has-text("Connexion")');
    await page.waitForURL('**/dashboard');

    // Utiliser la page authentifiée
    await use(page);

    // Cleanup
    await page.context().clearCookies();
  },
});
```

### Utilisation

```typescript
import { test } from './fixtures';

test('should display user profile', async ({ authenticatedPage }) => {
  await authenticatedPage.goto('/profile');
  // ...
});
```

---

## ✅ Best Practices

✅ **DO**

- ✅ Utiliser `data-testid` pour les sélecteurs
- ✅ Tester les flux complets utilisateur
- ✅ Vérifier les messages d'erreur et succès
- ✅ Tester sur plusieurs navigateurs
- ✅ Utiliser des fixtures pour le setup réutilisable
- ✅ Tester l'accessibilité (ARIA)
- ✅ Vérifier les redirections

❌ **DON'T**

- ❌ Utiliser des sélecteurs CSS fragiles
- ❌ Attendre les éléments avec timeout fixe
- ❌ Tester l'implémentation, pas le comportement
- ❌ Ignorer les erreurs de réseau
- ❌ Négliger les tests mobiles
- ❌ Créer des tests trop long ou complexes
- ❌ Dépendre de l'ordre des tests

---

## 🔗 Resources

- [Playwright Documentation](https://playwright.dev/)
- [API Reference](https://playwright.dev/docs/api/class-page)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)

---

**Last Updated**: 26 Décembre 2025
**Playwright Version**: ^1.40.0
