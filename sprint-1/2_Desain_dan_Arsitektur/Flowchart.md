
---

### 3. 📂 `sprint-1/2_Desain_dan_Arsitektur/Flowchart.md`

Ganti isi file dengan ini. Kita pisah jadi 2 alur: Alur User dan Alur Background Simulator.

```markdown
# FLOWCHART APLIKASI — Digital Twin Monitoring Ruangan

## 1. Alur Interaksi Pengguna (User Flow)

```mermaid
graph TD
    A([Mulai]) --> B[Buka Web]
    B --> C{Sudah Login?}
    C -->|Belum| D[Halaman Login]
    D --> E{Validasi Role}
    E -->|Admin| F[Dashboard Admin]
    E -->|Viewer| G[Dashboard Viewer]
    E -->|Gagal| D
    
    F --> H[Akses Kontrol & Pengaturan]
    F --> I[Lihat Grafik & Riwayat]
    F --> J[Export CSV]
    F --> K[Manajemen Ruangan]
    
    G --> I
    
    H --> L[Toggle Akuisisi / Auto-Cooling / AC]
    H --> M[Ubah Threshold]
    H --> N[Trigger Alert Demo]
    
    I --> O{Logout?}
    L --> O
    M --> O
    N --> O
    J --> O
    K --> O
    O -->|Ya| P([Selesai])
    O -->|Tidak| F
