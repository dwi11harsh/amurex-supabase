/* ---------- Minimal "Supabase-like" auth helpers ---------- */
create schema if not exists auth;

create table if not exists auth.users(
  id uuid primary key default uuid_generate_v4(),
  email text,
  created_at timestamptz default now()
);

create or replace function auth.uid()
returns uuid language sql stable
as $$ select current_setting('request.jwt.claim.sub', true)::uuid $$;

/* ---------- Your tables ---------- */
create table public.users (
    id uuid primary key default auth.uid(),
    email text unique,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,

    -- Integration fields
    notion_connected boolean default false,
    notion_access_token text,
    notion_workspace_id text,
    notion_bot_id text,

    google_docs_connected boolean default false,
    google_access_token text,
    google_refresh_token text,

    calendar_connected boolean default false,
    calendar_access_token text,
    calendar_refresh_token text,

    memory_enabled boolean default true
);

create table public.meetings (
    id serial primary key,
    user_id uuid not null references auth.users(id),
    meeting_id text not null,
    transcript text,
    context_files text,
    created_at timestamptz default timezone('utc', now()),
    updated_at timestamptz default timezone('utc', now()),
    embeddings vector,
    generated_prompt jsonb,
    chunks text,
    suggestion_count smallint default 0
);

create table public.late_meeting (
    id uuid primary key default uuid_generate_v4(),
    meeting_id text not null unique,
    user_ids uuid[] not null,
    meeting_start_time float8 not null,
    created_at timestamptz default now(),
    transcript text,
    summary text,
    action_items text,
    meeting_title text
);

create table public.memories (
    id bigint primary key,
    created_at timestamptz default now(),
    user_id uuid references public.users(id),
    content text default '',
    chunks text,
    embeddings vector,
    meeting_id uuid references public.late_meeting(id),
    centroid vector
);

create table public.analytics (
    id serial primary key,
    uuid text not null,
    event_type text not null,
    created_at timestamptz default timezone('utc', now()),
    meeting_id text
);

-- New tables for document management
create table public.documents (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id),
    url text,
    title text,
    text text,
    tags text[],
    checksum text unique,
    created_at timestamptz default now(),
    meta jsonb,
    updated_at timestamptz default now()
);

create table public.page_sections (
    id uuid primary key default uuid_generate_v4(),
    document_id uuid references public.documents(id),
    context text,
    token_count integer,
    embedding vector,
    created_at timestamptz default now()
);

-- New table for email preferences
create table public.email_preferences (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) unique,
    preferences jsonb default '{}'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- New table for notifications
create table public.notifications (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id),
    type text not null,
    content jsonb,
    read boolean default false,
    created_at timestamptz default now()
);

/* ---------- Indexes ---------- */
-- Analytics indexes
create index idx_analytics_uuid on analytics(uuid);
create index idx_analytics_event_type on analytics(event_type);
create index idx_analytics_meeting_id on analytics(meeting_id);

-- Memories indexes
create index memories_user_id_idx on memories(user_id);
create index memories_meeting_id_idx on memories(meeting_id);

-- Late meeting index
create index idx_late_meeting_meeting_id on late_meeting(meeting_id);

-- Meetings indexes
create index idx_meetings_user_id on meetings(user_id);
create index idx_meetings_meeting_id on meetings(meeting_id);

-- Documents indexes
create index idx_documents_user_id on documents(user_id);
create index idx_documents_checksum on documents(checksum);
create index idx_documents_created_at on documents(created_at);

-- Page sections indexes
create index idx_page_sections_document_id on page_sections(document_id);

-- Notifications indexes
create index idx_notifications_user_id on notifications(user_id);
create index idx_notifications_created_at on notifications(created_at);

/* ---------- Triggers ---------- */
-- Users trigger for updated_at
create or replace function update_timestamp()
returns trigger language plpgsql as $$
begin
    new.updated_at = current_timestamp;
    return new;
end;
$$;

create trigger set_timestamp
    before update on users
    for each row
    execute function update_timestamp();

-- Meetings trigger for updated_at
create trigger set_meeting_timestamp
    before update on meetings
    for each row
    execute function update_timestamp();

-- Documents trigger for updated_at
create trigger set_document_timestamp
    before update on documents
    for each row
    execute function update_timestamp();

-- Email preferences trigger for updated_at
create trigger set_email_preferences_timestamp
    before update on email_preferences
    for each row
    execute function update_timestamp();
