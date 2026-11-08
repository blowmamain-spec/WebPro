import { db, balas, gagal, idBaru, cari } from './data-palsu'
import { request, pakaiBackend } from './client'

// GET /api/mata-kuliah
export function ambilDaftarMataKuliah() {
  if (pakaiBackend) return request('/mata-kuliah')

  const urut = [...db.mataKuliah].sort((a, b) => a.semester - b.semester || a.nama.localeCompare(b.nama))
  return balas(urut)
}

// Tahap 2: POST /api/mata-kuliah (admin)
// data: { kode, nama, semester }
export function tambahMataKuliah(data) {
  if (!data.kode || !data.nama) {
    return gagal(422, 'Data belum lengkap', { kode: ['Kode wajib diisi.'], nama: ['Nama wajib diisi.'] })
  }
  const mk = { id: idBaru(db.mataKuliah), ...data }
  db.mataKuliah.push(mk)
  return balas(mk)
}

// Tahap 2: PUT /api/mata-kuliah/{id} (admin)
export function ubahMataKuliah(id, data) {
  const mk = cari(db.mataKuliah, id)
  if (!mk) return gagal(404, 'Mata kuliah tidak ditemukan')
  Object.assign(mk, data)
  return balas(mk)
}

// Tahap 2: DELETE /api/mata-kuliah/{id} (admin)
export function hapusMataKuliah(id) {
  db.mataKuliah = db.mataKuliah.filter((mk) => mk.id !== Number(id))
  return balas(null)
}
