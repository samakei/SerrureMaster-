-- ==========================================
-- FIX PROFILS SUPABASE (IDEMPOTENT)
-- Objectif:
-- 1) Créer/mettre à jour la fonction trigger de création de profil automatique
-- 2) Recréer le trigger sur auth.users
-- 3) Backfill des utilisateurs déjà existants sans profil
-- ==========================================

BEGIN;

-- 1) Fonction trigger (idempotente)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'user',
    'active'
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = COALESCE(public.profiles.full_name, EXCLUDED.full_name);

  RETURN NEW;
END;
$$;

-- 2) Trigger (idempotent)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE PROCEDURE public.handle_new_user();

-- 3) Backfill profils manquants
INSERT INTO public.profiles (id, email, full_name, role, status)
SELECT
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)) AS full_name,
  'user' AS role,
  'active' AS status
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

COMMIT;

-- 4) Vérifications (optionnel)
-- Trigger présent ?
-- SELECT tgname FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- Comptage profils vs auth.users
-- SELECT
--   (SELECT count(*) FROM auth.users) AS auth_users,
--   (SELECT count(*) FROM public.profiles) AS profiles;
