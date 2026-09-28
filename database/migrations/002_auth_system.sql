-- Muaraversa Authentication Migration
-- Version 002


ALTER TABLE users
RENAME COLUMN password TO password_hash;


ALTER TABLE users
ADD COLUMN name TEXT;


ALTER TABLE users
ADD COLUMN status TEXT DEFAULT 'active';


ALTER TABLE users
ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP;
