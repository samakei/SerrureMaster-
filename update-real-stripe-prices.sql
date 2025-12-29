-- Mise à jour des vrais Price IDs Stripe
-- Exécutez dans Supabase SQL Editor

UPDATE products SET stripe_price_id = 'price_1SiPxGDs1RajryhDI67AEulE' WHERE id = 'p1_door_slammed';
UPDATE products SET stripe_price_id = 'price_1SiQ6RDs1RajryhDOqqWBLm1' WHERE id = 'p2_key_broken';
UPDATE products SET stripe_price_id = 'price_1SiQBSDs1RajryhDzxFr1t86' WHERE id = 'p3_cylinder_replace';
UPDATE products SET stripe_price_id = 'price_1SiQFaDs1RajryhDS8jfoNIm' WHERE id = 'p4_security_pack';
UPDATE products SET stripe_price_id = 'price_1SiQKMDs1RajryhDsu55why0' WHERE id = 'p5_audit_security';
UPDATE products SET stripe_price_id = 'price_1SiQN7Ds1RajryhD1bnlfKel' WHERE id = 'p6_survival_kit';

-- Vérification
SELECT id, title, price, stripe_price_id FROM products ORDER BY id;
