-- ============================================
-- Database Schema: Digital Twin Monitoring Ruangan
-- ============================================

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama_ruangan VARCHAR(100) NOT NULL,
    lokasi VARCHAR(100)
);

CREATE TABLE thresholds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id INTEGER,
    max_suhu FLOAT DEFAULT 30,
    min_kelembapan FLOAT DEFAULT 40
);

CREATE TABLE sensor_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id INTEGER,
    suhu FLOAT,
    kelembapan FLOAT,
    cahaya FLOAT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
