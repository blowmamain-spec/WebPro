# Aplikasi Tracking Belajar & Berbagi Catatan Mahasiswa

Tugas Besar Kelompok 6 — S1 Teknologi Informasi, Telkom University.

Platform yang menggabungkan manajemen deadline tugas, jadwal, dan catatan pribadi dengan ruang berbagi catatan antar mahasiswa, dilengkapi moderasi konten (otomatis dan manual).

## Anggota Kelompok

- Nabil (103032400091)
- M Daffa AR-Rahman (103032430015)
- Fathi Arzaq Shiddiq (103032430030)
- I Made Rama Wijana Putra (103032400)

## Stack

- **Backend**: Laravel (REST API) + Laravel Sanctum (token)
- **Frontend**: React (Vite) + React Router + Tailwind CSS
- **Database**: PostgreSQL — lokal lewat Docker, online di Supabase
- **Hosting**: frontend di Vercel; backend ditentukan saat tahap 2 (kandidat: Render, Railway, Laravel Cloud)

## Struktur Folder

```
WebPro/
├── backend/          # Laravel API
├── frontend/         # React + Tailwind
├── docs/             # Kontrak data, panduan, dokumen pendukung
├── docker-compose.yml
├── .gitignore
└── .gitattributes
```

### Isi `frontend/src`

```
src/
├── main.jsx          # Titik awal: memasang <App /> ke index.html
├── App.jsx           # Daftar alamat URL -> halaman (React Router)
├── index.css         # Style global + Tailwind
├── layouts/          # Kerangka halaman (sidebar mahasiswa / admin)
├── components/       # Potongan UI yang dipakai berulang (PageHeader, SidebarMenu, ...)
├── hooks/            # useMuatData: memuat data dari src/api
├── api/              # Fungsi pengambil data (tahap 1: data palsu, tahap 2: Laravel)
├── utils/format.js   # Format tanggal dan nama hari
└── pages/            # Satu file = satu halaman, dikelompokkan per domain
    ├── auth/         # Login, Daftar
    ├── tugas/        # Deadline Tugas, Tugas Kelompok
    ├── catatan/      # Catatan Saya, Editor, Jelajah, Detail, Tersimpan
    ├── waktu/        # Jadwal Mingguan, Kalender, Checklist Belajar
    └── admin/        # Ringkasan, Moderasi, Mata Kuliah, Kata Terlarang
```

## Rencana Pengerjaan

1. **Tahap 1 — Frontend.** Setiap halaman sudah mengambil data palsu dari `frontend/src/api/`. Kerjakan tampilannya di file halaman masing-masing.
2. **Tahap 2 — Backend.** Bergulir per fitur (boleh mulai sambil mengikuti materi Laravel di kelas): buat API Laravel-nya, lalu ganti isi fungsi di `frontend/src/api/` supaya memanggil backend.

Dokumen wajib baca:

- [`docs/panduan-frontend.md`](docs/panduan-frontend.md): cara kerja React di proyek ini, contekan JSX, aturan main.
- [`docs/kontrak-data.md`](docs/kontrak-data.md): bentuk data, keputusan desain, daftar endpoint API, pembagian domain.

## Setup Awal (Sekali Saja)

### 1. Install prasyarat

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- PHP ≥ 8.2 + Composer — disarankan install lewat [Laragon](https://laragon.org/) kalau di Windows
- Node.js ≥ 20.19
- Git (CLI atau [GitHub Desktop](https://desktop.github.com/) buat yang belum terbiasa terminal)

### 2. Clone repo

```bash
git clone <url-repo-ini>
cd WebPro
```

Atau lewat GitHub Desktop: **File → Clone Repository**.

### 3. Jalankan database (PostgreSQL via Docker)

Dari root folder repo:

```bash
docker compose up -d
```

Satu baris ini aja — Postgres langsung jalan di `localhost:5432`, sama persis buat semua orang. Nggak perlu install PostgreSQL terpisah.

### 4. Setup backend

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
php artisan serve
```

Backend jalan di `http://localhost:8000`.

### 5. Setup frontend

Di terminal baru:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend jalan di `http://localhost:5173`. Selama tahap 1, frontend sudah bisa dipakai tanpa backend (memakai data palsu).

## Deploy Frontend ke Vercel

1. Login ke [Vercel](https://vercel.com) pakai akun GitHub, lalu **Add New → Project** dan pilih repo ini.
2. Isi **Root Directory** dengan `frontend`. Framework terdeteksi otomatis sebagai Vite.
3. Di **Environment Variables**, isi `VITE_API_URL` dengan alamat backend (boleh dikosongkan selama tahap 1).
4. Klik **Deploy**. Setelah itu setiap push ke `main` otomatis di-deploy, dan setiap Pull Request dapat link preview sendiri.

File `frontend/vercel.json` membuat semua alamat (misal `/tugas`) diarahkan ke `index.html`, supaya halaman tidak 404 waktu di-refresh.

## Alur Kerja Git

Branch utama:

- `main` — stabil, otomatis di-deploy ke Vercel.
- `dev` — integrasi semua fitur, tempat testing bareng sebelum masuk `main`.
- `fitur/<nama-fitur>` — satu branch per fitur, cabang dari `dev`.

Langkah kerja:

1. `git checkout dev && git pull`
2. `git checkout -b fitur/nama-fitur-kamu`
3. Kerjain, commit sesering yang nyaman.
4. Push branch, buka Pull Request ke `dev` di GitHub.
5. Minimal 1 orang lain review sebelum di-merge.
6. **Jangan push langsung ke `main` atau `dev`** — selalu lewat Pull Request.

Buat yang pakai GitHub Desktop: semua langkah di atas ada tombolnya — "Current Branch" buat bikin/pindah branch, "Commit to ..." buat commit, "Push origin" buat push, dan tombol "Create Pull Request" buka ke GitHub.com.

## Pembagian Fitur & PIC

| Fitur | PIC |
| --- | --- |
| Deadline Tugas (dengan prioritas) | *(isi)* |
| Notifikasi | *(isi)* |
| Catatan | *(isi)* |
| Kalender | *(isi)* |
| Berbagi Catatan (posting, filter per matkul/tingkat) | *(isi)* |
| Simpan Catatan | *(isi)* |
| Checklist Belajar Mandiri | *(isi)* |
| Tugas Kelompok | *(isi)* |
| Jadwal Mingguan | *(isi)* |

## Role

- **Mahasiswa** — mengelola deadline tugas, jadwal, kalender, catatan pribadi, checklist belajar mandiri, tugas kelompok, serta memposting dan menyimpan catatan.
- **Admin** — memoderasi konten yang diposting dan mengelola kategori mata kuliah.
