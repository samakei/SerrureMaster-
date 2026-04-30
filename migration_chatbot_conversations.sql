-- ==========================================
-- Journalisation légale des conversations chatbot
-- SerrureMaster - traçabilité litige
-- ==========================================

create extension if not exists "uuid-ossp";

create table if not exists public.chatbot_conversations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete set null,
  message text not null,
  response text not null,
  is_customer boolean not null default false,
  is_non_compatible_case boolean not null default false,
  rule_trigger text,
  model text,
  error_message text,
  ip text,
  user_agent text,
  created_at timestamp with time zone not null default timezone('utc'::text, now())
);

create index if not exists idx_chatbot_conversations_created_at
  on public.chatbot_conversations(created_at desc);

create index if not exists idx_chatbot_conversations_user_created_at
  on public.chatbot_conversations(user_id, created_at desc);

alter table public.chatbot_conversations enable row level security;

drop policy if exists "Admins can view all chatbot conversations"
  on public.chatbot_conversations;

create policy "Admins can view all chatbot conversations"
  on public.chatbot_conversations
  for select
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'admin'
    )
  );

drop policy if exists "Users can view own chatbot conversations"
  on public.chatbot_conversations;

create policy "Users can view own chatbot conversations"
  on public.chatbot_conversations
  for select
  using (auth.uid() = user_id);
