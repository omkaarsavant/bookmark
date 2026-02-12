-- 1. Restore the strict privacy policy
drop policy if exists "Public view for debug" on bookmarks;
drop policy if exists "Users can view their own bookmarks" on bookmarks;

create policy "Users can view their own bookmarks"
  on bookmarks for select
  using ( auth.uid() = user_id );

-- 2. CRITICAL: Enable Full Replica Identity
-- This ensures that when a row is deleted or updated, the old data (including user_id) 
-- is available to Supabase Realtime to check against the RLS policy.
-- Without this, Realtime might not know if the user is allowed to see the 'delete' event.
alter table bookmarks replica identity full;

-- 3. Ensure the publication tracks it (redundant if already done, but safe)
alter publication supabase_realtime add table bookmarks;
