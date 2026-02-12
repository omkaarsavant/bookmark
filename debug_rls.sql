-- TEMPORARY: Allow anyone to view bookmarks to test if RLS is blocking Realtime
drop policy "Users can view their own bookmarks" on bookmarks;
create policy "Users can view their own bookmarks"
  on bookmarks for select
  using ( true );

-- After you run this, try adding a bookmark. If it shows up, RLS is the issue.
