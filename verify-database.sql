-- 🔍 VÉRIFICATION DE LA BASE DE DONNÉES
-- Exécutez ce script dans Supabase SQL Editor pour vérifier que tout est OK

-- 1. Vérifier les IDs et Price IDs des produits
SELECT 
  id, 
  title, 
  price,
  stripe_price_id,
  CASE 
    WHEN stripe_price_id LIKE 'price_1Si%' THEN '✅ Bon Price ID'
    ELSE '❌ Mauvais Price ID'
  END as status
FROM products 
ORDER BY id;

-- 2. Vérifier votre profil utilisateur
SELECT id, email, role, status
FROM profiles
WHERE email = 'samakeissa10@outlook.fr';

-- 3. Compter les produits
SELECT COUNT(*) as total_products FROM products;

-- ✅ Résultat attendu:
-- - 6 produits avec IDs : p1, p2, p3, p4, p5, p6
-- - Tous les stripe_price_id commencent par 'price_1Si'
-- - Votre profil existe avec role = 'admin'
