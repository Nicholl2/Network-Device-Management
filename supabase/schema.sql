
create table if not exists devices (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  ip_address text,
  mac_address text unique,
  device_type text,
  status text default 'offline',
  last_seen timestamp with time zone,
  created_by uuid references auth.users(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create policy "Allow read devices for authenticated users"
on devices
for select
to authenticated
using (true);

create policy "Allow insert devices for authenticated users"
on devices
for insert
to authenticated
with check (auth.uid() = created_by);

create policy "Allow update devices for creator"
on devices
for update
to authenticated
using (auth.uid() = created_by);

create policy "Allow delete devices for creator"
on devices
for delete
to authenticated
using (auth.uid() = created_by);