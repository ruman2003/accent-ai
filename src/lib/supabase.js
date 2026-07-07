// Supabase client — offline-first cloud persistence
// Install: npm install @supabase/supabase-js
// Set env vars: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Netlify dashboard

let supabase = null;

const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY  = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function initSupabase() {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;
  try {
    const { createClient } = await import('@supabase/supabase-js');
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    return supabase;
  } catch { return null; }
}

export { supabase };

// ── Offline-first sync helpers ──────────────────────────────────────────────

let syncTimer = null;
const pendingQueue = [];

/**
 * Read: localStorage immediately (instant paint) then background-refresh from Supabase
 */
export async function loadUserProgress(userId, onFresh) {
  // 1. Serve local immediately
  const local = JSON.parse(localStorage.getItem('accentai:cloud') || 'null');
  if (local) onFresh?.(local);

  // 2. Background fetch from Supabase
  if (!supabase || !userId) return;
  try {
    const { data } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (data) {
      localStorage.setItem('accentai:cloud', JSON.stringify(data));
      onFresh?.(data);
    }
  } catch {}
}

/**
 * Write: localStorage immediately, debounced 2s cloud upsert, offline queue
 */
export function saveUserProgress(userId, patch) {
  const current = JSON.parse(localStorage.getItem('accentai:cloud') || '{}');
  const merged  = { ...current, ...patch, user_id: userId, updated_at: new Date().toISOString() };
  localStorage.setItem('accentai:cloud', JSON.stringify(merged));

  clearTimeout(syncTimer);
  syncTimer = setTimeout(async () => {
    if (!supabase || !userId) return;
    if (!navigator.onLine) { pendingQueue.push(merged); return; }
    try {
      await supabase.from('user_progress').upsert(merged, { onConflict: 'user_id' });
    } catch {}
  }, 2000);
}

// Flush pending writes on reconnect
if (typeof window !== 'undefined') {
  window.addEventListener('online', async () => {
    while (pendingQueue.length && navigator.onLine) {
      const item = pendingQueue.shift();
      if (supabase) {
        try { await supabase.from('user_progress').upsert(item, { onConflict: 'user_id' }); } catch {}
      }
    }
  });
}

// ── Supabase SQL schema (run this in Supabase SQL editor) ──────────────────
/*
CREATE TABLE user_progress (
  user_id UUID REFERENCES auth.users PRIMARY KEY,
  phoneme_scores JSONB DEFAULT '{}',
  streak_count INT DEFAULT 0,
  streak_last_active DATE,
  lifetime_mastery FLOAT DEFAULT 0,
  total_attempts INT DEFAULT 0,
  onboarded BOOLEAN DEFAULT false,
  goal TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE error_bank (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  phoneme TEXT NOT NULL,
  error_type TEXT,
  expected TEXT,
  produced TEXT,
  context_phrase TEXT,
  occurrence_count INT DEFAULT 1,
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, phoneme, produced)
);

CREATE TABLE practice_sessions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  mode TEXT,
  accent TEXT,
  items JSONB,
  scores JSONB,
  phoneme_errors JSONB,
  duration_sec INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE srs_queue (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  phoneme TEXT,
  next_review DATE,
  interval_days INT DEFAULT 1,
  ease_factor FLOAT DEFAULT 2.5,
  repetitions INT DEFAULT 0,
  UNIQUE(user_id, phoneme)
);

-- Row-level security (enable in Supabase dashboard too)
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their data" ON user_progress FOR ALL USING (auth.uid() = user_id);
ALTER TABLE error_bank ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their errors" ON error_bank FOR ALL USING (auth.uid() = user_id);
ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their sessions" ON practice_sessions FOR ALL USING (auth.uid() = user_id);
ALTER TABLE srs_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their SRS" ON srs_queue FOR ALL USING (auth.uid() = user_id);
*/
