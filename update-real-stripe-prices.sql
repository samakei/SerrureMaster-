-- Mise à jour des vrais Price IDs Stripe
-- Exécutez dans Supabase SQL Editor

UPDATE products SET stripe_price_id = 'price_1SzwJYDLe2Jjixn4bGhLFxMs' WHERE id = 'p1_door_slammed';
UPDATE products SET stripe_price_id = 'price_1SzwMADLe2Jjixn4bdikMh7z' WHERE id = 'p2_key_broken';
UPDATE products SET stripe_price_id = 'price_1SzwP9DLe2Jjixn4iAbpOT2s' WHERE id = 'p3_cylinder_replace';
UPDATE products SET stripe_price_id = 'price_1SzwU0DLe2Jjixn4zjdvNRCF' WHERE id = 'p4_security_pack';
UPDATE products SET stripe_price_id = 'price_1SzwX4DLe2Jjixn43RCnyVLi' WHERE id = 'p5_audit_security';
UPDATE products SET stripe_price_id = 'price_1SzweODLe2Jjixn4T2MzkBD3' WHERE id = 'p6_survival_kit';

-- Vérification
SELECT id, title, price, stripe_price_id FROM products ORDER BY id;
