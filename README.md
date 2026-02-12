# Smart Bookmark App

A real-time, privacy-focused bookmark manager built with Next.js 14, Supabase, and Tailwind CSS.

## Features

- **User Authentication**: Secure Google OAuth login via Supabase.
- **Private Bookmarks**: Row Level Security (RLS) ensures users only see their own data.
- **Real-time Updates**: Instant synchronization across tabs/devices using Supabase Realtime.
- **Responsive Design**: "Premium" UI with responsive layouts and modern styling.

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Backend/Database**: [Supabase](https://supabase.com/) (PostgreSQL, Auth, Realtime)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Language**: TypeScript

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd smart-bookmark-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Setup Database:**
   Run the SQL commands found in `supabase_schema.sql` in your Supabase SQL Editor to create the table and security policies.

5. **Run the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser.

## Deployment

Deploy easily to [Vercel](https://vercel.com/):

1. Push your code to a GitHub repository.
2. Import the project in Vercel.
3. Add the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variables in the Vercel dashboard.
4. Deploy!

## Challenges & Solutions

During the development of this application, several specific challenges were encountered and resolved. Here is a summary of the technical hurdles and their solutions:

### 1. Authentication Configuration Errors
**Problem:** Initially encountered `400: Unsupported provider` and `400: redirect_uri_mismatch` errors during Google Sign-In.
**Solution:**
- Enabled "Google" as a provider in Supabase Authentication settings.
- Added the Supabase Callback URL (`https://<project>.supabase.co/auth/v1/callback`) to the **Authorized redirect URIs** in the Google Cloud Console. This was critical because Google only authorizes the Supabase backend to receive the credentials, not `localhost` directly.

### 2. Next.js 15 Breaking Change: Async Cookies
**Problem:** The application crashed with `TypeError: cookieStore.getAll is not a function` and errors stating `cookies()` must be awaited.
**Context:** Next.js 15 made `cookies()` and other header APIs asynchronous, breaking the standard Supabase SSR setup guide which assumed synchronous access.
**Solution:**
- Updated `src/lib/supabase/server.ts` to make `createClient` an `async` function.
- Awaited `cookies()` before accessing `.getAll()`.
- Updated all route handlers (`auth/callback`, `dashboard/page.tsx`) to `await createClient()`.

### 3. React Client Component Directives
**Problem:** `TypeError: useState is not a function` in `AddBookmarkForm.tsx`.
**Solution:** Added the `'use client'` directive to the top of the file. This is necessary for any component that uses React hooks (`useState`, `useEffect`) in the Next.js App Router, as components are Server Components by default.

### 4. Realtime Updates Blocked by RLS
**Problem:** The `BookmarkList` component subscribed successfully (`status: SUBSCRIBED`), but `INSERT` events were not triggering UI updates.
**Cause:** Row Level Security (RLS) applies to Realtime subscriptions. If the database cannot verify that the user is allowed to see the new row, it acts as if the row doesn't exist.
**Solution:**
- Enabled **Replication** on the `bookmarks` table (`alter publication supabase_realtime add table bookmarks;`).
- Enabled **Row Level Security** on the table.
- **CRITICAL**: Set `REPLICA IDENTITY FULL` on the `bookmarks` table. This ensures Supabase has access to all column data (specifically `user_id`) during `UPDATE` and `DELETE` events to properly evaluate the RLS policy against the subscriber's token.
- Updated the React component to wait for the `session` to be available before establishing the subscription, ensuring the socket connects as the authenticated user rather than `anon`.

### 5. Data Privacy Enforcement
**Problem:** Users could see each other's bookmarks because a temporary "debug" policy was left active.
**Solution:**
- Removed public policies.
- Enforced a strict RLS policy: `create policy "Users can view their own bookmarks" on bookmarks for select using ( auth.uid() = user_id );`.
- Verified that the `anon` key (not `service_role`) was being used in the client, ensuring the RLS rules were actually applied.
