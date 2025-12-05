-- Create the posts table
create table posts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  content text not null,
  author text not null,
  handle text not null,
  likes bigint default 0,
  comments bigint default 0,
  shares bigint default 0
);

-- Set up Row Level Security (RLS)
alter table posts enable row level security;

-- Create a policy that allows anyone to read posts
create policy "Public posts are viewable by everyone"
on posts for select
to public
using (true);

-- Create a policy that allows authenticated users to insert posts
create policy "Authenticated users can insert posts"
on posts for insert
to authenticated
with check (true);
