-- ==========================================
-- MIGRATION SÉCURISÉE : Ajout de stripe_price_id
-- ⚠️ Ce script NE SUPPRIME RIEN
-- ==========================================

-- 1. Ajouter la colonne si elle n'existe pas
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS stripe_price_id text;

-- 2. Mettre à jour les Price IDs existants
UPDATE products SET stripe_price_id = 'price_1PqXyZA2eZvKYlo2kR9uWq5a' WHERE id = 'p1_door_slammed';
UPDATE products SET stripe_price_id = 'price_1PqXzQB2eZvKYlo2mL8vTq4b' WHERE id = 'p2_key_broken';
UPDATE products SET stripe_price_id = 'price_1PqY1RC2eZvKYlo2nN7wUr3c' WHERE id = 'p3_cylinder_replace';
UPDATE products SET stripe_price_id = 'price_1PqY2SD2eZvKYlo2oP6xVs2d' WHERE id = 'p4_security_pack';
UPDATE products SET stripe_price_id = 'price_1PqY3TE2eZvKYlo2qR5yWt1e' WHERE id = 'p5_audit_security';
UPDATE products SET stripe_price_id = 'price_1PqY4UF2eZvKYlo2rS4zXu0f' WHERE id = 'p6_survival_kit';

-- 3. Insérer les produits manquants (si ils n'existent pas)
INSERT INTO public.products (id, title, description, price, image, stripe_price_id)
VALUES 
  ('p1_door_slammed', 'Urgence : Porte Claquée', 'La méthode professionnelle pour diagnostiquer et tenter l''ouverture d''une porte claquée', 100, 'https://images.unsplash.com/photo-1558002038-1091a1661116', 'price_1PqXyZA2eZvKYlo2kR9uWq5a'),
  ('p2_key_broken', 'Clé Cassée dans le Barillet', 'Avant d''appeler un serrurier, découvrez comment tenter une extraction sécurisée', 100, 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73', 'price_1PqXzQB2eZvKYlo2mL8vTq4b'),
  ('p3_cylinder_replace', 'Remplacer son Cylindre', 'Guide essentiel pour changer un cylindre standard soi-même', 100, 'https://images.unsplash.com/photo-1581092160562-40aa08e78837', 'price_1PqY1RC2eZvKYlo2nN7wUr3c'),
  ('p4_security_pack', 'Changer sa Serrure en 15 min', 'Remplacez votre serrure sans payer de main-d''œuvre', 100, 'https://images.unsplash.com/photo-1454694220579-9d6672b5ec3a', 'price_1PqY2SD2eZvKYlo2oP6xVs2d'),
  ('p5_audit_security', 'Audit Sécurité & Renforcement', 'Améliorez jusqu''à 80 % de votre sécurité', 100, 'https://images.unsplash.com/photo-1519449419163-5a39223793e5', 'price_1PqY3TE2eZvKYlo2qR5yWt1e'),
  ('p6_survival_kit', 'Pack : Le Kit de Survie', 'La liste exacte du matériel professionnel utile', 29, 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8', 'price_1PqY4UF2eZvKYlo2rS4zXu0f')
ON CONFLICT (id) DO UPDATE SET
  stripe_price_id = EXCLUDED.stripe_price_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image = EXCLUDED.image;

-- 4. Vérification
SELECT id, title, price, stripe_price_id 
FROM public.products 
ORDER BY id;
