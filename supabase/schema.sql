create table profiles (
  id uuid references auth.users(id) primary key,
  username text unique not null,
  created_at timestamp with time zone default now()
);

create policy "Allow insert for authenticated users"
on profiles
for insert
to authenticated
with check (auth.uid() = id);

create policy "Allow select for authenticated users"
on profiles
for select
to authenticated
using (auth.uid() = id);
