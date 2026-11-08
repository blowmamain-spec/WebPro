import { db, balas, gagal, idBaru, cari, ringkasMataKuliah, ringkasPengguna } from './data-palsu'
import { bentukTugas } from './tugas'
import { request, pakaiBackend } from './client'

function bentukKelompok(kelompok) {
  return {
    ...kelompok,
    mata_kuliah: ringkasMataKuliah(kelompok.mata_kuliah_id),
    anggota: kelompok.anggota.map(ringkasPengguna),
    milik_saya: kelompok.dibuat_oleh === db.penggunaLogin,
  }
}

function kelompokSaya(id) {
  const kelompok = cari(db.kelompok, id)
  return kelompok?.anggota.includes(db.penggunaLogin) ? kelompok : null
}

// GET /api/kelompok
// Kelompok yang anggotanya termasuk pengguna yang login
export function ambilDaftarKelompok() {
  if (pakaiBackend) return request('/kelompok')

  const milikSaya = db.kelompok.filter((k) => k.anggota.includes(db.penggunaLogin))
  return balas(milikSaya.map(bentukKelompok))
}

// GET /api/kelompok/{id}
export function ambilKelompok(id) {
  if (pakaiBackend) return request(`/kelompok/${id}`)

  const kelompok = kelompokSaya(id)
  if (!kelompok) return gagal(404, 'Kelompok tidak ditemukan.')
  return balas(bentukKelompok(kelompok))
}

// POST /api/kelompok
// data: { nama, mata_kuliah_id, anggota: [id user, ...] }. Pembuat otomatis jadi anggota.
export function buatKelompok(data) {
  if (pakaiBackend) return request('/kelompok', { method: 'POST', body: data })

  if (!data.nama) return gagal(422, 'Nama kelompok wajib diisi.', { nama: ['Nama kelompok wajib diisi.'] })
  const anggota = [...new Set([db.penggunaLogin, ...(data.anggota ?? [])])]
  const kelompok = { id: idBaru(db.kelompok), mata_kuliah_id: null, ...data, anggota, dibuat_oleh: db.penggunaLogin }
  db.kelompok.push(kelompok)
  return balas(bentukKelompok(kelompok))
}

// PUT /api/kelompok/{id} (hanya pembuat)
// data: { nama, mata_kuliah_id }
export function ubahKelompok(id, data) {
  if (pakaiBackend) return request(`/kelompok/${id}`, { method: 'PUT', body: data })

  const kelompok = kelompokSaya(id)
  if (!kelompok) return gagal(404, 'Kelompok tidak ditemukan.')
  if (kelompok.dibuat_oleh !== db.penggunaLogin) return gagal(403, 'Hanya pembuat kelompok yang boleh melakukan ini.')
  Object.assign(kelompok, data)
  return balas(bentukKelompok(kelompok))
}

// DELETE /api/kelompok/{id} (hanya pembuat). Tugas kelompoknya ikut terhapus.
export function hapusKelompok(id) {
  if (pakaiBackend) return request(`/kelompok/${id}`, { method: 'DELETE' })

  const kelompok = kelompokSaya(id)
  if (!kelompok) return gagal(404, 'Kelompok tidak ditemukan.')
  if (kelompok.dibuat_oleh !== db.penggunaLogin) return gagal(403, 'Hanya pembuat kelompok yang boleh melakukan ini.')
  db.kelompok = db.kelompok.filter((k) => k.id !== kelompok.id)
  db.tugas = db.tugas.filter((t) => t.kelompok_id !== kelompok.id)
  return balas(null)
}

// POST /api/kelompok/{id}/anggota (hanya pembuat)
// Mengembalikan kelompok yang sudah diperbarui
export function tambahAnggota(id, email) {
  if (pakaiBackend) return request(`/kelompok/${id}/anggota`, { method: 'POST', body: { email } })

  const kelompok = kelompokSaya(id)
  if (!kelompok) return gagal(404, 'Kelompok tidak ditemukan.')
  if (kelompok.dibuat_oleh !== db.penggunaLogin) return gagal(403, 'Hanya pembuat kelompok yang boleh melakukan ini.')
  const user = db.users.find((u) => u.email === email)
  if (!user) return gagal(422, 'Tidak ada akun dengan email itu.')
  if (kelompok.anggota.includes(user.id)) return gagal(422, 'Akun itu sudah menjadi anggota.')
  kelompok.anggota.push(user.id)
  return balas(bentukKelompok(kelompok))
}

// DELETE /api/kelompok/{id}/anggota/{userId}
// Pembuat boleh mengeluarkan anggota, anggota boleh keluar sendiri. Mengembalikan kelompok yang sudah diperbarui.
export function hapusAnggota(id, userId) {
  if (pakaiBackend) return request(`/kelompok/${id}/anggota/${userId}`, { method: 'DELETE' })

  const kelompok = kelompokSaya(id)
  if (!kelompok) return gagal(404, 'Kelompok tidak ditemukan.')
  if (kelompok.dibuat_oleh !== db.penggunaLogin && userId !== db.penggunaLogin) {
    return gagal(403, 'Hanya pembuat kelompok yang boleh mengeluarkan anggota.')
  }
  if (userId === kelompok.dibuat_oleh) {
    return gagal(422, 'Pembuat kelompok tidak bisa keluar. Hapus kelompoknya kalau sudah tidak dipakai.')
  }
  kelompok.anggota = kelompok.anggota.filter((a) => a !== userId)
  for (const tugas of db.tugas) {
    if (tugas.kelompok_id === kelompok.id && tugas.ditugaskan_ke === userId) tugas.ditugaskan_ke = null
  }
  return balas(bentukKelompok(kelompok))
}

// GET /api/kelompok/{id}/tugas
export function ambilTugasKelompok(kelompokId) {
  if (pakaiBackend) return request(`/kelompok/${kelompokId}/tugas`)

  if (!kelompokSaya(kelompokId)) return gagal(404, 'Kelompok tidak ditemukan.')
  const daftar = db.tugas.filter((t) => t.kelompok_id === Number(kelompokId))
  return balas(daftar.map(bentukTugas))
}

// POST /api/kelompok/{id}/tugas
// data: { judul, deskripsi, deadline, prioritas, ditugaskan_ke (id user atau null) }
// Untuk mengubah / menghapus tugas kelompok, pakai ubahTugas() / hapusTugas() dari tugas.js.
export function tambahTugasKelompok(kelompokId, data) {
  if (pakaiBackend) return request(`/kelompok/${kelompokId}/tugas`, { method: 'POST', body: data })

  const kelompok = kelompokSaya(kelompokId)
  if (!kelompok) return gagal(404, 'Kelompok tidak ditemukan.')
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
