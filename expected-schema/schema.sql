users (
    id UUID PRIMARY KEY DEFAULT auth.uid(),
    email TEXT UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Integration fields
    notion_connected BOOLEAN DEFAULT FALSE,
    notion_access_token TEXT,
    notion_workspace_id TEXT,
    notion_bot_id TEXT,
    
    google_docs_connected BOOLEAN DEFAULT FALSE,
    google_access_token TEXT,
    google_refresh_token TEXT,
    
    calendar_connected BOOLEAN DEFAULT FALSE,
    calendar_access_token TEXT,
    calendar_refresh_token TEXT,
    
    memory_enabled BOOLEAN DEFAULT TRUE
)


meetings (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    meeting_id TEXT NOT NULL,
    transcript TEXT,
    context_files TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    embeddings VECTOR,
    generated_prompt JSONB,
    chunks TEXT,
    suggestion_count SMALLINT DEFAULT 0
)

late_meeting (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    meeting_id TEXT NOT NULL UNIQUE,
    user_ids UUID[] NOT NULL,
    meeting_start_time FLOAT8 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    transcript TEXT,
    summary TEXT,
    action_items TEXT,
    meeting_title TEXT
)


memories (
    id BIGINT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES public.users(id),
    content TEXT DEFAULT '',
    chunks TEXT,
    embeddings VECTOR,
    meeting_id UUID REFERENCES public.late_meeting(id),
    centroid VECTOR
)

analytics (
    id SERIAL PRIMARY KEY,
    uuid TEXT NOT NULL,
    event_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    meeting_id TEXT
)

 message_history (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    payload JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);