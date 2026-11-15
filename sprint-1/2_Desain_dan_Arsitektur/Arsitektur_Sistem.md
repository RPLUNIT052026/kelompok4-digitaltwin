
---

### 2. 📂 `sprint-1/2_Desain_dan_Arsitektur/Arsitektur_Sistem.md`

Ganti isi file dengan ini. Kita ubah ESP32 jadi *real* (bukan future), tambahkan Simulator Thread, dan perbaiki rate ke 3 detik.

```markdown
# ARSITEKTUR SISTEM — Digital Twin Monitoring Ruangan

## 1. Diagram Arsitektur

```mermaid
graph TB
    subgraph PRESENTASI[Lapisan Presentasi]
        A[Browser Admin/Viewer - HTML + Chart.js]
        A2[Kiosk Display - Public]
    end
    
    subgraph APLIKASI[Lapisan Aplikasi]
        B[Flask Backend - Python]
        B1[Autentikasi & Role]
        B2[Logika Closed-Loop Auto-Cooling]
        B3[API Endpoints /api/sensor]
        B4[Background Simulator Thread]
    end
    
    subgraph DATA[Lapisan Data]
        C[(SQLite Database - WAL Mode)]
    end
    
    subgraph SUMBER[Sumber Data]
        D[Dummy Generator - Python]
        E[ESP32 + Sensor Fisik]
    end
    
    A -->|HTTP Request + Session| B
    A2 -->|HTTP Request Public| B
    B --> B1
    B --> B2
    B --> B3
    B --> B4
    B -->|SQL Query| C
    B4 -->|Generate Data tiap 3 detik| C
    D -->|Terintegrasi di B4| B4
    E -.->|POST /api/sensor + X-API-Key| B3
