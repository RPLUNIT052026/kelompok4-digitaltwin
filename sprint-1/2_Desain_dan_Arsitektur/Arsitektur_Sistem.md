# 🏗️ ARSITEKTUR SISTEM — Digital Twin Monitoring Ruangan

Dokumentasi ini menjelaskan struktur teknis (technical structure) dari aplikasi **Digital Twin**. Arsitektur dirancang berlapis (layered architecture) untuk memisahkan tanggung jawab antara antarmuka, logika bisnis, dan penyimpanan data, sehingga sistem mudah dikembangkan (scalable) dan dipelihara.

---

## 🏛️ A. Lapisan Arsitektur (Layers)

Sistem ini terdiri dari empat lapisan utama yang saling terintegrasi:

### 1. Client Layer (Frontend)
Lapisan antarmuka yang berinteraksi langsung dengan pengguna. Dibangun menggunakan **HTML, Tailwind CSS, dan Chart.js**.
*   **Dashboard Admin/Viewer:** Menampilkan data real-time, grafik historis, dan panel kontrol (khusus admin).
*   **Kiosk Display (Public):** Tampilan *fullscreen* untuk layar monitor di depan ruangan tanpa memerlukan login.

### 2. Application Layer (Backend)
Menggunakan **Python (Flask)** sebagai pusat kendali (REST API).
*   **Autentikasi & Otorisasi:** Mengelola sesi login (Admin vs Viewer).
*   **Logika Closed-Loop (Auto-Cooling):** Mengevaluasi data sensor dan memutuskan kapan AC harus menyala/mati.
*   **API Endpoint:** Menyediakan *endpoint* seperti `/api/sensor` untuk menerima data dari perangkat keras.

### 3. Background Simulator Layer
Sebuah *daemon thread* yang berjalan di latar belakang (menggunakan `threading` di Python).
*   Berfungsi sebagai **Dummy Generator** yang mensimulasikan data fisika ruangan setiap **3 detik** (suhu, kelembapan, okupansi) jika perangkat keras (ESP32) tidak terpasang.
*   Memastikan aplikasi tetap bisa didemonstrasikan tanpa biaya hardware (*Zero Budget*).

### 4. Data & Hardware Layer
*   **Database Layer:** Menggunakan **SQLite (Mode WAL)** untuk *concurrent read/write* yang cepat. Menyimpan tabel `users`, `rooms`, `thresholds`, dan `sensor_logs`.
*   **Hardware Layer (Future-ready):** Integrasi **ESP32 + Sensor** melalui protokol HTTP POST dengan autentikasi `X-API-Key`.

---

## 📊 B. Pemetaan Komponen (Component Mapping)

| No | Komponen Sistem | Teknologi | Peran Utama |
|:--:|-----------------|-----------|-------------|
| 1 | User Interface | HTML, JS, Chart.js | Menampilkan visualisasi data dan tombol kontrol. |
| 2 | Web Server | Flask (Python) | Menangani *routing*, API, dan *session management*. |
| 3 | Simulator Engine | Python Threading | Men-generate *fake data* setiap 3 detik. |
| 4 | Database | SQLite (WAL) | Menyimpan *state* ruangan dan histori log. |
| 5 | IoT Device | ESP32 (Opsional) | Mengirim data sensor asli via API. |

---

## 🔗 C. Jalur Komunikasi Antar Lapisan

| Dari | Ke | Protokol | Keterangan |
|------|----|----------|------------|
| Browser | Flask Backend | HTTP/REST | Request halaman, ambil data JSON (`/api/telemetry`). |
| Flask Backend | SQLite DB | SQL Query | Operasi CRUD (Create, Read, Update, Delete). |
| ESP32 (Hardware) | Flask Backend | HTTP POST | Mengirim data `{temperature, humidity, occupancy}` + API Key. |
| Background Thread | SQLite DB | Internal Python | Menyisipkan log baru setiap 3 detik. |

---

## 💡 D. Kelebihan Arsitektur Ini
> **Zero Budget:** Berjalan 100% lokal tanpa server cloud berbayar.
> **Hybrid:** Bisa memakai data simulasi (Software) atau hardware asli (IoT).
> **Scalable:** Mendukung multi-room secara dinamis (bisa tambah/hapus ruangan via API).
