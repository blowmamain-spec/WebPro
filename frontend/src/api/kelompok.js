import { db, balas, gagal, idBaru, cari, ringkasMataKuliah, ringkasPengguna } from './data-palsu'
import { bentukTugas } from './tugas'

function bentukKelompok(kelompok) {
  return {
    ...kelompok,
    mata_kuliah: ringkasMataKuliah(kelompok.mata_kuliah_id),
    anggota: kelompok.anggota.map(ringkasPengguna),
  }
}

// Tahap 2: GET /api/kelompok
// Kelompok yang anggotanya termasuk pengguna yang login
export function ambilDaftarKelompok() {
  const milikSaya = db.kelompok.filter((k) => k.anggota.includes(db.penggunaLogin))
  return balas(milikSaya.map(bentukKelompok))
}

// Tahap 2: GET /api/kelompok/{id}
export function ambilKelompok(id) {
  const kelompok = cari(db.kelompok, id)
  if (!kelompok) return gagal(404, 'Kelompok tidak ditemukan')
  return balas(bentukKelompok(kelompok))
}

// Tahap 2: POST /api/kelompok
// data: { nama, mata_kuliah_id, anggota: [id user, ...] }. Pembuat otomatis jadi anggota.
export function buatKelompok(data) {
  if (!data.nama) return gagal(422, 'Data belum lengkap', { nama: ['Nama kelompok wajib diisi.'] })
  const anggota = [...new Set([db.penggunaLogin, ...(data.anggota ?? [])])]
  const kelompok = { id: idBaru(db.kelompok), mata_kuliah_id: null, ...data, anggota, dibuat_oleh: db.penggunaLogin }
  db.kelompok.push(kelompok)
  return balas(bentukKelompok(kelompok))
}

// Tahap 2: GET /api/kelompok/{id}/tugas
export function ambilTugasKelompok(kelompokId) {
  const daftar = db.tugas.filter((t) => t.kelompok_id === Number(kelompokId))
  return balas(daftar.map(bentukTugas))
}

// Tahap 2: POST /api/kelompok/{id}/tugas
// data: { judul, deskripsi, deadline, prioritas, ditugaskan_ke (id user atau null) }
// Untuk mengubah / menghapus tugas kelompok, pakai ubahTugas() / hapusTugas() dari tugas.js.
export function tambahTugasKelompok(kelompokId, data) {
  const kelompok = cari(db.kelompok, kelompokId)
  if (!kelompok) return gagal(404, 'Kelompok tidak ditemukan')
  if (!data.judul || !data.deadline) {
    return gagal(422, 'Data belum lengkap', { judul: ['Judul wajib diisi.'], deadline: ['Deadline wajib diisi.'] })
  }
  const tugas = {
    id: idBaru(db.tugas),
    user_id: db.penggunaLogin,
    mata_kuliah_id: kelompok.mata_kuliah_id,
    deskripsi: null,
    prioritas: 'sedang',
    status: 'belum',
    ditugaskan_ke: null,
    ...data,
    kelompok_id: kelompok.id,
  }
  db.tugas.push(tugas)
  return balas(bentukTugas(tugas))
}
