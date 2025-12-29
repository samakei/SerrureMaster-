-- Promotion en ADMIN
-- Exécutez dans Supabase SQL Editor

-- 1. Mettre à jour votre rôle en admin
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'samakeissa10@outlook.fr';

-- 2. Vérifier la mise à jour
SELECT id, email, full_name, role, status 
FROM public.profiles 
WHERE email = 'samakeissa10@outlook.fr';

-- 3. Si le profil n'existe pas encore, le créer en tant qu'admin
INSERT INTO public.profiles (id, email, full_name, role, status)
VALUES (
  'd9d1fddb-4900-4552-bd5c-5dcd9c187fb1',
  'samakeissa10@outlook.fr',
  'Samuel (Admin)',
  'admin',
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  full_name = 'Samuel (Admin)';

-- 4. Afficher tous les admins
SELECT email, role FROM public.profiles WHERE role = 'admin';
