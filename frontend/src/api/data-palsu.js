// "Database palsu" untuk tahap 1 (frontend dulu, backend belakangan).
// Bentuk datanya mengikuti docs/kontrak-data.md.
//
// Data ini cuma hidup di memori browser: setiap halaman di-refresh, isinya kembali seperti semula.
// Di tahap 2 file ini dihapus, dan fungsi-fungsi di src/api/*.js diganti memanggil client.js.

export const db = {
  // id pengguna yang sedang login. Diubah oleh masuk() / keluar() di auth.js.
  penggunaLogin: 1,

  users: [
    { id: 1, name: 'Mahasiswa Contoh', nim: '103032400001', email: 'mahasiswa@contoh.ac.id', role: 'mahasiswa', semester: 5 },
    { id: 2, name: 'Budi Santoso', nim: '103032400002', email: 'budi@contoh.ac.id', role: 'mahasiswa', semester: 5 },
    { id: 3, name: 'Siti Aminah', nim: '103032300003', email: 'siti@contoh.ac.id', role: 'mahasiswa', semester: 7 },
    { id: 4, name: 'Admin Contoh', nim: null, email: 'admin@contoh.ac.id', role: 'admin', semester: null },
  ],

  mataKuliah: [
    { id: 1, kode: 'TIW301', nama: 'Pemrograman Web', semester: 5 },
    { id: 2, kode: 'TIR302', nama: 'Rekayasa Perangkat Lunak', semester: 5 },
    { id: 3, kode: 'TIB201', nama: 'Basis Data', semester: 3 },
    { id: 4, kode: 'TIK303', nama: 'Keamanan Siber', semester: 5 },
    { id: 5, kode: 'TIP304', nama: 'Pemrograman Berorientasi Objek', semester: 5 },
    { id: 6, kode: 'TIJ305', nama: 'Jaringan Nirkabel', semester: 5 },
    { id: 7, kode: 'TIA101', nama: 'Algoritma dan Pemrograman', semester: 1 },
  ],

  // Tugas pribadi (kelompok_id null) dan tugas kelompok (kelompok_id terisi) ada di tabel yang sama.
  // ditugaskan_ke di sini berisi id user; fungsi di tugas.js mengubahnya jadi { id, name }.
  tugas: [
    { id: 1, user_id: 1, mata_kuliah_id: 2, judul: 'Laporan SRS', deskripsi: 'Bab 1 sampai 3', deadline: '2026-11-02T23:59:00', prioritas: 'tinggi', status: 'dikerjakan', kelompok_id: null, ditugaskan_ke: null },
    { id: 2, user_id: 1, mata_kuliah_id: 6, judul: 'Kuis Jaringan Nirkabel', deskripsi: null, deadline: '2026-11-05T08:00:00', prioritas: 'sedang', status: 'belum', kelompok_id: null, ditugaskan_ke: null },
    { id: 3, user_id: 1, mata_kuliah_id: 4, judul: 'Write-up CTF minggu 8', deskripsi: 'Minimal 3 soal', deadline: '2026-11-10T23:59:00', prioritas: 'rendah', status: 'belum', kelompok_id: null, ditugaskan_ke: null },
    { id: 4, user_id: 1, mata_kuliah_id: 5, judul: 'Latihan inheritance', deskripsi: null, deadline: '2026-10-25T23:59:00', prioritas: 'sedang', status: 'selesai', kelompok_id: null, ditugaskan_ke: null },
    { id: 5, user_id: 1, mata_kuliah_id: 2, judul: 'Use case diagram', deskripsi: 'Pakai draw.io', deadline: '2026-11-04T23:59:00', prioritas: 'tinggi', status: 'dikerjakan', kelompok_id: 1, ditugaskan_ke: 2 },
    { id: 6, user_id: 1, mata_kuliah_id: 2, judul: 'Slide presentasi', deskripsi: null, deadline: '2026-11-08T23:59:00', prioritas: 'sedang', status: 'belum', kelompok_id: 1, ditugaskan_ke: null },
  ],

  // Di database asli, anggota disimpan di tabel anggota_kelompok. Di sini cukup array id user.
  kelompok: [
    { id: 1, nama: 'Kelompok 6 RPL', mata_kuliah_id: 2, dibuat_oleh: 1, anggota: [1, 2, 3] },
    { id: 2, nama: 'Tim Proyek Web', mata_kuliah_id: 1, dibuat_oleh: 2, anggota: [1, 2] },
  ],

  catatan: [
    { id: 1, user_id: 1, mata_kuliah_id: 3, judul: 'Normalisasi 1NF sampai 3NF', isi: '## 1NF\nSetiap kolom berisi nilai tunggal.\n\n## 2NF\nTidak ada ketergantungan parsial.', status: 'publik', created_at: '2026-10-20T14:00:00', updated_at: '2026-10-21T09:00:00' },
    { id: 2, user_id: 1, mata_kuliah_id: 1, judul: 'Catatan pribadi: setup Laravel', isi: 'composer create-project laravel/laravel backend', status: 'pribadi', created_at: '2026-10-13T20:00:00', updated_at: '2026-10-13T20:00:00' },
    { id: 3, user_id: 2, mata_kuliah_id: 4, judul: 'Ringkasan OWASP Top 10', isi: '1. Broken Access Control\n2. Cryptographic Failures\n3. Injection', status: 'publik', created_at: '2026-10-22T10:00:00', updated_at: '2026-10-22T10:00:00' },
    { id: 4, user_id: 3, mata_kuliah_id: 7, judul: 'Pola perulangan di Python', isi: 'for, while, dan list comprehension.', status: 'publik', created_at: '2026-10-18T16:00:00', updated_at: '2026-10-18T16:00:00' },
    { id: 5, user_id: 2, mata_kuliah_id: 2, judul: 'Rangkuman Scrum', isi: 'Isi catatan ini mengandung contohkasar.', status: 'menunggu', created_at: '2026-10-27T19:00:00', updated_at: '2026-10-27T19:00:00' },
  ],

  // Tabel penghubung catatan_tersimpan
  tersimpan: [
    { user_id: 1, catatan_id: 3 },
  ],

  laporan: [
    { id: 1, catatan_id: 4, pelapor_id: 2, alasan: 'Isinya terlalu singkat, bukan catatan kuliah', status: 'baru', created_at: '2026-10-27T11:00:00' },
  ],

  kataTerlarang: [
    { id: 1, kata: 'contohkasar' },
    { id: 2, kata: 'jualjoki' },
  ],

  // hari: 1 = Senin ... 7 = Minggu
  // hari: 1 = Senin ... 7 = Minggu
jadwal: [
  {
    id: 1,
    user_id: 1,
    mata_kuliah: 'Rekayasa Perangkat Lunak',
    hari: 1,
    jam_mulai: '07:30',
    jam_selesai: '10:30',
    ruangan: 'KU3.04.12',
  },
  {
    id: 2,
    user_id: 1,
    mata_kuliah: 'Pemrograman Web',
    hari: 2,
    jam_mulai: '10:30',
    jam_selesai: '13:30',
    ruangan: 'Lab Komputer 2',
  },
  {
    id: 3,
    user_id: 1,
    mata_kuliah: 'Keamanan Siber',
    hari: 3,
    jam_mulai: '13:30',
    jam_selesai: '16:30',
    ruangan: 'KU3.02.05',
  },
  {
    id: 4,
    user_id: 1,
    mata_kuliah: 'Pemrograman Berorientasi Objek',
    hari: 4,
    jam_mulai: '07:30',
    jam_selesai: '10:30',
    ruangan: 'Lab Komputer 1',
  },
  {
    id: 5,
    user_id: 1,
    mata_kuliah: 'Jaringan Nirkabel',
    hari: 5,
    jam_mulai: '09:30',
    jam_selesai: '12:30',
    ruangan: 'KU3.01.03',
  },
],

  checklist: [
    {
      id: 1, user_id: 1, judul: 'Persiapan UTS Basis Data', mata_kuliah_id: 3,
      items: [
        { id: 1, isi: 'Rangkum materi ERD', selesai: true, urutan: 1 },
        { id: 2, isi: 'Latihan soal normalisasi', selesai: false, urutan: 2 },
        { id: 3, isi: 'Coba query JOIN', selesai: false, urutan: 3 },
      ],
    },
    {
      id: 2, user_id: 1, judul: 'Belajar React', mata_kuliah_id: 1,
      items: [
        { id: 4, isi: 'Pahami useState dan props', selesai: true, urutan: 1 },
        { id: 5, isi: 'Coba React Router', selesai: false, urutan: 2 },
      ],
    },
  ],

  notifikasi: [
    { id: 'notif-1', user_id: 1, jenis: 'deadline', pesan: 'Laporan SRS deadline 2 November', tautan: '/tugas', dibaca_pada: null, created_at: '2026-10-28T08:00:00' },
    { id: 'notif-2', user_id: 1, jenis: 'kelompok', pesan: 'Budi Santoso menambahkanmu ke Tim Proyek Web', tautan: '/kelompok/2', dibaca_pada: null, created_at: '2026-10-26T15:00:00' },
    { id: 'notif-3', user_id: 1, jenis: 'moderasi', pesan: 'Catatan "Normalisasi 1NF sampai 3NF" sudah tayang', tautan: '/jelajah/1', dibaca_pada: '2026-10-20T15:00:00', created_at: '2026-10-20T14:00:00' },
  ],
}

// ---------- Alat bantu untuk file-file di src/api ----------

// Meniru jawaban server yang berhasil, termasuk jeda jaringan,
// supaya tampilan "Memuat..." di halaman bisa ikut dicoba.
// structuredClone membuat salinan, jadi halaman tidak bisa mengubah db secara tidak sengaja.
export function balas(data) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(structuredClone(data)), 300)
  })
}

// Meniru jawaban server yang gagal, bentuknya sama seperti error Laravel.
// Contoh: gagal(422, 'Data belum lengkap', { judul: ['Judul wajib diisi.'] })
export function gagal(status, message, errors = undefined) {
  return new Promise((_, reject) => {
    setTimeout(() => reject({ status, message, errors }), 300)
  })
}

export function idBaru(daftar) {
  return Math.max(0, ...daftar.map((x) => x.id)) + 1
}

export function cari(daftar, id) {
  return daftar.find((x) => x.id === Number(id))
}

export function sekarang() {
  return new Date().toISOString().slice(0, 19)
}

// Versi ringkas sebuah relasi, seperti yang nanti dikirim backend
export function ringkasMataKuliah(id) {
  const mk = cari(db.mataKuliah, id)
  return mk ? { id: mk.id, kode: mk.kode, nama: mk.nama, semester: mk.semester } : null
}

export function ringkasPengguna(id) {
  const user = cari(db.users, id)
  return user ? { id: user.id, name: user.name } : null
}
