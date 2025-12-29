-- Mise à jour des images des produits (depuis public/images/)
-- 1. Copiez vos images dans le dossier: public/images/
-- 2. Nommez-les: p1.jpg, p2.jpg, p3.jpg, p4.jpg, p5.jpg, p6.jpg
-- 3. Exécutez ce script dans Supabase SQL Editor

-- p1_door_slammed - Urgence : Porte Claquée
UPDATE products 
SET image = '/images/p1.jpg'
WHERE id = 'p1_door_slammed';

-- p2_key_broken - Clé Cassée dans le Barillet
UPDATE products 
SET image = '/images/p2.jpg' 
WHERE id = 'p2_key_broken';

-- p3_cylinder_replace - Remplacer son Cylindre
UPDATE products 
SET image = '/images/p3.jpg' 
WHERE id = 'p3_cylinder_replace';

-- p4_security_pack - Changer sa Serrure en 15 min
UPDATE products 
SET image = '/images/p4.jpg' 
WHERE id = 'p4_security_pack';

-- p5_audit_security - Audit Sécurité & Renforcement
UPDATE products 
SET image = '/images/p5.jpg' 
WHERE id = 'p5_audit_security';

-- p6_survival_kit - Pack : Le Kit de Survie
UPDATE products 
SET image = '/images/p6.jpg' 
WHERE id = 'p6_survival_kit';

-- Vérification des images
SELECT id, title, image FROM products ORDER BY id;
