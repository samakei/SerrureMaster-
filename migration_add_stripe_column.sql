-- ==========================================
-- MIGRATION : Ajout de la colonne stripe_price_id
-- À exécuter AVANT le script update-stripe-prices.sql
-- ==========================================

-- Ajouter la colonne stripe_price_id si elle n'existe pas
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS stripe_price_id text;

-- Vérification de la structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
  AND table_schema = 'public';
