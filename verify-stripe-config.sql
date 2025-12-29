-- Vérification de la configuration Stripe
SELECT 
  id,
  title,
  price,
  stripe_price_id
FROM public.products 
ORDER BY 
  CASE WHEN id = 'p5_survival_kit' THEN 1 ELSE 2 END,
  id;
