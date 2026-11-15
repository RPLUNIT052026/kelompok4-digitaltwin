# 📊 Dokumentasi Perancangan Sistem — Digital Twin Monitoring Ruangan

Dokumentasi ini merinci pemodelan sistem fungsional dan struktural berdasarkan **Product Backlog (Sprint 1)**. Sistem ini dirancang *Zero Budget* (tanpa biaya hardware) menggunakan simulasi data.

---

## 1. Context Diagram (Batasan & Aliran Data Sistem)

```mermaid
graph TB
    ADMIN[Admin Ruangan]
    DUMMY[Dummy Generator Python]
    DB[(Database SQLite)]
    
    SISTEM((Sistem Digital Twin<br/>Monitoring Ruangan))
    
    ADMIN -->|Login, Kontrol ON/OFF, Lihat Data| SISTEM
    SISTEM -->|Tampilkan Dashboard, Riwayat, Notifikasi| ADMIN
    
    DUMMY -->|Kirim Data Suhu, Kelembapan, Occupancy| SISTEM
    SISTEM -->|Simpan Log| DB
    DB -->|Ambil Riwayat| SISTEM
    
    style SISTEM fill:#3498db,color:#fff
    style ADMIN fill:#e74c3c,color:#fff
    style DUMMY fill:#f39c12,color:#fff
    style DB fill:#27ae60,color:#fff
```

### 🔑 Penjelasan & Cara Kerja
- **Admin** berinteraksi untuk login, menyalakan/mematikan sistem (On/Off), dan melihat data.
- **Dummy Generator** mensimulasikan pembacaan sensor (Suhu, Kelembapan, Occupancy) tanpa perlu hardware fisik.
- **Database SQLite** menyimpan histori data untuk ditampilkan di grafik.

---

## 2. Use Case Diagram (Interaksi Pengguna dengan Sistem)

```mermaid
graph LR
    ADMIN((Admin))
    
    subgraph SISTEM[Sistem Digital Twin Monitoring Ruangan]
        UC1([Login])
        UC2([Kontrol Sistem ON/OFF])
        UC3([Lihat Dashboard Real-time])
        UC4([Lihat Riwayat Data])
        UC5([Atur Threshold])
        UC6([Terima Notifikasi])
    end
    
    ADMIN --> UC1
    ADMIN --> UC2
    ADMIN --> UC3
    ADMIN --> UC4
    ADMIN --> UC5
    ADMIN --> UC6
    
    UC2 -.->|include| UC3
    UC3 -.->|include| UC6
    
    style ADMIN fill:#e74c3c,color:#fff
    style SISTEM fill:#ecf0f1
```

### 🔑 Penjelasan & Cara Kerja
- **UC-02 Kontrol Sistem ON/OFF:** Fitur tambahan untuk memulai atau menghentikan simulasi data sensor.
- **UC-03 & UC-06:** Saat dashboard dinyalakan, admin melihat data Suhu, Kelembapan, dan Occupancy (Sesuai Sprint 1). Jika melewati threshold, notifikasi muncul.

---

## 3. Sequence Diagram (Alur Proses: Admin Menyalakan Sistem & Melihat Dashboard)

```mermaid
sequenceDiagram
    actor Admin
    participant B as Browser
    participant F as Flask Backend
    participant G as Dummy Generator
    participant D as Database
    
    Admin->>B: Klik Tombol SISTEM ON
    B->>F: POST /api/system/toggle - status ON
    F-->>B: Sistem Aktif
    
    loop Setiap 5 detik saat ON
        G->>F: POST /api/sensor - Suhu, Kelembapan, Occupancy
        F->>D: INSERT INTO sensor_logs
        F->>F: Cek Threshold
        
        alt Suhu atau Kondisi Tidak Ideal
            F-->>B: JSON + Notifikasi Alert
        else Normal
            F-->>B: JSON data Suhu, Kelembapan, Occupancy
        end
        
        B-->>Admin: Update Grafik and Card Dashboard
    end
    
    Admin->>B: Klik Tombol SISTEM OFF
    B->>F: POST /api/system/toggle - status OFF
    F-->>B: Sistem Berhenti
```

### 🔑 Penjelasan & Cara Kerja
Alur ini menunjukkan tombol ON memicu sistem untuk menerima data dari Dummy Generator secara berkala. Jika tombol OFF diklik, aliran data berhenti.

---

## 4. Class Diagram & Struktur Class (Struktur Statis Sistem)

```mermaid
classDiagram
    class User {
        -int id
        -string username
        -string password
        +login()
        +logout()
    }
    
    class SystemController {
        -bool is_active
        +turnOn()
        +turnOff()
        +getStatus()
    }
    
    class Room {
        -int id
        -string nama_ruangan
        -string lokasi
    }
    
    class Threshold {
        -float max_suhu
        -float min_kelembapan
        +cekThreshold()
    }
    
    class SensorLog {
        -int id
        -float suhu
        -float kelembapan
        -bool occupancy
        -datetime timestamp
        +simpan()
        +getRiwayat()
    }
    
    class Dashboard {
        +tampilSuhu()
        +tampilKelembapan()
        +tampilOccupancy()
        +tampilGrafik()
    }
    
    User "1" --> "1" SystemController : mengontrol
    SystemController "1" --> "1" SensorLog : mengizinkan data
    Room "1" --> "1" Threshold : punya
    Room "1" --> "N" SensorLog : mencatat
    Dashboard ..> SensorLog : baca
```

### 🔑 Penjelasan & Cara Kerja
- **SystemController:** Class baru untuk mengatur status ON/OFF website.
- **SensorLog:** Mencatat 3 variabel utama dari Sprint 1: `suhu`, `kelembapan`, dan `occupancy`.
- **Dashboard:** Menampilkan ketiga variabel tersebut.

---

## 5. State Diagram (Perubahan Perilaku Sistem)

```mermaid
stateDiagram-v2
    [*] --> Waiting : Sistem dinyalakan
    
    Waiting --> Monitoring : Admin klik ON
    Monitoring --> Normal : Data diterima - Suhu dan Kelembapan OK
    Monitoring --> Alert : Data melewati threshold
    
    Normal --> Monitoring : Update dashboard
    Alert --> Monitoring : User acknowledge
    Alert --> Normal : Kondisi kembali normal
    
    Monitoring --> Waiting : Admin klik OFF
    Waiting --> [*] : Sistem dimatikan
```

### 🔑 Penjelasan & Cara Kerja
Sistem memiliki state `Waiting` saat menunggu di-ON-kan. Saat tombol ON ditekan, ia masuk ke `Monitoring`. Dari sana ia bisa berubah ke `Normal` atau `Alert` tergantung data sensor.

---

## 6. Framework & Tech Stack (Zero Budget)

Sesuai kesepakatan, proyek ini **tidak memerlukan biaya sepeser pun (Rp 0)**.

| Komponen | Teknologi | Biaya |
|----------|-----------|-------|
| Backend | Python (Flask) | Gratis |
| Database | SQLite | Gratis |
| Frontend | HTML, Tailwind CSS (CDN), Chart.js | Gratis |
| Simulasi Data | Python `random` & `time` | Gratis |
| Hosting | Localhost / GitHub Pages / Render | Gratis |
