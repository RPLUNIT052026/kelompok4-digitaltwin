# 🗄️ ENTITY RELATIONSHIP DIAGRAM (ERD) — Digital Twin

Dokumentasi ini memetakan struktur basis data **SQLite** yang diimplementasikan pada aplikasi Digital Twin. Penamaan atribut menggunakan format standar *snake_case* (contoh: `temperature`, `room_id`) dan telah disesuaikan secara presisi dengan kode *backend*.

---

<img src="./Entity Relationship Diagram.png" width="100%" alt="ERD Digital Twin">

---

## 🗂️ A. Daftar Tabel dan Atribut Utama

*(PK = Primary Key, FK = Foreign Key)*

*   **`users`**: Menyimpan kredensial autentikasi.
    *   *Atribut:* `id` (PK), `username`, `password_hash`, `role` (`'admin'` / `'viewer'`), `full_name`.
*   **`rooms`**: Entitas inti ruangan yang dimonitor.
    *   *Atribut:* `id` (PK), `slug`, `name`, `node_id`, `api_key`, `acquisition_enabled`, `auto_cooling`, `ac_state`, `alert_spike`.
*   **`thresholds`**: Menyimpan batas aman (*set point*) suhu ruangan.
    *   *Atribut:* `room_id` (PK, FK), `temp_on`, `temp_off`, `temp_alert`, `humidity_max`.
*   **`sensor_logs`**: Riwayat data sensor (*time-series*).
    *   *Atribut:* `id` (PK), `room_id` (FK), `temperature`, `humidity`, `occupancy`, `ac_state`, `status`, `source`, `recorded_at`.

---

## 🔀 B. Relasi Antar Tabel dan Kardinalitas

| Tabel Induk | Kardinalitas | Tabel Anak | Analisis Relasi |
|-------------|:------------:|------------|-----------------|
| `rooms` | **1 : N** | `sensor_logs` | Satu ruangan dapat mencatat ribuan riwayat log data sensor dari waktu ke waktu. |
| `rooms` | **1 : 1** | `thresholds` | Satu ruangan hanya memiliki satu set pengaturan batas suhu (*threshold*). |

---

## 🔍 C. Analisis Struktur Data
*   **Integritas Data (Cascade):** Tabel `thresholds` dan `sensor_logs` menggunakan *Foreign Key* dengan aturan `ON DELETE CASCADE`. Jika Admin menghapus ruangan dari tabel `rooms`, maka data *threshold* dan seluruh *log* sensor di ruangan tersebut akan otomatis terhapus, menjaga kebersihan *database*.
*   **Penyimpanan State Kontrol:** Status aktuator seperti `acquisition_enabled` (Pause/Resume) dan `ac_state` (AC Nyala/Mati) disimpan langsung di tabel `rooms` agar sistem dapat memulihkan kondisi terakhir saat di-*refresh*.
*   **Pemisahan Sumber Data:** Kolom `source` pada tabel `sensor_logs` membedakan apakah data berasal dari `SIMULATOR` (Python) atau `ESP32` (Hardware asli).

---

## 📌 D. Kesimpulan Tahap ERD

ERD ini menghasilkan **4 tabel utama** yang saling terhubung dan dirancang khusus untuk menangani data *time-series* IoT (Suhu, Kelembapan, Okupansi) secara *real-time*. Struktur ini sudah mencakup seluruh kebutuhan fitur kontrol, histori, dan integrasi perangkat keras.
