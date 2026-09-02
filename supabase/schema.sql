create table leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) default auth.uid(),
  name text not null,
  company text not null,
  need text not null,
  notes text,
  score int not null,
  temperature text not null,
  reason text not null,
  message text not null,
  next_follow_up_at date,
  created_at timestamptz not null default now()
);

alter table leads enable row level security;

create policy "Users manage own leads"
  on leads for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update, delete on public.leads to authenticated;
grant select on public.leads to service_role;

create table prospects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) default auth.uid(),
  company_name text not null,
  website text,
  location text,
  industry text,
  company_size text,
  decision_maker_name text,
  decision_maker_role text,
  prospect_score int not null,
  score_reason text not null,
  outreach_message text not null,
  source_urls jsonb not null default '[]',
  created_at timestamptz not null default now()
);

alter table prospects enable row level security;

create policy "Users manage own prospects"
  on prospects for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update, delete on public.prospects to authenticated;
