-- =============================================================================
-- RLS policy fix for public.users
-- =============================================================================
-- Background:
--   The /api/email/generate route upserts the authenticated user into
--   public.users in case the auth trigger (handle_new_user) didn't fire.
--   The upsert is done with the SERVICE ROLE key, which BYPASSES RLS entirely,
--   so no policy is required for it to work — as long as
--   SUPABASE_SERVICE_ROLE_KEY is set to a real key (not a placeholder).
--
--   This file adds a SAFE fallback policy so the upsert still succeeds when it
--   has to run through the anon client (i.e. an authenticated user session):
--   a user may insert ONLY their own row.
--
-- SECURITY NOTE:
--   Do NOT use `WITH CHECK (true)` — that would let anyone (including
--   anonymous requests) insert arbitrary rows. We restrict with auth.uid() = id.
-- =============================================================================

-- Make idempotent: drop existing policies first so re-running won't error.
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Service role can insert users" ON public.users;
DROP POLICY IF EXISTS "Service role can update users" ON public.users;

-- Allow an authenticated user to insert their OWN row only.
-- This is the safe fallback for upserts done via the anon client.
CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Allow an authenticated user to update their OWN row only.
-- (The UPDATE policy already exists in schema.sql; recreate here for safety.)
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- NOTE on UPSERT:
--   A Postgres/PostgREST upsert = INSERT ... ON CONFLICT DO UPDATE.
--   For the UPDATE branch to pass RLS, BOTH the INSERT policy (WITH CHECK)
--   and the UPDATE policy (USING + WITH CHECK) must allow the row.
--   Both policies above are scoped to auth.uid() = id, so a user upserting
--   their own row will succeed; any other id is rejected.
