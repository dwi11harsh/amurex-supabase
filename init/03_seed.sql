insert into auth.users(id,email) values
  ('11111111-1111-1111-1111-111111111111', 'alice@example.com'),
  ('22222222-2222-2222-2222-222222222222', 'bob@example.com');

insert into public.users(id,email,notion_connected,google_docs_connected)
select id,email,true,false from auth.users;

insert into public.meetings(user_id,meeting_id,transcript,suggestion_count)
values
  ('11111111-1111-1111-1111-111111111111','meet-001','Hello world',2),
  ('22222222-2222-2222-2222-222222222222','meet-002','Another meeting',0);

insert into public.analytics(uuid,event_type,meeting_id)
values
 ('abc','page_view','meet-001'),
 ('def','summary_requested','meet-001');
