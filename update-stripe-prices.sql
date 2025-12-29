-- Mise à jour des Price IDs Stripe dans la base de données Supabase
-- À exécuter dans le SQL Editor de Supabase Dashboard

UPDATE products SET stripe_price_id = 'price_1PqXyZA2eZvKYlo2kR9uWq5a' WHERE id = 'p1_door_slammed';
UPDATE products SET stripe_price_id = 'price_1PqXzQB2eZvKYlo2mL8vTq4b' WHERE id = 'p2_key_broken';
UPDATE products SET stripe_price_id = 'price_1PqY1RC2eZvKYlo2nN7wUr3c' WHERE id = 'p3_cylinder_replace';
UPDATE products SET stripe_price_id = 'price_1PqY2SD2eZvKYlo2oP6xVs2d' WHERE id = 'p6_security_pack';
UPDATE products SET stripe_price_id = 'price_1PqY3TE2eZvKYlo2qR5yWt1e' WHERE id = 'p7_audit_security';
UPDATE products SET stripe_price_id = 'price_1PqY4UF2eZvKYlo2rS4zXu0f' WHERE id = 'p5_survival_kit';

-- Vérification
SELECT id, title, price, stripe_price_id FROM products ORDER BY id;
