-- ==========================================
-- SCRIPT DE RÉINITIALISATION COMPLÈTE
-- SERRUREMASTER + STRIPE INTEGRATION
-- ==========================================
-- ⚠️ ATTENTION : Ce script supprime et recrée toutes les tables
-- ⚠️ Les données utilisateurs seront préservées (profiles)
-- ==========================================

-- Activer l'extension UUID
create extension if not exists "uuid-ossp";

-- ==========================================
-- SUPPRESSION DES ANCIENNES TABLES (dans l'ordre des dépendances)
-- ==========================================
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop table if exists public.user_products cascade;
drop table if exists public.testimonials cascade;
drop table if exists public.products cascade;
drop table if exists public.profiles cascade;

-- ==========================================
-- CRÉATION DES TABLES
-- ==========================================

-- 1. Table des Profils (Extension de auth.users)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  role text default 'user' check (role in ('user', 'admin')),
  status text default 'active' check (status in ('active', 'blocked')),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Table des Produits (Catalogue) - AVEC STRIPE
create table public.products (
  id text primary key,
  title text not null,
  description text,
  price integer not null check (price >= 0),
  original_price integer,
  image text,
  stripe_price_id text not null, -- ⚡ ID du prix Stripe (obligatoire)
  type text default 'bundle',
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Table de liaison Achats (Qui a acheté quoi)
create table public.user_products (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  product_id text references public.products(id) on delete cascade not null,
  purchased_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id, product_id)
);

-- 4. Table des Témoignages
create table public.testimonials (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  role text,
  text text not null,
  rating integer check (rating >= 1 and rating <= 5),
  approved boolean default false,
  source text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- ==========================================
-- SÉCURITÉ (Row Level Security)
-- ==========================================
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.user_products enable row level security;
alter table public.testimonials enable row level security;

-- POLICIES : Produits (lecture publique)
create policy "Public products read" 
  on public.products for select 
  using (true);

-- POLICIES : Témoignages (lecture publique si approuvés)
create policy "Public testimonials read" 
  on public.testimonials for select 
  using (approved = true);

-- POLICIES : Profils (lecture de son propre profil)
create policy "Users can view own profile" 
  on public.profiles for select 
  using (auth.uid() = id);

create policy "Users can update own profile" 
  on public.profiles for update 
  using (auth.uid() = id);

-- POLICIES : Achats (lecture de ses propres achats)
create policy "Users can view own purchases" 
  on public.user_products for select 
  using (auth.uid() = user_id);

-- ==========================================
-- TRIGGER : Création automatique du profil
-- ==========================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id, 
    new.email, 
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ==========================================
-- DONNÉES INITIALES : Produits avec Price IDs Stripe
-- ==========================================
insert into public.products (id, title, description, price, original_price, image, stripe_price_id, type) values
(
  'p1_door_slammed', 
  'Urgence : Porte Claquee',
  'La methode professionnelle pour diagnostiquer et tenter ouverture porte claquee sans cle sans percage.',
  100,
  500,
  'https://images.unsplash.com/photo-1558002038-1091a1661116',
  'price_1SiPxGDs1RajryhDI67AEulE',
  'bundle'
),
(
  'p2_key_broken',
  'Cle Cassee dans le Barillet',
  'Avant appeler un serrurier decouvrez comment tenter une extraction securisee du morceau casse.',
  100,
  500,
  'https://images.unsplash.com/photo-1589829085413-56de8ae18c73',
  'price_1SiQ6RDs1RajryhDOqqWBLm1',
  'bundle'
),
(
  'p3_cylinder_replace',
  'Remplacer son Cylindre',
  'Guide essentiel pour changer un cylindre standard soi-meme sans erreur de mesure.',
  100,
  500,
  'https://images.unsplash.com/photo-1581092160562-40aa08e78837',
  'price_1SiQBSDs1RajryhDzxFr1t86',
  'video'
),
(
  'p4_security_pack',
  'Changer sa Serrure en 15 min',
  'Remplacez votre serrure sans payer de main oeuvre avec un modele certifie.',
  100,
  500,
  'https://images.unsplash.com/photo-1454694220579-9d6672b5ec3a',
  'price_1SiQFaDs1RajryhDS8jfoNIm',
  'bundle'
),
(
  'p5_audit_security',
  'Audit Securite et Renforcement',
  'Ameliorez jusqua 80 pourcent de votre securite sans blindage ni gros travaux.',
  100,
  500,
  'https://images.unsplash.com/photo-1519449419163-5a39223793e5',
  'price_1SiQKMDs1RajryhDsu55why0',
  'bundle'
),
(
  'p6_survival_kit',
  'Pack : Le Kit de Survie',
  'La liste exacte du materiel professionnel utile pour gerer 90 pourcent des problemes courants.',
  29,
  145,
  'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8',
  'price_1SiQN7Ds1RajryhD1bnlfKel',
  'bundle'
);
