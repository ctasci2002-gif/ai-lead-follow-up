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
