-- Drop the debug policy
drop policy "Public view for debug" on bookmarks;

-- Re-create the secure policy
create policy "Users can view their own bookmarks"
  on bookmarks for select
  using ( auth.uid() = user_id );

-- FOR REALTIME TO WORK WITH RLS:
-- The table must have REPLICA IDENTITY FULL or the publication needs to know about the new values.
-- But standard RLS policies usually work IF the client is authenticated.
-- The issue might be that the initial subscription didn't have the token ready.
-- However, since transparency is key, we will keep the RLS.
