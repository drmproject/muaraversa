-- Muaraversa Database Schema
-- Version 0.1


CREATE TABLE IF NOT EXISTS users (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    username TEXT NOT NULL UNIQUE,

    password TEXT NOT NULL,

    role TEXT DEFAULT 'user',

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP

);



CREATE TABLE IF NOT EXISTS schools (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT NOT NULL,

    address TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP

);



CREATE TABLE IF NOT EXISTS classes (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    school_id INTEGER,

    class_name TEXT NOT NULL,

    FOREIGN KEY(school_id)
    REFERENCES schools(id)

);
