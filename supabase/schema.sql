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
  size_source text,
  company_email text,
  company_email_source text,
  decision_maker_name text,
  decision_maker_role text,
  decision_maker_email text,
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

alter table leads add column status text not null default 'Yeni';

create table outreach_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) default auth.uid(),
  prospect_id uuid references prospects(id),
  lead_id uuid references leads(id),
  recipient_email text not null,
  subject text not null,
  body text not null,
  status text not null default 'draft',
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

alter table outreach_messages enable row level security;

create policy "Users manage own outreach_messages"
  on outreach_messages for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update, delete on public.outreach_messages to authenticated;

create table suppression_list (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) default auth.uid(),
  email text not null,
  reason text,
  created_at timestamptz not null default now(),
  unique (user_id, email)
);

alter table suppression_list enable row level security;

create policy "Users manage own suppression_list"
  on suppression_list for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update, delete on public.suppression_list to authenticated;
