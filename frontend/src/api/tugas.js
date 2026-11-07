import { db, balas, gagal, idBaru, cari, ringkasMataKuliah, ringkasPengguna } from './data-palsu'

// Mengubah baris tabel jadi bentuk yang dikirim API (relasi ikut disertakan)
export function bentukTugas(tugas) {
  return {
    ...tugas,
    mata_kuliah: ringkasMataKuliah(tugas.mata_kuliah_id),
    ditugaskan_ke: tugas.ditugaskan_ke ? ringkasPengguna(tugas.ditugaskan_ke) : null,
  }
}

// Tahap 2: GET /api/tugas
// Hanya tugas pribadi. Tugas kelompok diambil lewat kelompok.js.
export function ambilDaftarTugas() {
  const milikSaya = db.tugas.filter((t) => t.user_id === db.penggunaLogin && t.kelompok_id === null)
  return balas(milikSaya.map(bentukTugas))
}

// Tahap 2: POST /api/tugas
// data: { judul, deskripsi, mata_kuliah_id, deadline, prioritas }
export function tambahTugas(data) {
  if (!data.judul || !data.deadline) {
    return gagal(422, 'Data belum lengkap', { judul: ['Judul wajib diisi.'], deadline: ['Deadline wajib diisi.'] })
  }
  const tugas = {
    id: idBaru(db.tugas),
    user_id: db.penggunaLogin,
    mata_kuliah_id: null,
    deskripsi: null,
    prioritas: 'sedang',
    status: 'belum',
    kelompok_id: null,
    ditugaskan_ke: null,
    ...data,
  }
  db.tugas.push(tugas)
  return balas(bentukTugas(tugas))
}

// Tahap 2: PUT /api/tugas/{id}
// data: kolom yang mau diubah saja, misal { status: 'selesai' }. Berlaku juga untuk tugas kelompok.
export function ubahTugas(id, data) {
  const tugas = cari(db.tugas, id)
  if (!tugas) return gagal(404, 'Tugas tidak ditemukan')
  Object.assign(tugas, data)
  return balas(bentukTugas(tugas))
}

// Tahap 2: DELETE /api/tugas/{id}
export function hapusTugas(id) {
  db.tugas = db.tugas.filter((t) => t.id !== Number(id))
  return balas(null)
}
