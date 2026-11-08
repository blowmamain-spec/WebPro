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

  // Kurikulum reguler S1 Teknologi Informasi, sama dengan backend/database/seeders/MataKuliahSeeder.php
  mataKuliah: [
    { id: 1, kode: 'CBK3DAB3', nama: 'Pemrograman Web', semester: 5, sks: 3, kategori: 'wajib' },
    { id: 2, kode: 'CBK3FAB3', nama: 'Rekayasa Perangkat Lunak', semester: 5, sks: 3, kategori: 'wajib' },
    { id: 3, kode: 'CBK2LAB4', nama: 'Sistem Manajemen Basis Data', semester: 4, sks: 4, kategori: 'wajib' },
    { id: 4, kode: 'CBK3AAB3', nama: 'Keamanan Siber', semester: 5, sks: 3, kategori: 'wajib' },
    { id: 5, kode: 'CBK3CAB4', nama: 'Pemrograman Berorientasi Obyek', semester: 5, sks: 4, kategori: 'wajib' },
    { id: 6, kode: 'CBK4SBB3', nama: 'Jaringan Nirkabel', semester: 7, sks: 3, kategori: 'pilihan_bebas' },
    { id: 7, kode: 'CBK1HAB4', nama: 'Algoritma Pemrograman', semester: 2, sks: 4, kategori: 'wajib' },
    { id: 8, kode: 'CBK1AAB3', nama: 'Logika Matematika', semester: 1, sks: 3, kategori: 'wajib' },
    { id: 9, kode: 'CBK1BAB4', nama: 'Berpikir Komputasional & Pengenalan Pemrograman', semester: 1, sks: 4, kategori: 'wajib' },
    { id: 10, kode: 'CBK1CAB3', nama: 'Kalkulus', semester: 1, sks: 3, kategori: 'wajib' },
    { id: 11, kode: 'CBK1DAB2', nama: 'Pengantar Teknologi Informasi', semester: 1, sks: 2, kategori: 'wajib' },
    { id: 12, kode: 'UBKXBCB2', nama: 'Pancasila', semester: 1, sks: 2, kategori: 'wajib' },
    { id: 13, kode: 'UBKXCCB2', nama: 'Bahasa Indonesia', semester: 1, sks: 2, kategori: 'wajib' },
    { id: 14, kode: 'CBK1EAB3', nama: 'Pendidikan Karakter', semester: 1, sks: 3, kategori: 'wajib' },
    { id: 15, kode: 'CBK1FAB3', nama: 'Statistika dan Analitik Data', semester: 2, sks: 3, kategori: 'wajib' },
    { id: 16, kode: 'CBK1GAB3', nama: 'Aljabar Linear dan Matriks', semester: 2, sks: 3, kategori: 'wajib' },
    { id: 17, kode: 'CBK1IAB3', nama: 'Matematika Diskrit', semester: 2, sks: 3, kategori: 'wajib' },
    { id: 18, kode: 'UCKXADB2', nama: 'Bahasa Inggris', semester: 2, sks: 2, kategori: 'wajib' },
    { id: 19, kode: 'CBK1JAB2', nama: 'Pemeliharaan dan Administrasi Teknologi Informasi', semester: 2, sks: 2, kategori: 'wajib' },
    { id: 20, kode: 'CBK2AAB2', nama: 'Teori Peluang', semester: 3, sks: 2, kategori: 'wajib' },
    { id: 21, kode: 'CBK2BAB4', nama: 'Struktur Data', semester: 3, sks: 4, kategori: 'wajib' },
    { id: 22, kode: 'CBK2CAB3', nama: 'Sistem Multimedia', semester: 3, sks: 3, kategori: 'wajib' },
    { id: 23, kode: 'CBK2DAB3', nama: 'Manajemen Layanan Teknologi Informasi', semester: 3, sks: 3, kategori: 'wajib' },
    { id: 24, kode: 'CBK2EAB3', nama: 'Organisasi dan Arsitektur Komputer', semester: 3, sks: 3, kategori: 'wajib' },
    { id: 25, kode: 'CBK2FAB3', nama: 'Keterampilan dan Profesionalisme Teknologi Informasi', semester: 3, sks: 3, kategori: 'wajib' },
    { id: 26, kode: 'CBK2GAB2', nama: 'Wawasan Global TIK', semester: 3, sks: 2, kategori: 'wajib' },
    { id: 27, kode: 'CBK2HAB4', nama: 'Jaringan Komputer', semester: 4, sks: 4, kategori: 'wajib' },
    { id: 28, kode: 'CBK2IAB3', nama: 'Interaksi Manusia Komputer', semester: 4, sks: 3, kategori: 'wajib' },
    { id: 29, kode: 'UCKXBDB2', nama: 'Kewirausahaan', semester: 4, sks: 2, kategori: 'wajib' },
    { id: 30, kode: 'CBK2JAB3', nama: 'Sistem Operasi', semester: 4, sks: 3, kategori: 'wajib' },
    { id: 31, kode: 'CBK2KAB3', nama: 'Sistem Cerdas', semester: 4, sks: 3, kategori: 'wajib' },
    { id: 32, kode: 'CBK2MAB1', nama: 'Teknologi Informasi Untuk Masyarakat', semester: 4, sks: 1, kategori: 'wajib' },
    { id: 33, kode: 'CBK3BAB3', nama: 'Pengalaman Pengguna', semester: 5, sks: 3, kategori: 'wajib' },
    { id: 34, kode: 'CBK3EAB3', nama: 'Pemrograman Platform & IOT', semester: 5, sks: 3, kategori: 'wajib' },
    { id: 35, kode: 'CBK3GAB3', nama: 'Aplikasi Perangkat Bergerak', semester: 6, sks: 3, kategori: 'wajib' },
    { id: 36, kode: 'CBK3HAB3', nama: 'Komputasi Awan dan Virtualisasi', semester: 6, sks: 3, kategori: 'wajib' },
    { id: 37, kode: 'CBK3IAB3', nama: 'Arsitektur Integrasi Sistem', semester: 6, sks: 3, kategori: 'wajib' },
    { id: 38, kode: 'UBKXACB2', nama: 'Kewarganegaraan', semester: 6, sks: 2, kategori: 'wajib' },
    { id: 39, kode: 'CBK3KAB3', nama: 'Manajemen Proyek', semester: 6, sks: 3, kategori: 'wajib' },
    { id: 40, kode: 'CBK3LAB3', nama: 'Pengujian Penetrasi dan Etika Peretasan', semester: 6, sks: 3, kategori: 'wajib' },
    { id: 41, kode: 'CBK3MAB2', nama: 'Metodologi Penelitian dan Tata Tulis Ilmiah', semester: 6, sks: 2, kategori: 'wajib' },
    { id: 42, kode: 'CBK4AAA2', nama: 'Penulisan Proposal', semester: 7, sks: 2, kategori: 'wajib' },
    { id: 43, kode: 'CBK4BAB3', nama: 'Kerja Praktik', semester: 7, sks: 3, kategori: 'wajib' },
    { id: 44, kode: 'CBK4AAC3', nama: 'Proyek Teknologi Informasi', semester: 7, sks: 3, kategori: 'wajib' },
    { id: 45, kode: 'CBK4CAB2', nama: 'Bahasa Inggris II', semester: 7, sks: 2, kategori: 'wajib' },
    { id: 46, kode: 'CBK4BAA4', nama: 'Tugas Akhir', semester: 8, sks: 4, kategori: 'wajib' },
    { id: 47, kode: 'UAKXACB2', nama: 'Agama Islam', semester: 2, sks: 2, kategori: 'agama' },
    { id: 48, kode: 'UAKXBCB2', nama: 'Agama Kristen', semester: 2, sks: 2, kategori: 'agama' },
    { id: 49, kode: 'UAKXCCB2', nama: 'Agama Katolik', semester: 2, sks: 2, kategori: 'agama' },
    { id: 50, kode: 'UAKXDCB2', nama: 'Agama Hindu', semester: 2, sks: 2, kategori: 'agama' },
    { id: 51, kode: 'UAKXECB2', nama: 'Agama Budha', semester: 2, sks: 2, kategori: 'agama' },
    { id: 52, kode: 'UAKXFCB2', nama: 'Agama Kong Hu Cu', semester: 2, sks: 2, kategori: 'agama' },
    { id: 53, kode: 'UAKXGCB2', nama: 'Penghayat Kepercayaan Terhadap Tuhan YME', semester: 2, sks: 2, kategori: 'agama' },
    { id: 54, kode: 'CBK4GBB3', nama: 'Jaminan dan Keamanan Informasi', semester: 7, sks: 3, kategori: 'peminatan_cyber_security' },
    { id: 55, kode: 'CBK4HBB3', nama: 'Manajemen Risiko Teknologi Informasi', semester: 7, sks: 3, kategori: 'peminatan_cyber_security' },
    { id: 56, kode: 'CBK4IBB3', nama: 'Forensik Komputer dan Jaringan', semester: 7, sks: 3, kategori: 'peminatan_cyber_security' },
    { id: 57, kode: 'CBK4JBB3', nama: 'Keamanan Web dan Aplikasi', semester: 7, sks: 3, kategori: 'peminatan_cyber_security' },
    { id: 58, kode: 'CBK4KBB3', nama: 'Keamanan Jaringan', semester: 7, sks: 3, kategori: 'peminatan_cyber_security' },
    { id: 59, kode: 'CBK4LBB3', nama: 'Perangkat Berbahaya dan Intelijen Ancaman Siber', semester: 7, sks: 3, kategori: 'peminatan_cyber_security' },
    { id: 60, kode: 'CBK4ABB3', nama: 'Sistem Cerdas Internet of Things', semester: 7, sks: 3, kategori: 'peminatan_digital_innovation' },
    { id: 61, kode: 'CBK4BBB3', nama: 'Jaringan Sensor Nirkabel', semester: 7, sks: 3, kategori: 'peminatan_digital_innovation' },
    { id: 62, kode: 'CBK4CBB3', nama: 'Pengembangan Aplikasi Rantai Blok', semester: 7, sks: 3, kategori: 'peminatan_digital_innovation' },
    { id: 63, kode: 'CBK4DBB3', nama: 'Layanan Mikro dan Arsitektur Berorientasi Layanan', semester: 7, sks: 3, kategori: 'peminatan_digital_innovation' },
    { id: 64, kode: 'CBK4EBB3', nama: 'Pengembangan Gim dan Simulasi', semester: 7, sks: 3, kategori: 'peminatan_digital_innovation' },
    { id: 65, kode: 'CBK4FBB3', nama: 'Teknologi Realitas Maya dan Realitas Berimbuh', semester: 7, sks: 3, kategori: 'peminatan_digital_innovation' },
    { id: 66, kode: 'CBK4MBB3', nama: 'Analisis Adopsi Inovasi Teknologi', semester: 7, sks: 3, kategori: 'pilihan_bebas' },
    { id: 67, kode: 'CBK4NBB3', nama: 'Tata Kelola Teknologi Informasi', semester: 7, sks: 3, kategori: 'pilihan_bebas' },
    { id: 68, kode: 'CBK4OBB3', nama: 'Sistem Informasi', semester: 7, sks: 3, kategori: 'pilihan_bebas' },
    { id: 69, kode: 'CBK4PBB3', nama: 'Pengujian Perangkat Lunak', semester: 7, sks: 3, kategori: 'pilihan_bebas' },
    { id: 70, kode: 'CBK4QBB3', nama: 'Kualitas Informasi', semester: 7, sks: 3, kategori: 'pilihan_bebas' },
    { id: 71, kode: 'CBK4RBB3', nama: 'Kompetisi TIK', semester: 7, sks: 3, kategori: 'pilihan_bebas' },
    { id: 72, kode: 'CBK4TBB3', nama: 'Kesehatan-El Berbasis Internet of Things', semester: 7, sks: 3, kategori: 'pilihan_bebas' },
    { id: 73, kode: 'CBK4UBB3', nama: 'Teknik Antarmuka Perangkat Keras', semester: 7, sks: 3, kategori: 'pilihan_bebas' },
    { id: 74, kode: 'CBK4VBB3', nama: 'Sistem Waktu Nyata', semester: 7, sks: 3, kategori: 'pilihan_bebas' },
    { id: 75, kode: 'CBK4WBB3', nama: 'Jaringan Terdefinisi Perangkat Lunak & Virtualisasi Fungsi Jaringan', semester: 7, sks: 3, kategori: 'pilihan_bebas' },
    { id: 76, kode: 'CBK4XBB3', nama: 'Komputer Kuantum dan Internet', semester: 7, sks: 3, kategori: 'pilihan_bebas' },
    { id: 77, kode: 'CBK4YBB3', nama: 'Simulasi Jaringan', semester: 7, sks: 3, kategori: 'pilihan_bebas' },
    { id: 78, kode: 'CBK4ZBB3', nama: 'Sistem Kendali Internet of Things', semester: 7, sks: 3, kategori: 'pilihan_bebas' },
    { id: 79, kode: 'CBK41BB3', nama: 'Arsitektur Pusat Data', semester: 7, sks: 3, kategori: 'pilihan_bebas' },
    { id: 80, kode: 'CBK42BB3', nama: 'Rekayasa Instruksi', semester: 7, sks: 3, kategori: 'pilihan_bebas' },
    { id: 81, kode: 'CBK43BB3', nama: 'Komputasi Bioinformatika', semester: 7, sks: 3, kategori: 'pilihan_bebas' },
    { id: 82, kode: 'CBK44BB3', nama: 'Forensik Multimedia', semester: 7, sks: 3, kategori: 'pilihan_bebas' },
    { id: 83, kode: 'CBK45BB3', nama: 'Internet of Things untuk Edukasi', semester: 7, sks: 3, kategori: 'pilihan_bebas' },
    { id: 84, kode: 'CBK46BB3', nama: 'Pengembangan Aplikasi Cepat', semester: 7, sks: 3, kategori: 'pilihan_bebas' },
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
  jadwal: [
    { id: 1, user_id: 1, mata_kuliah_id: 2, hari: 1, jam_mulai: '07:30', jam_selesai: '10:30', ruangan: 'KU3.04.12' },
    { id: 2, user_id: 1, mata_kuliah_id: 1, hari: 2, jam_mulai: '10:30', jam_selesai: '13:30', ruangan: 'Lab Komputer 2' },
    { id: 3, user_id: 1, mata_kuliah_id: 4, hari: 3, jam_mulai: '13:30', jam_selesai: '16:30', ruangan: 'KU3.02.05' },
    { id: 4, user_id: 1, mata_kuliah_id: 5, hari: 4, jam_mulai: '07:30', jam_selesai: '10:30', ruangan: 'Lab Komputer 1' },
    { id: 5, user_id: 1, mata_kuliah_id: 6, hari: 5, jam_mulai: '09:30', jam_selesai: '12:30', ruangan: 'KU3.01.03' },
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
