PRAGMA journal_mode=WAL;
PRAGMA synchronous=NORMAL;
PRAGMA foreign_keys=ON;

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('admin', 'viewer')),
    full_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    node_id TEXT NOT NULL,
    location TEXT NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 30,
    theme TEXT NOT NULL DEFAULT 'auto',
    api_key TEXT NOT NULL,
    acquisition_enabled INTEGER NOT NULL DEFAULT 1,
    auto_cooling INTEGER NOT NULL DEFAULT 1,
    ac_state INTEGER NOT NULL DEFAULT 0,
    alert_spike INTEGER NOT NULL DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS thresholds (
    room_id INTEGER PRIMARY KEY,
    temp_on REAL NOT NULL DEFAULT 26.5,
    temp_off REAL NOT NULL DEFAULT 23.5,
    temp_alert REAL NOT NULL DEFAULT 29.5,
    humidity_max REAL NOT NULL DEFAULT 75.0,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sensor_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id INTEGER NOT NULL,
    temperature REAL NOT NULL,
    humidity REAL NOT NULL,
    occupancy INTEGER NOT NULL,
    ac_state INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'OPTIMAL',
    source TEXT NOT NULL DEFAULT 'SIMULATOR',
    recorded_at TEXT NOT NULL,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_logs_room_time ON sensor_logs(room_id, id DESC);
