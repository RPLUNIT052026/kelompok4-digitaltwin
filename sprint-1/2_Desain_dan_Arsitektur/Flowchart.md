# FLOWCHART APLIKASI — Digital Twin Monitoring Ruangan

## Alur Utama Sistem

```mermaid
graph TD
    A([Mulai]) --> B[Buka Aplikasi]
    B --> C[Halaman Login]
    C --> D[Input Username dan Password]
    D --> E{Validasi?}
    E -->|Tidak| F[Tampilkan Error]
    F --> C
    E -->|Ya| G[Dashboard Utama]
    G --> H[Dummy Generator kirim data tiap 5 detik]
    H --> I[Cek Threshold]
    I --> J{Melewati batas?}
    J -->|Ya| K[Tampilkan Notifikasi]
    J -->|Tidak| L[Update Grafik]
    K --> M[Simpan ke Database]
    L --> M
    M --> N{User Logout?}
    N -->|Tidak| H
    N -->|Ya| O([Selesai])
```

## Penjelasan Alur

1. **Mulai** - Aplikasi dibuka oleh admin
2. **Login** - Admin memasukkan username dan password
3. **Validasi** - Jika gagal, tampilkan error; jika berhasil, masuk dashboard
4. **Data Generator** - Script Python mensimulasikan data sensor setiap 5 detik
5. **Cek Threshold** - Sistem membandingkan data dengan ambang batas
6. **Notifikasi** - Jika melewati batas, banner alert muncul
7. **Update Grafik** - Jika normal, grafik diperbarui
8. **Simpan Log** - Setiap data disimpan ke database
9. **Loop** - Proses berulang hingga user logout

## Diagram Alur Data

```mermaid
sequenceDiagram
    participant U as User
    participant B as Browser
    participant F as Flask Backend
    participant D as Database
    participant G as Dummy Generator
    
    U->>B: Buka Dashboard
    B->>F: GET /api/sensor
    F->>G: Minta data
    G-->>F: Data sensor
    F->>D: Simpan log
    F-->>B: JSON response
    B-->>U: Tampilkan grafik & card
    Note over B,G: Loop setiap 5 detik
```
