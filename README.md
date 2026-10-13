# Aplikasi Tracking Belajar & Berbagi Catatan Mahasiswa

Tugas Besar Kelompok 6 — S1 Teknologi Informasi, Telkom University.

Platform yang menggabungkan manajemen deadline tugas, jadwal, dan catatan pribadi dengan ruang berbagi catatan antar mahasiswa, dilengkapi moderasi konten (otomatis dan manual).

## Anggota Kelompok

- Nabil (103032400091)
- M Daffa AR-Rahman (103032430015)
- Fathi Arzaq Shiddiq (103032430030)
- I Made Rama Wijana Putra (103032400)

## Stack

- **Backend**: Laravel (REST API) + Laravel Sanctum
- **Frontend**: React (Vite) + Tailwind CSS
- **Database**: PostgreSQL
- **Hosting (staging/demo)**: Home server pribadi (Docker + Tailscale)

## Struktur Folder

```
tubes-tracking-belajar/
├── backend/        # Laravel API
├── frontend/        # React + Tailwind
├── docs/             # Proposal, diagram, dokumen pendukung
├── docker-compose.yml
├── .gitignore
└── .gitattributes
```

## Setup Awal (Sekali Saja)

### 1. Install prasyarat

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- PHP ≥ 8.2 + Composer — disarankan install lewat [Laragon](https://laragon.org/) kalau di Windows
- Node.js ≥ 18
- Git (CLI atau [GitHub Desktop](https://desktop.github.com/) buat yang belum terbiasa terminal)

### 2. Clone repo

```bash
git clone <url-repo-ini>
cd tubes-tracking-belajar
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

Frontend jalan di `http://localhost:5173`.

## Alur Kerja Git

Branch utama:

- `main` — stabil, nanti di-deploy ke home server.
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
