# AdVault

AdVault is an AI-powered SaaS platform that lets life insurance agents and agencies generate high-converting ad campaigns across social media, Google Search, and email in seconds — using Claude AI as the generation engine.

## Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier works)
- An [Anthropic](https://console.anthropic.com) API key

## Local Setup

1. **Clone and install**

   ```bash
   git clone <repo-url> advault
   cd advault
   npm install
   ```

2. **Set environment variables**

   Create `.env.local` in the project root:

   ```
   ANTHROPIC_API_KEY=sk-ant-...
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ```

3. **Run the Supabase schema SQL** (see below) in your Supabase project's SQL Editor.

4. **Start the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Supabase Schema SQL

Run this in your Supabase SQL Editor:

```sql
create table campaigns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  product text not null,
  audience text not null,
  selling_points text,
  cta text,
  tone text not null,
  channels text[] not null,
  output jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table campaigns enable row level security;

create policy "Users own their campaigns"
  on campaigns for all
  using (auth.uid() = user_id);

-- Required for the "Delete account" feature in Settings
create or replace function delete_user()
returns void
language plpgsql
security definer
as $$
begin
  delete from auth.users where id = auth.uid();
end;
$$;
```

## Deploy to Vercel

1. Push your code to GitHub.
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Add all four environment variables in the Vercel dashboard under **Settings → Environment Variables**:
   - `ANTHROPIC_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy. Vercel auto-detects Next.js — no additional configuration needed.
