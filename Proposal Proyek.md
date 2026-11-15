# 📄 Proposal Proyek — Digital Twin Sistem Monitoring Ruangan/Kelas

## 1. Latar Belakang

Ruangan kelas atau lab sering tidak nyaman digunakan karena kondisi suhu, kelembapan, atau kualitas udara yang tidak terpantau secara real-time. Diperlukan sistem yang dapat merepresentasikan kondisi fisik ruangan secara digital (digital twin) agar pengelola dapat memantau dan mengambil tindakan lebih cepat.

## 2. Tujuan

- Memantau kondisi ruangan (suhu, kelembapan, kualitas udara, occupancy) secara real-time
- Merepresentasikan kondisi tersebut dalam bentuk digital twin (dashboard visual)
- Memberikan notifikasi otomatis saat kondisi ruangan tidak ideal

## 3. Keputusan Sprint 1

### a. Agile Methodology
- Metodologi yang digunakan: **Scrum**
- Durasi sprint: ± 1 bulan per sprint (mengikuti timeline Sp1–Sp5)
- Role tim: 1 orang sebagai **Scrum Master** (koordinator), sisanya **Development Team**
- Tools tracking task: **GitHub Projects**

### b. UX Design
- Dashboard dirancang dengan wireframe sederhana (Figma/sketsa) sebelum masuk development
- Elemen utama dashboard:
  - Panel suhu (angka + indikator warna: hijau/kuning/merah)
  - Panel kelembapan
  - Status occupancy (ada orang/kosong)
  - Notifikasi/alert (contoh: banner "Ruangan pengap")
- Alur pengguna: buka dashboard → lihat kondisi ruangan real-time → menerima notifikasi jika ada anomali

### c. Project Setup
- Struktur folder awal repository:
  ```
  /docs        → dokumen sprint, proposal
  /backend     → server penerima data sensor
  /frontend    → dashboard
  /iot         → kode ESP32/Arduino atau dummy_data_generator.py
  README.md
  ```
- Tech stack awal: Python Dummy Data Generator (data), Flask/Node.js (backend), HTML/JS + Chart.js (dashboard awal)

## 4. Arsitektur Sistem

### a. Physical Object (Sumber Data)
- **Opsi 1 (Hardware):** Sensor DHT11/DHT22 (suhu & kelembapan) + sensor gerak/cahaya, terhubung ke mikrokontroler ESP32/ESP8266/Arduino
- **Opsi 2 (Tanpa Hardware):** Dummy Data Generator menggunakan Python script yang mensimulasikan data sensor

### b. Digital Twin (Representasi Digital)
- Dashboard UI berbasis web (contoh: Grafana, ThingSpeak, atau dashboard custom)
- (Opsional, jika waktu memungkinkan) Visualisasi 3D ruangan menggunakan Three.js/Unity, berubah warna sesuai kondisi (misal merah = panas)

### c. Fitur Tambahan
- Prediksi tingkat kenyamanan belajar berdasarkan data sensor
- Notifikasi otomatis, contoh: "Ruangan pengap, disarankan membuka jendela"

## 5. Tech Stack (Rencana Awal)

| Komponen | Teknologi |
|----------|-----------|
| Sumber Data | ESP32 + DHT22 / Python Dummy Data |
| Backend | (isi sesuai kesepakatan tim, contoh: Node.js/Flask) |
| Database | (contoh: Firebase/MySQL/InfluxDB) |
| Dashboard | Grafana / Dashboard custom (HTML+JS/Three.js) |
| Komunikasi | MQTT / HTTP REST API |

## 6. Rencana Sprint

| Sprint | Bulan | Fokus |
|--------|-------|-------|
| Sp1 | September | Tentukan arsitektur (hardware/dummy), UX dashboard, setup repo |
| Sp2 | October | Backend penerima data + dashboard dasar |
| Sp3 | November | Fitur notifikasi & prediksi kenyamanan, refinement |
| Sp4 | December | Testing, upgrade visual (jika sempat) |
| Sp5 | December | Final testing, bug fixing, persiapan demo Expo |

## 7. Anggota Tim

| Nama | NIM | Peran |
|------|-----|-------|
| Ikhsan Fadriansyah | 240504134 | UX/UI Designer |
| Lyebra Hima | 240504038 | Ketua / Scrum Master |
| Muhammad Zawaata Afnan | 240504098 | Backend Developer |
