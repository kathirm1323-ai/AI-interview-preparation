CREATE TABLE IF NOT EXISTS interviews (
  id TEXT PRIMARY KEY,
  candidate_name TEXT,
  domain TEXT,
  resume_data TEXT,
  total_questions INTEGER DEFAULT 0,
  overall_score REAL DEFAULT 0,
  overall_rating TEXT,
  report TEXT,
  duration INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS answers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  interview_id TEXT NOT NULL,
  question_index INTEGER,
  question_text TEXT,
  category TEXT,
  difficulty TEXT,
  answer_text TEXT,
  score REAL DEFAULT 0,
  evaluation TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (interview_id) REFERENCES interviews(id)
);
