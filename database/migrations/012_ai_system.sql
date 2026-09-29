-- Muaraversa AI System Migration
-- Version 012

CREATE TABLE IF NOT EXISTS ai_lesson_plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  teacher_id INTEGER,
  subject TEXT NOT NULL,
  grade TEXT NOT NULL,
  topic TEXT NOT NULL,
  duration TEXT,
  content JSON NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_question_packs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  teacher_id INTEGER,
  subject TEXT NOT NULL,
  grade TEXT NOT NULL,
  topic TEXT NOT NULL,
  difficulty TEXT,
  questions JSON NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_student_analyses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  summary TEXT NOT NULL,
  strengths JSON,
  weaknesses JSON,
  recommendations JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
