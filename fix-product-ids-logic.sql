-- 🔧 CORRECTION DE LA NUMÉROTATION LOGIQUE DES PRODUITS
-- Exécutez ce script dans Supabase SQL Editor AVANT les autres scripts
-- 
-- Problème: p1, p2, p3 → saute à p6, p7, puis p5
-- Solution: Renommer pour avoir p1, p2, p3, p4, p5, p6 (ordre logique)
--
-- ⚠️ IMPORTANT: Exécutez ce script EN PREMIER avant update-real-stripe-prices.sql

-- Étape 1: Renommer temporairement pour éviter les conflits
UPDATE products SET id = 'temp_p1' WHERE id = 'p1_door_slammed';
UPDATE products SET id = 'temp_p2' WHERE id = 'p2_key_broken';
UPDATE products SET id = 'temp_p3' WHERE id = 'p3_cylinder_replace';
UPDATE products SET id = 'temp_p4' WHERE id = 'p4_security_pack';
UPDATE products SET id = 'temp_p5' WHERE id = 'p5_audit_security';
UPDATE products SET id = 'temp_p6' WHERE id = 'p6_survival_kit';

-- Étape 2: Appliquer les nouveaux IDs définitifs
UPDATE products SET id = 'p1_door_slammed' WHERE id = 'temp_p1';
UPDATE products SET id = 'p2_key_broken' WHERE id = 'temp_p2';
UPDATE products SET id = 'p3_cylinder_replace' WHERE id = 'temp_p3';
UPDATE products SET id = 'p4_security_pack' WHERE id = 'temp_p4';
UPDATE products SET id = 'p5_audit_security' WHERE id = 'temp_p5';
UPDATE products SET id = 'p6_survival_kit' WHERE id = 'temp_p6';

-- Vérification: Afficher tous les produits dans l'ordre
SELECT id, title, price FROM products ORDER BY id;

-- ✅ Résultat attendu:
-- p1_door_slammed
-- p2_key_broken
-- p3_cylinder_replace
-- p4_security_pack (anciennement p6)
-- p5_audit_security (anciennement p7)
-- p6_survival_kit (anciennement p5)
