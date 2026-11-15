# 🗄️ ENTITY RELATIONSHIP DIAGRAM (ERD) — Digital Twin

Dokumentasi ini memetakan struktur database SQLite yang diimplementasikan pada Sprint 3. Penamaan atribut menggunakan *snake_case* dan disesuaikan secara presisi dengan file `schema.sql`.

---

## 📐 A. Diagram ERD

```mermaid
erDiagram
    USERS {
        int id PK
        string username
        string password_hash
        string role "admin / viewer"
        string full_name
    }
    
    ROOMS {
        int id PK
        string slug
        string name
        string node_id
        string location
        int capacity
        string theme
        string api_key
        int acquisition_enabled
        int auto_cooling
        int ac_state
        int alert_spike
    }
    
    THRESHOLDS {
        int room_id PK,FK
        float temp_on
        float temp_off
        float temp_alert
        float humidity_max
    }
    
    SENSOR_LOGS {
        int id PK
        int room_id FK
        float temperature
        float humidity
        int occupancy
        int ac_state
        string status
        string source
        datetime recorded_at
    }
    
    ROOMS ||--o{ SENSOR_LOGS : "mencatat"
    ROOMS ||--|| THRESHOLDS : "memiliki batas"
