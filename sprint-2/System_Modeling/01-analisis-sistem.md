# 📊 Dokumentasi Perancangan Sistem — Digital Twin Monitoring Ruangan

Dokumentasi ini merinci pemodelan sistem fungsional dan struktural dari platform **Digital Twin Monitoring Ruangan** yang dibangun berdasarkan pendekatan *Object-Oriented Analysis and Design (OOAD)*.

---

## 1. Context Diagram (Batasan & Aliran Data Sistem)

```mermaid
graph TB
    ADMIN[Admin Ruangan]
    DUMMY[Dummy Generator Python]
    DB[(Database SQLite)]
    SENSOR[Sensor ESP32 - Future]
    
    SISTEM((Sistem Digital Twin<br/>Monitoring Ruangan))
    
    ADMIN -->|Login, Lihat Data| SISTEM
    SISTEM -->|Tampilkan Dashboard| ADMIN
    
    DUMMY -->|Kirim Data Sensor| SISTEM
    SISTEM -->|Simpan Log| DB
    DB -->|Ambil Riwayat| SISTEM
    
    SENSOR -.->|Future| SISTEM
    
    style SISTEM fill:#3498db,color:#fff
    style ADMIN fill:#e74c3c,color:#fff
    style DUMMY fill:#f39c12,color:#fff
    style DB fill:#27ae60,color:#fff
```

### 🔑 Penjelasan & Cara Kerja

Diagram ini memandang sistem **Digital Twin Monitoring Ruangan** sebagai satu kesatuan proses tunggal yang berinteraksi dengan entitas luar:

- **Admin → Sistem:** Mengirimkan data login, meminta data sensor, dan melihat riwayat. Sistem membalas dengan menampilkan dashboard, grafik, dan notifikasi.
- **Dummy Generator → Sistem:** Mengirimkan data sensor (suhu, kelembapan, cahaya) setiap 5 detik sebagai simulasi.
- **Database → Sistem:** Menyimpan log sensor dan melayani permintaan riwayat data.
- **Sensor ESP32 (Future):** Rencana integrasi hardware asli pada pengembangan berikutnya.

### 🎯 Batas Sistem
- **Termasuk:** Login, dashboard, riwayat, threshold, notifikasi
- **Tidak Termasuk:** Hardware sensor asli, kontrol perangkat fisik, multi-user kompleks

---

## 2. Use Case Diagram (Interaksi Pengguna dengan Sistem)

```mermaid
graph LR
    ADMIN((Admin))
    
    subgraph SISTEM[Sistem Digital Twin Monitoring Ruangan]
        UC1([Login])
        UC2([Lihat Dashboard])
        UC3([Lihat Riwayat])
        UC4([Atur Threshold])
        UC5([Terima Notifikasi])
        UC6([Logout])
    end
    
    ADMIN --> UC1
    ADMIN --> UC2
    ADMIN --> UC3
    ADMIN --> UC4
    ADMIN --> UC5
    ADMIN --> UC6
    
    UC1 -.->|include| UC2
    UC2 -.->|include| UC5
    
    style ADMIN fill:#e74c3c,color:#fff
    style SISTEM fill:#ecf0f1
```

### 🔑 Penjelasan & Cara Kerja

- **Admin:** Memiliki akses penuh untuk login, melihat dashboard real-time, melihat riwayat data, mengatur ambang batas, dan menerima notifikasi.
- **Relasi Khusus (`<<include>>`):** Proses *Lihat Dashboard* wajib memicu proses *Terima Notifikasi* agar peringatan kondisi abnormal dapat ditampilkan.

### 📋 Detail Use Case

| ID | Use Case | Deskripsi | Prioritas |
|----|----------|-----------|-----------|
| UC-01 | Login | Masuk dengan username & password | Tinggi |
| UC-02 | Lihat Dashboard | Melihat kondisi ruangan real-time | Tinggi |
| UC-03 | Lihat Riwayat | Melihat log historis data sensor | Sedang |
| UC-04 | Atur Threshold | Mengubah ambang batas suhu/kelembapan | Sedang |
| UC-05 | Terima Notifikasi | Mendapat alert jika kondisi abnormal | Tinggi |
| UC-06 | Logout | Keluar dari sistem | Rendah |

---

## 3. Sequence Diagram (Alur Proses: Admin Melihat Dashboard)

```mermaid
sequenceDiagram
    actor Admin
    participant B as Browser
    participant F as Flask Backend
    participant G as Dummy Generator
    participant D as Database
    
    Admin->>B: Buka /dashboard
    B->>F: GET /dashboard
    F-->>B: HTML Dashboard
    
    loop Setiap 5 detik
        B->>F: GET /api/sensor
        F->>G: Minta data sensor
        G-->>F: suhu, kelembapan, cahaya
        F->>D: INSERT INTO sensor_logs
        F->>F: Cek threshold
        
        alt Suhu > 30°C
            F-->>B: JSON + notifikasi
        else Normal
            F-->>B: JSON data
        end
        
        B-->>Admin: Render grafik & card
    end
    
    Admin->>B: Klik Logout
    B->>F: GET /
    F-->>B: Halaman Login
```

### 🔑 Penjelasan & Cara Kerja

- **Admin → Browser:** Membuka halaman dashboard.
- **Browser → Flask:** Meminta HTML dashboard.
- **Loop setiap 5 detik:** Browser meminta data sensor terbaru.
- **Flask → Generator:** Mengambil data suhu, kelembapan, cahaya dari simulasi.
- **Flask → Database:** Menyimpan log sensor.
- **Flask → Flask:** Cek threshold.
- **Kondisi (alt):**
  - Jika suhu > 30°C → kirim notifikasi merah
  - Jika normal → kirim data grafik
- **Logout:** Admin keluar, browser kembali ke halaman login.

### 📋 Skenario

| Aspek | Keterangan |
|-------|-----------|
| Nama | Melihat Dashboard Real-time |
| Aktor | Admin |
| Precondition | Admin sudah login |
| Postcondition | Data sensor tampil di dashboard |

---

## 4. Class Diagram & Struktur Class (Struktur Statis Sistem)

```mermaid
classDiagram
    class User {
        -int id
        -string username
        -string password
        -datetime created_at
        +login()
        +logout()
    }
    
    class Room {
        -int id
        -string nama_ruangan
        -string lokasi
        -datetime created_at
        +getData()
        +updateRoom()
    }
    
    class Threshold {
        -int id
        -float max_suhu
        -float min_kelembapan
        -float max_cahaya
        +cekThreshold()
        +updateThreshold()
    }
    
    class SensorLog {
        -int id
        -float suhu
        -float kelembapan
        -float cahaya
        -bool occupancy
        -datetime timestamp
        +simpan()
        +getRiwayat()
    }
    
    class Dashboard {
        +tampilSuhu()
        +tampilKelembapan()
        +tampilGrafik()
        +tampilNotifikasi()
    }
    
    Room "1" --> "1" Threshold : punya
    Room "1" --> "N" SensorLog : mencatat
    User "1" --> "N" SensorLog : memantau
    Dashboard ..> SensorLog : baca
    Dashboard ..> Threshold : cek
```

### 🔑 Penjelasan & Cara Kerja

- **User:** Merepresentasikan admin sistem dengan atribut login dan operasi autentikasi.
- **Room:** Merepresentasikan ruangan yang dimonitor, memiliki data lokasi dan operasi pengambilan data.
- **Threshold:** Menyimpan ambang batas kondisi ideal ruangan (suhu, kelembapan, cahaya).
- **SensorLog:** Mencatat semua data sensor yang masuk beserta timestamp.
- **Dashboard:** Class antarmuka yang menampilkan data ke pengguna.

### 📋 Relasi Antar Class

| Relasi | Tipe | Multiplicity | Keterangan |
|--------|------|--------------|-----------|
| Room → Threshold | Composition | 1 : 1 | 1 ruangan punya 1 threshold |
| Room → SensorLog | Aggregation | 1 : N | 1 ruangan punya banyak log |
| User → SensorLog | Association | 1 : N | 1 user memantau banyak log |
| Dashboard → SensorLog | Dependency | - | Dashboard membaca data log |
| Dashboard → Threshold | Dependency | - | Dashboard cek ambang batas |

### 🔣 Simbol Multiplicity

| Simbol | Arti |
|--------|------|
| `1` | Tepat satu |
| `0..1` | Nol atau satu |
| `1..*` | Satu atau lebih |
| `*` | Nol atau lebih |

---

## 📚 Referensi

1. Sommerville, I. (2016). *Software Engineering* (10th ed.). Chapter 5: System Modeling. Pearson.
2. OMG UML Specification 2.5.1. https://www.omg.org/spec/UML/
3. Pressman, R. S. (2001). *Software Engineering: A Practitioner's Approach* (5th ed.). McGraw-Hill.

---

**Sprint 2 — System Modeling**  
**Digital Twin Monitoring Ruangan**  
**Universitas Samudra — Informatika**
---

## 5. State Diagram (Perubahan Perilaku Sistem)

```mermaid
stateDiagram-v2
    [*] --> Waiting : Sistem dinyalakan
    
    Waiting --> Monitoring : Admin Login
    Monitoring --> Normal : Data diterima & threshold OK
    Monitoring --> Alert : Data melebihi threshold
    
    Normal --> Monitoring : Update grafik real-time
    Alert --> Monitoring : User acknowledge (klik OK)
    Alert --> Normal : Suhu kembali normal
    
    Monitoring --> Waiting : Admin Logout
    Waiting --> [*] : Sistem dimatikan
```

### 🔑 Penjelasan & Cara Kerja
Diagram ini menunjukkan transisi status sistem. Saat sistem menyala, ia berada di status `Waiting`. Saat Admin login, ia masuk ke `Monitoring`. Jika data dari generator melebihi threshold, status berubah menjadi `Alert` (memunculkan notifikasi), dan kembali ke `Normal` jika kondisi sudah membaik.

---
