# Testing Guide - SerrureMaster

## 📋 Overview

Ce projet utilise **Vitest** comme framework de test principal, avec **@testing-library/react** pour les tests de composants.

### Outils

- **Vitest** - Framework de test ultrarapide (V8 compatible)
- **@testing-library/react** - Testing utilities pour composants React
- **@testing-library/user-event** - Simulation d'interactions utilisateur
- **jsdom** - DOM virtuel pour tests navigateur

---

## 🚀 Quick Start

### Installation des dépendances

```bash
npm install
```

Les packages de test sont automatiquement inclus dans `package.json`.

### Lancer les tests

```bash
# Mode watch (recommandé pour développement)
npm test

# Mode UI (interface visuelle)
npm test:ui

# Couverture de code
npm test:coverage
```

---

## 📁 Structure des Tests

```
__tests__/
├── types.test.ts        # Tests des types TypeScript
├── components.test.tsx  # Tests des composants React
├── utils.test.ts        # Tests des fonctions utilitaires
├── services.test.ts     # Tests des services API
└── integration.test.ts  # Tests d'intégration
```

---

## ✍️ Écrire des Tests

### 1. Tests Unitaires - Fonctions Utilitaires

```typescript
import { describe, it, expect } from 'vitest';

describe('calculatePrice', () => {
  it('should calculate price correctly', () => {
    const result = calculatePrice(100, 0.1);
    expect(result).toBe(110);
  });

  it('should handle edge cases', () => {
    expect(calculatePrice(0, 0)).toBe(0);
    expect(calculatePrice(-10, 0.1)).toBe(-9);
  });
});
```

### 2. Tests de Composants

```typescript
import { render, screen } from '@testing-library/react';
import { ProductCard } from '../components/ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    id: 'p1',
    title: 'Test Product',
    description: 'Test',
    price: 100,
    features: [],
    type: 'PDF',
    image: 'url',
    stripePriceId: 'price_123',
  };

  it('should render product information', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('should handle click events', async () => {
    const user = userEvent.setup();
    render(<ProductCard product={mockProduct} />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(button).toHaveTextContent('Added');
  });
});
```

### 3. Tests d'Intégration

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { ProductProvider } from '../contexts/ProductContext';
import { ProductCard } from '../components/ProductCard';

describe('ProductCard with Provider', () => {
  it('should load and display product from context', async () => {
    render(
      <ProductProvider>
        <ProductCard productId="p1" />
      </ProductProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Product Title')).toBeInTheDocument();
    });
  });
});
```

### 4. Tests avec Mocks

```typescript
import { vi } from 'vitest';
import { render } from '@testing-library/react';

describe('Component with API call', () => {
  it('should call API on mount', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ data: [] }),
    });
    global.fetch = mockFetch;

    render(<MyComponent />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });
  });
});
```

---

## 🎯 Best Practices

### ✅ DO

- ✅ Tester le comportement, pas l'implémentation
- ✅ Utiliser les sélecteurs `getByRole`/`getByLabelText`
- ✅ Garder les tests simples et focalisés
- ✅ Nommer les tests de façon descriptive
- ✅ Isoler chaque test (pas de dépendances)
- ✅ Tester les cas limites et erreurs

### ❌ DON'T

- ❌ Tester les détails d'implémentation
- ❌ Utiliser des sélecteurs CSS fragiles
- ❌ Créer des tests trop complexes
- ❌ Négliger les cas d'erreur
- ❌ Oublier de cleanup après tests
- ❌ Utiliser des délais fixes (setTimeout)

---

## 📊 Coverage Targets

Objectifs de couverture de code:

| Métrique       | Target |
| -------------- | ------ |
| **Lines**      | 80%    |
| **Functions**  | 80%    |
| **Branches**   | 80%    |
| **Statements** | 80%    |

Vérifier la couverture:

```bash
npm test:coverage
```

---

## 🔍 Debugging Tests

### Mode Watch

```bash
npm test -- --watch
```

### Tests Spécifiques

```bash
npm test -- --grep "ProductCard"
npm test -- products.test.tsx
```

### Mode Debug Détaillé

```bash
npm test -- --reporter=verbose
```

### UI Interactive

```bash
npm test:ui
```

---

## 📚 Common Patterns

### Testing Custom Hooks

```typescript
import { renderHook, act } from '@testing-library/react';
import { useCart } from '../hooks/useCart';

describe('useCart', () => {
  it('should add item to cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct);
    });

    expect(result.current.items).toHaveLength(1);
  });
});
```

### Testing Context

```typescript
const TestWrapper = ({ children }) => (
  <CartProvider>
    <ProductProvider>{children}</ProductProvider>
  </CartProvider>
);

render(<MyComponent />, { wrapper: TestWrapper });
```

### Testing Async Operations

```typescript
import { waitFor } from '@testing-library/react';

it('should handle async data', async () => {
  render(<AsyncComponent />);

  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument();
  });
});
```

---

## 🚦 Test-Driven Development (TDD)

### Workflow recommandé

1. **Red** - Écrire un test qui échoue
2. **Green** - Écrire le code minimal pour le passer
3. **Refactor** - Nettoyer et optimiser

```bash
# 1. Créer le test
touch __tests__/feature.test.ts
# Écrire le test (sera rouge)

# 2. Implémenter
npm test -- feature.test.ts  # Watch mode
# Implémenter jusqu'au vert

# 3. Refactoriser
npm test:coverage
# Améliorer la qualité
```

---

## ⚙️ Configuration

### vitest.config.ts

```typescript
{
  test: {
    globals: true,           // Pas besoin d'importer describe, it, expect
    environment: 'jsdom',    // DOM virtuel
    setupFiles: ['vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80
    }
  }
}
```

### vitest.setup.ts

Contient:

- Cleanup après chaque test
- Mocks globaux (ResizeObserver, matchMedia)
- Configuration des librairies de test

---

## 📈 CI/CD Integration

### GitHub Actions (recommandé)

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v3
```

---

## 🐛 Troubleshooting

### Tests lents

- Vérifier les mocks (éviter les vraies API calls)
- Réduire les timeouts
- Paraллелiser les tests: `npm test -- --reporter=verbose --bail`

### DOM errors

- Vérifier le cleanup dans `vitest.setup.ts`
- Utiliser `@testing-library/react` cleanup
- Éviter les effectifs secondaires

### Mock issues

- Vérifier que `vi.fn()` est importé de `vitest`
- Bien restore les mocks: `vi.clearAllMocks()`
- Utiliser `beforeEach` pour setup

---

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Docs](https://testing-library.com/react)
- [Vitest UI](https://vitest.dev/guide/ui.html)
- [Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## ✅ Checklist pour Nouveaux Tests

- [ ] Test file créé dans `__tests__/`
- [ ] Imports corrects de vitest et testing-library
- [ ] Describe block descriptif
- [ ] Tests nommés clairement
- [ ] Mocks configurés si nécessaire
- [ ] Cleanup automatique (vitest.setup.ts)
- [ ] Coverage > 80%
- [ ] Tests passent en CI/CD

---

**Last Updated**: 26 Décembre 2025
**Vitest Version**: ^1.0.0
