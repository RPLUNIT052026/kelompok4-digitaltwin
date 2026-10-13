# ARSITEKTUR SISTEM — Digital Twin Monitoring Ruangan

## 1. Diagram Arsitektur

```mermaid
graph TB
    subgraph PRESENTASI[Lapisan Presentasi]
        A[Browser - HTML + CSS + Chart.js]
    end
    
    subgraph APLIKASI[Lapisan Aplikasi]
        B[Flask Backend - Python]
        B1[Autentikasi]
        B2[Logika Threshold]
        B3[API /api/sensor]
    end
    
    subgraph DATA[Lapisan Data]
        C[SQLite Database]
    end
    
    subgraph SUMBER[Sumber Data - Physical Object]
        D[Dummy Generator - Python]
        E[ESP32 + DHT22 - Future]
    end
    
    A -->|HTTP Request| B
    B --> B1
    B --> B2
    B --> B3
    B -->|Query| C
    D -->|Data Sensor| B
    E -.->|Future| B
```

## 2. Penjelasan Layer

| Layer | Komponen | Fungsi |
|-------|----------|--------|
| **Presentasi** | HTML, CSS, Chart.js | Menampilkan UI ke pengguna |
| **Aplikasi** | Flask (Python) | Memproses request, logika bisnis |
| **Data** | SQLite | Menyimpan data sensor, user, threshold |
| **Sumber Data** | Dummy Generator / ESP32 | Menghasilkan data sensor |

## 3. Alur Komunikasi

```mermaid
sequenceDiagram
    participant U as User
    participant B as Browser
    participant F as Flask
    participant S as SQLite
    participant G as Generator
    
    U->>B: Buka Dashboard
    B->>F: GET /api/sensor
    F->>G: Ambil data
    G-->>F: suhu, kelembapan, cahaya, occupancy
    F->>S: INSERT INTO sensor_logs
    F-->>B: JSON
    B-->>U: Render grafik
    Note over B,G: Polling setiap 5 detik
```

## 4. Teknologi yang Digunakan

| Komponen | Teknologi | Alasan |
|----------|-----------|--------|
| Backend | Flask | Ringan, mudah dipelajari |
| Database | SQLite | Tidak perlu server, portable |
| Frontend | HTML + Chart.js | Simple, tanpa framework berat |
| Data Simulasi | Python | Sesuai untuk dummy generator |
| Version Control | Git + GitHub | Standar industri |
| Diagram | Mermaid | Render langsung di GitHub |

## 5. Kelebihan Arsitektur Ini

- **Modular** - Setiap layer terpisah, mudah dikembangkan
- **Tanpa Hardware** - Bisa jalan dengan dummy data
- **Future-proof** - Siap diintegrasikan dengan ESP32 nanti
- **Ringan** - Tidak butuh server besar
