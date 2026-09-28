-- Muaraversa School Core
CREATE TABLE IF NOT EXISTS school_profile (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  school_name TEXT NOT NULL,
  npsn TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
