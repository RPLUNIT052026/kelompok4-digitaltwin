# 🎨 RANCANGAN UX/UI — High-Fidelity Wireframe

Dokumentasi rancangan antarmuka (*Client Layer*) aplikasi Digital Twin. Rancangan ini dibuat menggunakan pendekatan **Modern Dark Mode SaaS** yang bertujuan untuk meminimalisir kelelahan mata (*eye strain*) saat memantau layar dalam waktu lama, dengan indikator visual yang jelas.

---

<img src="./Wireframe UI UX.png" width="100%" alt="Wireframe UI UX Digital Twin">

---

## 🖥️ A. Halaman 1: Dashboard Admin & Viewer
Tampilan utama untuk memantau dan mengontrol ruangan secara *real-time*.
*   **Header & Navigasi:** Terdapat *dropdown* untuk berpindah antar-ruangan (Multi-room), indikator status koneksi, dan tombol *Logout*.
*   **Card Metrik Utama:** Menampilkan 3 angka besar: Suhu (°C), Kelembapan (%), dan Okupansi (Orang).
*   **Visualisasi Spasial (Digital Twin):** Menampilkan denah ruangan 2D secara interaktif. Posisi sensor dan efek pendingin AC (*cooling wave*) digambarkan secara visual.
*   **Grafik Real-time:** Menggunakan *Line Chart* untuk memantau tren 30 data terakhir.
*   **Panel Kontrol (Khusus Admin):** Tombol *Toggle* untuk Pause Akuisisi, Auto-Cooling, serta tombol `Trigger Alert` dan `Export CSV`.

## ⚙️ B. Halaman 2: Manajemen Ruangan (Modal Admin)
*   **Form Tambah Ruangan:** Input untuk Nama Ruangan, Kapasitas, Lokasi, dan pengaturan *Threshold*.
*   **Daftar Ruangan:** Menampilkan tabel ruangan aktif beserta tombol *Delete*.
*   **Integrasi Hardware:** Menampilkan `API Key` dan URL *endpoint* yang bisa disalin untuk konfigurasi perangkat ESP32.

## 📺 C. Halaman 3: Kiosk Mode (Public Display)
*   Tampilan layar penuh (*fullscreen*) tanpa *sidebar* atau navigasi.
*   Menggunakan tipografi berukuran raksasa agar mudah dibaca dari jarak jauh (misal: dipasang di TV depan pintu lab).
*   Hanya menampilkan informasi esensial: Nama Ruangan, Suhu, Kelembapan, dan Status (OPTIMAL/COOLING/CRITICAL).

---

## 🔗 D. Pemetaan UI ke Database (Traceability)

| Komponen UI | Data yang Ditampilkan | Tabel Database |
|-------------|-----------------------|----------------|
| Pilihan Ruangan (Dropdown) | Nama & Node ID | `rooms` |
| Angka Suhu & Kelembapan | Nilai Sensor Terakhir | `sensor_logs` |
| Status AC (ON/STANDBY) | Status Aktuator | `rooms` (`ac_state`) |
| Form Pengaturan | Batas Atas/Bawah Suhu | `thresholds` |

---

## 🎨 E. Palet Warna Indikator Status
| Status | Warna | Kode Hex | Makna |
|--------|-------|----------|-------|
| **OPTIMAL** | 🟢 Hijau | `#10B981` | Suhu dan kelembapan di zona nyaman. |
| **WARNING** | 🟡 Kuning | `#F59E0B` | Suhu mendekati batas bahaya (`temp_on`). |
| **COOLING** | 🔵 Biru | `#3B82F6` | AC sedang menyala mendinginkan ruangan. |
| **CRITICAL** | 🔴 Merah | `#EF4444` | Suhu melewati batas bahaya (`temp_alert`). |

---

## 📌 F. Kesimpulan Tahap UI/UX

Rancangan antarmuka ini mengutamakan fungsionalitas dan estetika. Fitur **Visualisasi Spasial (Denah 2D)** membedakan aplikasi ini dari *dashboard* biasa, memberikan representasi *Digital Twin* yang sesungguhnya. Pembagian halaman yang jelas antara Admin, Manajemen, dan Kiosk Publik memastikan setiap *user persona* mendapatkan pengalaman yang sesuai dengan kebutuhannya.
