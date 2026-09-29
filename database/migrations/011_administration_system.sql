-- Muaraversa Administration & Digital Archive Migration
-- Version 011

CREATE TABLE IF NOT EXISTS school_letters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  letter_number TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL, -- Masuk, Keluar, Surat Keputusan, Surat Keterangan
  title TEXT NOT NULL,
  sender_or_recipient TEXT NOT NULL,
  letter_date DATE NOT NULL,
  description TEXT,
  file_url TEXT,
  status TEXT DEFAULT 'Diproses', -- Draft, Diproses, Disetujui, Diarsipkan
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS digital_archives (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- Kurikulum, Akreditasi, Kepegawaian, Kesiswaan, Sarpras
  document_number TEXT,
  year TEXT,
  file_size TEXT,
  file_url TEXT,
  uploaded_by INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
