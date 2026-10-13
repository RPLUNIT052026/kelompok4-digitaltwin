# ENTITY RELATIONSHIP DIAGRAM (ERD)
## Digital Twin Monitoring Ruangan

## 1. Diagram ERD

```mermaid
erDiagram
    USERS {
        int id PK
        string username
        string password
        datetime created_at
    }
    
    ROOMS {
        int id PK
        string nama_ruangan
        string lokasi
        datetime created_at
    }
    
    THRESHOLDS {
        int id PK
        int room_id FK
        float max_suhu
        float min_kelembapan
        float max_cahaya
    }
    
    SENSOR_LOGS {
        int id PK
        int room_id FK
        float suhu
        float kelembapan
        float cahaya
        boolean occupancy
        datetime timestamp
    }
    
    ROOMS ||--o{ SENSOR_LOGS : "memiliki"
    ROOMS ||--|| THRESHOLDS : "punya"
```

## 2. Detail Tabel

### Tabel: `users`
| Field | Tipe | Keterangan |
|-------|------|-----------|
| id | INTEGER | Primary Key, Auto Increment |
| username | VARCHAR(50) | Unique, Not Null |
| password | VARCHAR(255) | Hash, Not Null |
| created_at | DATETIME | Default CURRENT_TIMESTAMP |

### Tabel: `rooms`
| Field | Tipe | Keterangan |
|-------|------|-----------|
| id | INTEGER | Primary Key |
| nama_ruangan | VARCHAR(100) | Not Null |
| lokasi | VARCHAR(100) | |
| created_at | DATETIME | Default CURRENT_TIMESTAMP |

### Tabel: `thresholds`
| Field | Tipe | Keterangan |
|-------|------|-----------|
| id | INTEGER | Primary Key |
| room_id | INTEGER | Foreign Key ke rooms.id |
| max_suhu | FLOAT | Default 30 |
| min_kelembapan | FLOAT | Default 40 |
| max_cahaya | FLOAT | Default 800 |

### Tabel: `sensor_logs`
| Field | Tipe | Keterangan |
|-------|------|-----------|
| id | INTEGER | Primary Key |
| room_id | INTEGER | Foreign Key ke rooms.id |
| suhu | FLOAT | Suhu ruangan (Celsius) |
| kelembapan | FLOAT | Kelembapan (%) |
| cahaya | FLOAT | Intensitas cahaya (lux) |
| occupancy | BOOLEAN | 0 = kosong, 1 = ada |
| timestamp | DATETIME | Default CURRENT_TIMESTAMP |

## 3. Relasi Antar Tabel

| Relasi | Tipe | Keterangan |
|--------|------|-----------|
| rooms -> sensor_logs | One to Many | 1 ruangan punya banyak log |
| rooms -> thresholds | One to One | 1 ruangan punya 1 pengaturan |
