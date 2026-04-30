-- ==========================================
-- PHASE 1 : Sécurisation des accès contenu
-- - journalisation des accès/téléchargements
-- - base prête pour les liens signés backend
-- ==========================================

create extension if not exists "uuid-ossp";

create table if not exists public.download_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete set null,
  product_id text references public.products(id) on delete set null,
  file_name text,
  file_path text,
  access_type text not null default 'pdf' check (access_type in ('pdf', 'video', 'asset')),
  decision text not null check (decision in ('granted', 'denied', 'error')),
  reason text,
  source text not null default 'secure-download-link',
  ip text,
  user_agent text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create index if not exists idx_download_logs_user_created_at
  on public.download_logs(user_id, created_at desc);

create index if not exists idx_download_logs_product_created_at
  on public.download_logs(product_id, created_at desc);

alter table public.download_logs enable row level security;

create policy if not exists "Users can view own download logs"
  on public.download_logs for select
  using (auth.uid() = user_id);

-- Vérification
select id, user_id, product_id, access_type, decision, created_at
from public.download_logs
order by created_at desc
limit 20;
