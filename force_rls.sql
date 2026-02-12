-- 1. FORCE ENABLE RLS (This is likely the missing piece)
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- 2. Re-verify the policy just in case
drop policy if exists "Users can view their own bookmarks" on bookmarks;
create policy "Users can view their own bookmarks"
  on bookmarks
  for all                             -- Apply to SELECT, INSERT, UPDATE, DELETE
  using ( auth.uid() = user_id );     -- Access condition

-- 3. Check if RLS is on (The result of this query should show 'true' for rowsecurity)
select tablename, rowsecurity 
from pg_tables 
where tablename = 'bookmarks';
