// Authentication Related Calls
const authCalls = {
  // Session Management
  getSession: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  },

  onAuthStateChange: (callback) => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });
    return subscription;
  },

  // Sign In Methods
  signInWithOtp: async (email) => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    return { error };
  },

  signInWithPassword: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Password Management
  resetPasswordForEmail: async (email, options) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, options);
    return { error };
  },

  updateUser: async (updates) => {
    const { data, error } = await supabase.auth.updateUser(updates);
    return { data, error };
  },

  signUp: async (credentials) => {
    const { data, error } = await supabase.auth.signUp(credentials);
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Additional Auth Methods
  getSessionWithUser: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  },

  onAuthStateChangeWithUser: (callback) => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });
    return subscription;
  },
};

// Database Operations
const dbCalls = {
  // Users Table
  getUserMemoryEnabled: async (userId) => {
    const { data: user, error } = await adminSupabase
      .from("users")
      .select("memory_enabled")
      .eq("id", userId)
      .single();
    return { user, error };
  },

  // Sessions Table
  insertSession: async (sessionData) => {
    await adminSupabase.from("sessions").insert(sessionData);
  },

  // Documents Table
  getAllDocuments: async () => {
    const { data, error } = await supabase.from("documents").select("*");
    return { data, error };
  },

  // Emails Table
  insertEmail: async (emailData) => {
    const { error } = await supabase.from("emails").insert(emailData);
    return { error };
  },

  // Page Sections Table
  insertPageSection: async (sectionData) => {
    await supabase.from("page_sections").insert(sectionData);
  },

  // New Database Operations
  getTranscripts: async () => {
    const { data, error } = await supabase.from("transcripts").select("*");
    return { data, error };
  },

  getSharedTranscripts: async () => {
    const { data, error } = await supabase
      .from("shared_transcripts")
      .select("*");
    return { data, error };
  },

  getTranscriptDetails: async (transcriptId) => {
    const { data, error } = await supabase
      .from("transcripts")
      .select("*")
      .eq("id", transcriptId)
      .single();
    return { data, error };
  },

  // Meetings Table
  getMeetings: async () => {
    const { data, error } = await supabase.from("meetings").select("*");
    return { data, error };
  },

  getMeetingDetails: async (meetingId) => {
    const { data, error } = await supabase
      .from("meetings")
      .select("*")
      .eq("id", meetingId)
      .single();
    return { data, error };
  },

  // Teams Table
  getTeamDetails: async (teamId) => {
    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .eq("id", teamId)
      .single();
    return { data, error };
  },

  // Users Table - Additional Operations
  getUserDetails: async (userId) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();
    return { data, error };
  },

  updateUserDetails: async (userId, updates) => {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", userId);
    return { data, error };
  },

  getUserGoogleTokenVersion: async (userId) => {
    const { data: user, error } = await supabase
      .from("users")
      .select("google_token_version")
      .eq("id", userId)
      .single();
    return { user, error };
  },

  updateUserEmailTaggingEnabled: async (userId, enabled) => {
    const { data, error } = await supabase
      .from("users")
      .update({ email_tagging_enabled: enabled })
      .eq("id", userId);
    return { data, error };
  },

  getUserGoogleConnected: async (userId) => {
    const { data: userData, error } = await supabase
      .from("users")
      .select("google_connected")
      .eq("id", userId)
      .single();
    return { userData, error };
  },

  getUsersWithGoogleCredentials: async () => {
    const { data: users, error } = await adminSupabase
      .from("users")
      .select("id, google_refresh_token, google_cohort")
      .not("google_refresh_token", "is", null)
      .order("created_at", { ascending: false });
    return { users, error };
  },

  // Google Clients Table - New Additions
  getGoogleClientById: async (clientId) => {
    const { data: client, error } = await adminSupabase
      .from("google_clients")
      .select("client_id, client_secret")
      .eq("id", clientId)
      .single();
    return { client, error };
  },

  getGoogleClientsByIds: async (cohortIds) => {
    const { data: clientsData, error: clientsError } = await adminSupabase
      .from("google_clients")
      .select("id, client_id, client_secret")
      .in("id", cohortIds.length > 0 ? cohortIds : [0]);
    return { clientsData, clientsError };
  },

  // Documents Table - New Additions
  getObsidianDocumentsByUserId: async (userId) => {
    const { data, error } = await supabase
      .from("documents")
      .select("id")
      .eq("user_id", userId)
      .eq("type", "obsidian")
      .limit(1);
    return { data, error };
  },

  getRecentDocumentsByUserId: async (userId) => {
    const { data, error } = await supabase
      .from("documents")
      .select("title, text")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(3);
    return { data, error };
  },

  // Additional Database Operations
  getSharedTranscriptsByUser: async (userId) => {
    const { data, error } = await supabase
      .from("shared_transcripts")
      .select("*")
      .eq("user_id", userId);
    return { data, error };
  },

  getTeamMembers: async (teamId) => {
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .eq("team_id", teamId);
    return { data, error };
  },

  updateTeamMember: async (memberId, updates) => {
    const { data, error } = await supabase
      .from("team_members")
      .update(updates)
      .eq("id", memberId);
    return { data, error };
  },

  deleteTeamMember: async (memberId) => {
    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("id", memberId);
    return { error };
  },

  // Documents Operations
  getDocumentById: async (documentId) => {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("id", documentId)
      .single();
    return { data, error };
  },

  updateDocument: async (documentId, updates) => {
    const { data, error } = await supabase
      .from("documents")
      .update(updates)
      .eq("id", documentId);
    return { data, error };
  },

  deleteDocument: async (documentId) => {
    const { error } = await supabase
      .from("documents")
      .delete()
      .eq("id", documentId);
    return { error };
  },

  // Meetings Table - New Additions
  getLateMeetingById: async (meetingId) => {
    const { data, error } = await supabase
      .from("late_meeting")
      .select(
        `
        id,
        meeting_id,
        meeting_title,
        created_at,
        summary,
        transcript,
        action_items
        `
      )
      .eq("id", meetingId)
      .single();
    return { data, error };
  },
};

// Storage Operations
const storageCalls = {
  uploadFile: async (bucket, filename, file) => {
    const { data, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filename, file);
    return { data, uploadError };
  },

  getPublicUrl: (bucket, filename) => {
    const {
      data: { publicUrl },
      error: urlError,
    } = supabase.storage.from(bucket).getPublicUrl(filename);
    return { publicUrl, urlError };
  },

  // New Storage Operations
  uploadNote: async (filename, file) => {
    const { data, error: uploadError } = await supabase.storage
      .from("notes")
      .upload(filename, file);
    return { data, uploadError };
  },

  getNotePublicUrl: (filename) => {
    const {
      data: { publicUrl },
      error: urlError,
    } = supabase.storage.from("notes").getPublicUrl(filename);
    return { publicUrl, urlError };
  },

  // Additional Storage Operations
  uploadMeetingRecording: async (filename, file) => {
    const { data, error: uploadError } = await supabase.storage
      .from("meeting-recordings")
      .upload(filename, file);
    return { data, uploadError };
  },

  getMeetingRecordingUrl: (filename) => {
    const {
      data: { publicUrl },
      error: urlError,
    } = supabase.storage.from("meeting-recordings").getPublicUrl(filename);
    return { publicUrl, urlError };
  },

  // Additional Storage Operations
  uploadDocument: async (filename, file) => {
    const { data, error: uploadError } = await supabase.storage
      .from("documents")
      .upload(filename, file);
    return { data, uploadError };
  },

  getDocumentUrl: (filename) => {
    const {
      data: { publicUrl },
      error: urlError,
    } = supabase.storage.from("documents").getPublicUrl(filename);
    return { publicUrl, urlError };
  },

  deleteFile: async (bucket, filename) => {
    const { error } = await supabase.storage.from(bucket).remove([filename]);
    return { error };
  },

  listFiles: async (bucket, path = "") => {
    const { data, error } = await supabase.storage.from(bucket).list(path);
    return { data, error };
  },
};

// RPC (Remote Procedure Calls)
const rpcCalls = {
  incrementGoogleClientUserCount: async (params) => {
    const { error: countError } = await supabase.rpc(
      "increment_google_client_user_count",
      params
    );
    return { countError };
  },

  searchSections: async (params) => {
    const { data: sections, error: sectionsError } = await supabase.rpc(
      "search_sections",
      params
    );
    return { sections, sectionsError };
  },

  // New RPC Calls
  searchTranscripts: async (params) => {
    const { data, error } = await supabase.rpc("search_transcripts", params);
    return { data, error };
  },

  searchSharedTranscripts: async (params) => {
    const { data, error } = await supabase.rpc(
      "search_shared_transcripts",
      params
    );
    return { data, error };
  },

  // Additional RPC Calls
  searchMeetings: async (params) => {
    const { data, error } = await supabase.rpc("search_meetings", params);
    return { data, error };
  },

  searchTeamMembers: async (params) => {
    const { data, error } = await supabase.rpc("search_team_members", params);
    return { data, error };
  },

  // Additional RPC Calls
  searchDocuments: async (params) => {
    const { data, error } = await supabase.rpc("search_documents", params);
    return { data, error };
  },

  searchTeamDocuments: async (params) => {
    const { data, error } = await supabase.rpc("search_team_documents", params);
    return { data, error };
  },

  getTeamStats: async (teamId) => {
    const { data, error } = await supabase.rpc("get_team_stats", {
      team_id: teamId,
    });
    return { data, error };
  },

  getUserStats: async (userId) => {
    const { data, error } = await supabase.rpc("get_user_stats", {
      user_id: userId,
    });
    return { data, error };
  },
};

// API Route Handlers
const apiCalls = {
  // Search API
  search: {
    getUserMemoryEnabled: async (userId) => {
      const { data: user, error } = await adminSupabase
        .from("users")
        .select("memory_enabled")
        .eq("id", userId)
        .single();
      return { user, error };
    },
    insertSession: async (sessionData) => {
      await adminSupabase.from("sessions").insert(sessionData);
    },
  },

  // Google API
  google: {
    incrementClientUserCount: async (params) => {
      const { error: countError } = await supabase.rpc(
        "increment_google_client_user_count",
        params
      );
      return { countError };
    },
  },

  // Upload API
  upload: {
    insertPageSection: async (sectionData) => {
      await supabase.from("page_sections").insert(sectionData);
    },
  },

  // Gmail API
  gmail: {
    insertEmail: async (emailData) => {
      const { error } = await supabase.from("emails").insert(emailData);
      return { error };
    },
  },

  // New API Handlers
  transcript: {
    getTranscripts: async () => {
      const { data, error } = await supabase.from("transcripts").select("*");
      return { data, error };
    },
    getTranscriptDetails: async (transcriptId) => {
      const { data, error } = await supabase
        .from("transcripts")
        .select("*")
        .eq("id", transcriptId)
        .single();
      return { data, error };
    },
  },

  // Meetings API
  meetings: {
    getMeetings: async () => {
      const { data, error } = await supabase.from("meetings").select("*");
      return { data, error };
    },
    getMeetingDetails: async (meetingId) => {
      const { data, error } = await supabase
        .from("meetings")
        .select("*")
        .eq("id", meetingId)
        .single();
      return { data, error };
    },
  },

  // Teams API
  teams: {
    getTeamDetails: async (teamId) => {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .eq("id", teamId)
        .single();
      return { data, error };
    },
    joinTeam: async (teamData) => {
      const { data, error } = await supabase
        .from("team_members")
        .insert(teamData);
      return { data, error };
    },
  },

  // Additional API Handlers
  documents: {
    getDocumentById: async (documentId) => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("id", documentId)
        .single();
      return { data, error };
    },
    updateDocument: async (documentId, updates) => {
      const { data, error } = await supabase
        .from("documents")
        .update(updates)
        .eq("id", documentId);
      return { data, error };
    },
    deleteDocument: async (documentId) => {
      const { error } = await supabase
        .from("documents")
        .delete()
        .eq("id", documentId);
      return { error };
    },
  },

  team: {
    getTeamMembers: async (teamId) => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .eq("team_id", teamId);
      return { data, error };
    },
    updateTeamMember: async (memberId, updates) => {
      const { data, error } = await supabase
        .from("team_members")
        .update(updates)
        .eq("id", memberId);
      return { data, error };
    },
    deleteTeamMember: async (memberId) => {
      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("id", memberId);
      return { error };
    },
  },
};

// Export all calls
module.exports = {
  auth: authCalls,
  db: dbCalls,
  storage: storageCalls,
  rpc: rpcCalls,
  api: apiCalls,
};
