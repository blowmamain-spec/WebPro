import { db, balas, gagal, idBaru, cari } from './data-palsu'
import { request, pakaiBackend } from './client'

// GET /api/mata-kuliah
export function ambilDaftarMataKuliah() {
  if (pakaiBackend) return request('/mata-kuliah')

  const urut = [...db.mataKuliah].sort((a, b) => a.semester - b.semester || a.nama.localeCompare(b.nama))
  return balas(urut)
}

// POST /api/mata-kuliah (admin)
// data: { kode, nama, semester, sks, kategori }
export function tambahMataKuliah(data) {
  if (pakaiBackend) return request('/mata-kuliah', { method: 'POST', body: data })

  if (!data.kode || !data.nama) {
    return gagal(422, 'Kode dan nama wajib diisi.', { kode: ['Kode wajib diisi.'], nama: ['Nama wajib diisi.'] })
  }
  if (db.mataKuliah.some((mk) => mk.kode === data.kode)) return gagal(422, 'Kode itu sudah dipakai.')
  const mk = { id: idBaru(db.mataKuliah), ...data }
  db.mataKuliah.push(mk)
  return balas(mk)
}

// PUT /api/mata-kuliah/{id} (admin)
export function ubahMataKuliah(id, data) {
  if (pakaiBackend) return request(`/mata-kuliah/${id}`, { method: 'PUT', body: data })

  const mk = cari(db.mataKuliah, id)
  if (!mk) return gagal(404, 'Mata kuliah tidak ditemukan')
  if (db.mataKuliah.some((lain) => lain.kode === data.kode && lain.id !== mk.id)) {
    return gagal(422, 'Kode itu sudah dipakai.')
  }
  Object.assign(mk, data)
  return balas(mk)
}

// DELETE /api/mata-kuliah/{id} (admin)
// Ditolak kalau masih dipakai di jadwal
export function hapusMataKuliah(id) {
  if (pakaiBackend) return request(`/mata-kuliah/${id}`, { method: 'DELETE' })

  if (db.jadwal.some((j) => j.mata_kuliah_id === Number(id))) {
    return gagal(422, 'Mata kuliah ini masih dipakai di jadwal mahasiswa.')
  }
  db.mataKuliah = db.mataKuliah.filter((mk) => mk.id !== Number(id))
  return balas(null)
}
