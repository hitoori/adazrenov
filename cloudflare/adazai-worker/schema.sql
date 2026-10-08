CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL DEFAULT 'adazai-web',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  conversation_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS messages_conversation_created_idx
  ON messages (conversation_id, created_at DESC);

CREATE TABLE IF NOT EXISTS rate_limits (
  client_key TEXT PRIMARY KEY,
  request_count INTEGER NOT NULL,
  reset_at INTEGER NOT NULL
);
