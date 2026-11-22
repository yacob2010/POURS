# Pours

*Every glass, remembered.*

A personal wine tracker, with cocktail recipes on the way. Log what you drink, rate it, add tasting notes, and find it again later. Your data lives in your account, so it's there on any device.

## Roadmap

### Done
- [x] Wine library with ratings, notes, and descriptors
- [x] Accounts and sync with Supabase
- [x] Live on GitHub Pages
- [x] Sidebar and Stats page
- [x] Blend wine type, Escape closes dialogs

### Phase 1: Library for wines and liquors
- [x] Add category and brand columns to the database
- [x] Category picker in the add/edit form (Wine, Liquor, Drink)
- [x] Types and sub-types that change with the category
- [x] Vintage hidden for liquor and drinks, brand for liquor only
- [x] Category filter on the Library page
- [x] Sort direction toggle
- [x] Brand shown on cards and the detail view

### Phase 2: Stats by category
- [ ] Collapsible sections per category, with wine split into red, white, and sparkling
- [ ] Total, average rating, average price, and price range for each
- [ ] Overall summary at the top

### Phase 3: Recipes
- [ ] Recipes table, form, and detail view (ingredients, method, glass, rating, notes)
- [ ] Link recipe ingredients to bottles in the Library

### Phase 4: Settings
- [ ] Change password
- [ ] Theme choice
- [ ] Export

### Phase 5: Home dashboard
- [ ] Search across wines, liquors, and recipes
- [ ] Quick add buttons

### Loose ends
- [ ] Set the Supabase Site URL
- [ ] Turn email confirmation back on before sharing the app

## Features

- Email and password accounts, with data kept per user
- Wine library with search, type filter, and sorting (date added, name, rating, price, tasting date)
- Add and edit wines: type, sub-type, region, vintage, price, tasting date, 1–10 rating, descriptors, and notes
- Custom "Other…" entries for types, sub-types, regions, and descriptors, saved to your account
- Light (off-white) and dark (burgundy) themes

## Tech stack

- React 18 and TypeScript, built with Vite
- Tailwind CSS v4 and shadcn/ui (Radix)
- Supabase for auth and the Postgres database, with row-level security so each user only sees their own rows

## Getting started

You'll need Node.js and a free [Supabase](https://supabase.com) project.

1. Install dependencies:

   ```
   npm install
   ```

2. Create a file named `.env.local` in the project root:

   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   ```

   Use the Project URL and the **publishable** key from Project Settings → API Keys. Never put the secret key in this project. `.env.local` is git-ignored.

3. Set up the database (see below).

4. Start the dev server:

   ```
   npm run dev
   ```

Vite reads `.env.local` only on startup, so restart the dev server after changing it.

## Database setup

In the Supabase dashboard, open SQL Editor, paste the SQL below, and run it.

<details>
<summary>Schema SQL</summary>

```sql
create table public.wines (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  type text,
  sub_type text,
  region text,
  vintage int,
  rating int check (rating between 1 and 10),
  price_paid numeric(10,2),
  tasting_date date,
  notes text,
  descriptors text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table public.custom_values (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  category text not null,
  value text not null,
  created_at timestamptz not null default now(),
  unique (user_id, category, value)
);

alter table public.wines enable row level security;
alter table public.custom_values enable row level security;

grant select, insert, update, delete on public.wines to authenticated;
grant select, insert, update, delete on public.custom_values to authenticated;

create policy "Users manage own wines" on public.wines
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users manage own custom values" on public.custom_values
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
```

</details>

Under Authentication → Sign In / Providers, make sure Email is enabled. While developing, "Confirm email" can be off so sign-ups work instantly. Turn it back on before sharing the app with anyone.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Project structure

```
src/
  components/
    ui/          shadcn/ui components
    wines/       wine card, detail view, and add/edit form
    auth-form.tsx
  hooks/         use-wines, use-custom-values, use-theme
  lib/           Supabase client, utilities
  pages/         library page
  types.ts       shared types
  App.tsx        session check: sign-in screen or library
  index.css      theme colors and fonts
```

## Brand

- Colors: burgundy `#2a0a14`, rosé `#d4526e`, off-white `#f5eaed`, plus `#6b1a2e` and `#f5b8c6`
- Fonts: Playball for the wordmark (all caps), Nunito Sans for everything else

## Changelog

See [CHANGELOG.md](CHANGELOG.md).