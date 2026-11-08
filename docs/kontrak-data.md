# Kontrak Data

Dokumen ini adalah **kesepakatan bentuk data** antara frontend dan backend. Frontend tahap 1 memakai data palsu (`frontend/src/api/data-palsu.js`) yang bentuknya persis seperti di sini, jadi waktu backend jadi, halaman tidak perlu diubah.

**Kalau mau mengubah nama kolom atau bentuk data, ubah dokumen ini dulu dan kabari grup.**

## Keputusan desain

| Topik | Keputusan |
| --- | --- |
| Moderasi | **Setelah tayang.** Catatan yang dibagikan langsung `publik`, kecuali mengandung kata terlarang → `menunggu` (masuk antrean admin). Pengguna bisa melaporkan catatan publik; admin bisa menolaknya. |
| Tugas kelompok | Tugas kelompok memakai tabel `tugas` yang sama, dengan `kelompok_id` terisi. Boleh ditugaskan ke satu anggota (`ditugaskan_ke`), boleh juga kosong. |
| Notifikasi | Di dalam aplikasi saja (tanpa email). |
| Format isi catatan | Markdown (disimpan sebagai teks). |
| Login | Laravel Sanctum, **token** (dikirim di header `Authorization: Bearer <token>`). Dipilih karena frontend (Vercel) dan backend ada di domain berbeda. |
| Database online | Supabase, **hanya sebagai PostgreSQL**. Fitur Auth dan Data API Supabase tidak dipakai (matikan Data API atau aktifkan RLS di semua tabel supaya tabel tidak bisa diakses lewat API Supabase). |

## Aturan penamaan

- Nama tabel dan kolom: **bahasa Indonesia, `snake_case`** (`mata_kuliah_id`, `jam_mulai`).
- Kolom bawaan Laravel tetap bahasa Inggris: `id`, `name`, `email`, `password`, `created_at`, `updated_at`.
- Laravel menebak nama tabel dengan aturan bahasa Inggris, jadi di setiap model tulis nama tabelnya: `protected $table = 'tugas';`
- Tanggal + jam dikirim dalam format ISO: `"2026-11-02T23:59:00"`. Jam saja: `"07:30"`.
- Respons API langsung berupa objek/array, **tanpa** pembungkus `{ "data": ... }`. Kalau backend memakai API Resource, panggil `JsonResource::withoutWrapping()` di `AppServiceProvider`.
- Kalau gagal, backend mengirim format bawaan Laravel: `{ "message": "...", "errors": { "judul": ["Judul wajib diisi."] } }` dengan status 422 (validasi), 401 (belum login), 403 (tidak boleh), atau 404 (tidak ada).
- Kalau sebuah data punya relasi (misal tugas → mata kuliah), API mengirim **id-nya dan objek ringkasnya**:
  ```json
  { "mata_kuliah_id": 2, "mata_kuliah": { "id": 2, "kode": "TIR302", "nama": "Rekayasa Perangkat Lunak" } }
  ```

## Pembagian domain

| Domain | Tabel | Halaman | PIC |
| --- | --- | --- | --- |
| Admin & Sistem | `users`, `mata_kuliah`, `kata_terlarang`, `laporan`, `notifications` | Login, Daftar, Profil, Notifikasi, semua halaman admin | *(isi)* |
| Tugas | `tugas`, `kelompok`, `anggota_kelompok` | Deadline Tugas, Tugas Kelompok, Detail Kelompok | *(isi)* |
| Catatan | `catatan`, `catatan_tersimpan` | Catatan Saya, Editor, Jelajah, Detail Catatan, Tersimpan | *(isi)* |
| Waktu & Belajar | `jadwal`, `checklist`, `checklist_item` | Jadwal Mingguan, Kalender, Checklist | *(isi)* |
| Bersama | — | Beranda (dikerjakan terakhir) | *(isi)* |

---

## Admin & Sistem

### `users`

```json
{ "id": 1, "name": "Mahasiswa Contoh", "nim": "103032400001", "email": "mahasiswa@contoh.ac.id", "role": "mahasiswa", "semester": 5 }
```

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `name` | string | |
| `nim` | string, unik | `null` untuk admin |
| `email` | string, unik | |
| `password` | string (hash) | tidak pernah dikirim ke frontend |
| `role` | `mahasiswa` \| `admin` | default `mahasiswa` |
| `semester` | angka 1–14 | `null` untuk admin |

### `mata_kuliah`

```json
{ "id": 2, "kode": "TIR302", "nama": "Rekayasa Perangkat Lunak", "semester": 5 }
```

`semester` dipakai untuk filter "per tingkat" di Jelajah Catatan.

### `kata_terlarang`

```json
{ "id": 1, "kata": "contohkasar" }
```

### `laporan`

```json
{
  "id": 1,
  "catatan_id": 4,
  "catatan": { "id": 4, "judul": "..." },
  "pelapor": { "id": 3, "name": "..." },
  "alasan": "Isinya bukan catatan kuliah",
  "status": "baru",
  "created_at": "2026-10-27T10:00:00"
}
```

`status`: `baru` | `ditindaklanjuti` (catatan ditolak) | `diabaikan`.

### Notifikasi (`notifications`, tabel bawaan Laravel)

Bentuk yang dikirim ke frontend:

```json
{ "id": "uuid", "jenis": "deadline", "pesan": "Laporan RPL deadline besok", "tautan": "/tugas", "dibaca_pada": null, "created_at": "2026-10-28T08:00:00" }
```

`jenis`: `deadline` | `moderasi` | `kelompok`.

---

## Tugas

### `tugas`

```json
{
  "id": 1,
  "user_id": 1,
  "mata_kuliah_id": 2,
  "mata_kuliah": { "id": 2, "kode": "TIR302", "nama": "Rekayasa Perangkat Lunak" },
  "judul": "Laporan SRS",
  "deskripsi": "Bab 1-3",
  "deadline": "2026-11-02T23:59:00",
  "prioritas": "tinggi",
  "status": "dikerjakan",
  "kelompok_id": null,
  "ditugaskan_ke": null
}
```

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `user_id` | id | pembuat tugas |
| `mata_kuliah_id` | id, boleh kosong | |
| `deskripsi` | teks, boleh kosong | |
| `prioritas` | `rendah` \| `sedang` \| `tinggi` | |
| `status` | `belum` \| `dikerjakan` \| `selesai` | default `belum` |
| `kelompok_id` | id, boleh kosong | kosong = tugas pribadi |
| `ditugaskan_ke` | objek `{ id, name }` atau `null` | hanya untuk tugas kelompok (kolom tabelnya `ditugaskan_ke` berisi user id) |

Backend saat ini baru mengurus tugas pribadi. Kolom `kelompok_id` dan `ditugaskan_ke` ditambahkan ke tabel saat fitur Tugas Kelompok dibuat, jadi untuk sementara belum ikut dikirim.

`PUT /tugas/{id}` boleh mengirim sebagian kolom saja, misal `{ "status": "selesai" }`.

### `kelompok` dan `anggota_kelompok`

```json
{
  "id": 1,
  "nama": "Kelompok 6 RPL",
  "mata_kuliah_id": 2,
  "mata_kuliah": { "id": 2, "kode": "TIR302", "nama": "Rekayasa Perangkat Lunak" },
  "dibuat_oleh": 1,
  "anggota": [{ "id": 1, "name": "..." }, { "id": 2, "name": "..." }]
}
```

`anggota_kelompok` adalah tabel penghubung: `kelompok_id`, `user_id`.

---

## Catatan

### `catatan`

```json
{
  "id": 1,
  "user_id": 1,
  "penulis": { "id": 1, "name": "..." },
  "mata_kuliah_id": 3,
  "mata_kuliah": { "id": 3, "kode": "TIB201", "nama": "Basis Data", "semester": 3 },
  "judul": "Normalisasi 1NF-3NF",
  "isi": "## 1NF\nSetiap kolom berisi nilai tunggal...",
  "status": "publik",
  "tersimpan": false,
  "milik_saya": true,
  "created_at": "2026-10-20T14:00:00.000000Z",
  "updated_at": "2026-10-21T09:00:00.000000Z"
}
```

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `isi` | teks (Markdown) | |
| `status` | `pribadi` \| `publik` \| `menunggu` \| `ditolak` | lihat alur di bawah |
| `tersimpan` | boolean | **bukan kolom tabel**: dihitung backend, apakah pengguna yang login sudah menyimpan catatan ini |
| `milik_saya` | boolean | **bukan kolom tabel**: dihitung backend, apakah catatan ini ditulis pengguna yang login |
| `created_at`, `updated_at` | tanggal + jam UTC | waktu otomatis dari Laravel. `formatTanggal()` mengubahnya ke waktu lokal |

Alur status:

```
pribadi ──(bagikan)──> cek kata terlarang ──aman──> publik ──(admin tolak)──> ditolak
                                          └─kena──> menunggu ──(admin setujui)──> publik
                                                             └─(admin tolak)───> ditolak
```

Pengguna hanya boleh meminta status `pribadi` atau `publik`. Catatan yang sudah `menunggu` atau `ditolak` tidak bisa kembali sendiri ke `publik` atau `pribadi`: permintaan `publik` membuatnya `menunggu` keputusan admin, dan permintaan `pribadi` tidak mengubah statusnya. Kedua status itu memang hanya terlihat oleh penulisnya. Tanpa aturan ini, penolakan admin bisa dilewati dengan membagikan ulang catatan.

### `catatan_tersimpan`

Tabel penghubung: `user_id`, `catatan_id`. Tidak dikirim sebagai objek tersendiri; frontend cukup melihat kolom `tersimpan` di catatan.

---

## Waktu & Belajar

### `jadwal`

```json
{
  "id": 1,
  "mata_kuliah_id": 2,
  "mata_kuliah": { "id": 2, "kode": "TIR302", "nama": "Rekayasa Perangkat Lunak" },
  "hari": 1,
  "jam_mulai": "07:30",
  "jam_selesai": "10:30",
  "ruangan": "KU3.04.12"
}
```

`hari`: 1 = Senin ... 7 = Minggu.

### `checklist` dan `checklist_item`

```json
{
  "id": 1,
  "judul": "Persiapan UTS Basis Data",
  "mata_kuliah_id": 3,
  "items": [
    { "id": 1, "isi": "Rangkum materi ERD", "selesai": true, "urutan": 1 },
    { "id": 2, "isi": "Latihan soal normalisasi", "selesai": false, "urutan": 2 }
  ]
}
```

---

## Daftar endpoint API (rencana)

Semua alamat diawali `/api`. Kecuali `register` dan `login`, semuanya butuh token.

| Domain | Method & alamat | Fungsi di `src/api` |
| --- | --- | --- |
| Auth | `POST /register` | `daftar()` |
| | `POST /login` | `masuk()` |
| | `POST /logout` | `keluar()` |
| | `GET /user`, `PUT /user` | `ambilProfil()`, `ubahProfil()` |
| Mata kuliah | `GET /mata-kuliah` | `ambilDaftarMataKuliah()` |
| | `POST`, `PUT /{id}`, `DELETE /{id}` (admin) | `tambahMataKuliah()`, `ubahMataKuliah()`, `hapusMataKuliah()` |
| Tugas | `GET /tugas` (tugas pribadi) | `ambilDaftarTugas()` |
| | `POST /tugas`, `PUT /tugas/{id}`, `DELETE /tugas/{id}` | `tambahTugas()`, `ubahTugas()`, `hapusTugas()` |
| Kelompok | `GET /kelompok`, `GET /kelompok/{id}` | `ambilDaftarKelompok()`, `ambilKelompok()` |
| | `POST /kelompok` | `buatKelompok()` |
| | `GET /kelompok/{id}/tugas`, `POST /kelompok/{id}/tugas` | `ambilTugasKelompok()`, `tambahTugasKelompok()` |
| Catatan | `GET /catatan` (milik sendiri) | `ambilCatatanSaya()` |
| | `GET /catatan/{id}` | `ambilCatatan()` |
| | `POST /catatan`, `PUT /catatan/{id}`, `DELETE /catatan/{id}` | `tambahCatatan()`, `ubahCatatan()`, `hapusCatatan()` |
| | `GET /jelajah?mata_kuliah_id=&semester=&cari=` | `jelajahCatatan()` |
| | `GET /tersimpan` | `ambilCatatanTersimpan()` |
| | `POST /catatan/{id}/simpan`, `DELETE /catatan/{id}/simpan` | `simpanCatatan()`, `batalSimpanCatatan()` |
| | `POST /catatan/{id}/laporan` | `laporkanCatatan()` |
| Jadwal | `GET`, `POST /jadwal`, `PUT`, `DELETE /jadwal/{id}` | `ambilJadwal()`, `tambahJadwal()`, `ubahJadwal()`, `hapusJadwal()` |
| Checklist | `GET`, `POST /checklist`, `DELETE /checklist/{id}` | `ambilDaftarChecklist()`, `buatChecklist()`, `hapusChecklist()` |
| | `POST /checklist/{id}/item`, `PUT`, `DELETE /checklist-item/{id}` | `tambahItem()`, `ubahItem()`, `hapusItem()` |
| Notifikasi | `GET /notifikasi`, `POST /notifikasi/{id}/baca`, `POST /notifikasi/baca-semua` | `ambilNotifikasi()`, `tandaiDibaca()`, `tandaiSemuaDibaca()` |
| Admin | `GET /admin/ringkasan` | `ambilRingkasan()` |
| | `GET /admin/moderasi`, `POST /admin/catatan/{id}/setujui`, `POST /admin/catatan/{id}/tolak` | `ambilAntreanModerasi()`, `setujuiCatatan()`, `tolakCatatan()` |
| | `GET /admin/laporan`, `PUT /admin/laporan/{id}` | `ambilDaftarLaporan()`, `tindakLanjutiLaporan()` |
| | `GET`, `POST /admin/kata-terlarang`, `DELETE /admin/kata-terlarang/{id}` | `ambilKataTerlarang()`, `tambahKataTerlarang()`, `hapusKataTerlarang()` |

Kalender dan Beranda tidak punya endpoint sendiri: datanya diambil dari `ambilDaftarTugas()`, `ambilJadwal()`, dan seterusnya.
