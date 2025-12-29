-- Correction de l'erreur 406 sur profiles
-- Exécutez dans Supabase SQL Editor

-- 1. Vérifier si le profil existe
SELECT * FROM public.profiles WHERE id = 'd9d1fddb-4900-4552-bd5c-5dcd9c187fb1';

-- 2. Créer le profil s'il n'existe pas
INSERT INTO public.profiles (id, email, full_name, role, status)
VALUES (
  'd9d1fddb-4900-4552-bd5c-5dcd9c187fb1',
  'samakeissa10@outlook.fr',
  'Samuel',
  'user',
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name;

-- 3. Vérifier les policies RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles';

-- 4. Recréer les policies si nécessaires
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- 5. Vérification finale
SELECT id, email, full_name, role, status FROM public.profiles;
