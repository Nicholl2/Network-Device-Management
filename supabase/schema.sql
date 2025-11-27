
alter table devices add column if not exists manufacturer text;
alter table devices add column if not exists model text;
alter table devices add column if not exists assigned_to uuid references auth.users(id);
alter table devices add column if not exists template_id uuid;

alter table devices drop column if exists status;
alter table devices add column status text default 'stock' check (status IN ('dipakai', 'rusak', 'stock'));

create table if not exists device_templates (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  created_by uuid references auth.users(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  
  show_device_name boolean default true,
  require_device_name boolean default true,
  
  show_ip_address boolean default true,
  require_ip_address boolean default true,
  
  show_mac_address boolean default true,
  require_mac_address boolean default true,
  
  show_device_type boolean default true,
  require_device_type boolean default true,
  
  show_status boolean default true,
  require_status boolean default true,
  
  show_manufacturer boolean default true,
  require_manufacturer boolean default false,
  
  show_model boolean default true,
  require_model boolean default false,
  
  show_assigned_to boolean default true,
  require_assigned_to boolean default false,
  
  is_default boolean default false
);

create policy "Allow read templates for authenticated users"
on device_templates
for select
to authenticated
using (true);

create policy "Allow insert templates for authenticated users"
on device_templates
for insert
to authenticated
with check (auth.uid() = created_by);

create policy "Allow update templates for creator"
on device_templates
for update
to authenticated
using (auth.uid() = created_by);

create policy "Allow delete templates for creator"
on device_templates
for delete
to authenticated
using (auth.uid() = created_by);

create policy "Allow read own assigned devices"
on devices
for select
to authenticated
using (assigned_to = auth.uid() OR true);

using (auth.uid() = created_by OR assigned_to = auth.uid());