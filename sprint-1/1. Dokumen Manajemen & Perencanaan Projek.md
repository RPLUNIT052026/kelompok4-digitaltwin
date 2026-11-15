# 📊 Dokumen Perhitungan Function Point & Product Backlog
## Digital Twin Sistem Monitoring Ruangan/Kelas

---

## A. Perhitungan Function Point (FP)

Function Point digunakan untuk mengestimasi ukuran/kompleksitas aplikasi berdasarkan fitur yang direncanakan, sebelum development dimulai.

### 1. Identifikasi Komponen Fungsional

| No | Komponen | Tipe | Kompleksitas | Bobot |
|----|----------|------|----------------|-------|
| 1 | Input data sensor (suhu, kelembapan, occupancy) | External Input (EI) | Low | 3 |
| 2 | Login/autentikasi pengguna | External Input (EI) | Low | 3 |
| 3 | Tampilan dashboard kondisi ruangan real-time | External Output (EO) | Average | 5 |
| 4 | Notifikasi otomatis (alert kondisi tidak ideal) | External Output (EO) | Average | 5 |
| 5 | Riwayat data sensor (log historis) | External Inquiry (EQ) | Low | 3 |
| 6 | Data penyimpanan kondisi ruangan (database) | Internal Logical File (ILF) | Low | 7 |
| 7 | Koneksi ke sensor/mikrokontroler eksternal (ESP32) | External Interface File (EIF) | Average | 7 |

### 2. Tabel Ringkasan Unadjusted Function Point (UFP)

| Tipe Komponen | Jumlah | Bobot Rata-rata | Total |
|----------------|--------|------------------|-------|
| External Input (EI) | 2 | 3 | 6 |
| External Output (EO) | 2 | 5 | 10 |
| External Inquiry (EQ) | 1 | 3 | 3 |
| Internal Logical File (ILF) | 1 | 7 | 7 |
| External Interface File (EIF) | 1 | 7 | 7 |
| **Total UFP** | | | **33** |

### 3. Value Adjustment Factor (VAF) — Sederhana

Untuk proyek skala kelas/kuliah, VAF bisa diasumsikan netral (VAF = 1.0), karena belum ada 14 faktor kompleksitas teknis yang dinilai detail. Jika ingin lebih presisi, VAF dapat dihitung dari 14 General System Characteristics (GSC), skala 0–5 tiap faktor.

**Rumus:**
```
FP = UFP x VAF
FP = 33 x 1.0 = 33
```

> Catatan: Angka-angka di atas adalah estimasi awal. Sesuaikan kembali dengan fitur final yang disepakati tim sebelum development dimulai.

---

## B. Product Backlog (Keseluruhan Proyek)

Daftar fitur/User Stories yang direncanakan untuk seluruh proyek (Sp1–Sp5):

| ID | User Story | Prioritas |
|----|-----------|-----------|
| US-01 | Sebagai pengguna, saya ingin melihat suhu ruangan secara real-time agar tahu kondisi kenyamanan ruangan | Tinggi |
| US-02 | Sebagai pengguna, saya ingin melihat kelembapan ruangan secara real-time | Tinggi |
| US-03 | Sebagai pengguna, saya ingin mengetahui status occupancy (ada orang/kosong) di ruangan | Sedang |
| US-04 | Sebagai pengguna, saya ingin menerima notifikasi otomatis jika kondisi ruangan tidak ideal | Tinggi |
| US-05 | Sebagai pengguna, saya ingin melihat riwayat data kondisi ruangan dalam bentuk grafik | Sedang |
| US-06 | Sebagai admin, saya ingin login ke sistem agar data ruangan aman | Sedang |
| US-07 | Sebagai pengguna, saya ingin melihat representasi visual 3D ruangan yang berubah warna sesuai kondisi | Rendah |
| US-08 | Sebagai pengguna, saya ingin mendapat prediksi tingkat kenyamanan belajar berdasarkan data sensor | Rendah |

---

## C. Sprint 1 Backlog

Target kerja spesifik yang harus diselesaikan pada Sprint 1 (bukan development fitur, tapi tahap persiapan):

| Task | Deskripsi | Penanggung Jawab |
|------|-----------|-------------------|
| Project Charter | Menyusun latar belakang, tujuan, ruang lingkup, struktur tim | Lyebra Hima |
| Perhitungan Function Point | Estimasi ukuran aplikasi berdasarkan fitur yang direncanakan | Muhammad Zawaata Afnan |
| Product Backlog & Sprint 1 Backlog | Menyusun daftar User Stories dan target Sprint 1 | Lyebra Hima |
| Rancangan UX/UI | Membuat wireframe/mockup dashboard awal | Ikhsan Fadriansyah |
| Rancangan Sistem | Membuat flowchart/diagram arsitektur/ERD | Muhammad Zawaata Afnan |
| Inisialisasi Kode Proyek | Setup struktur folder & boilerplate awal | Lyebra Hima |
