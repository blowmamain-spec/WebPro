import { db, balas, gagal, idBaru, cari } from './data-palsu'
import { request, pakaiBackend } from './client'

function semuaItem() {
  return db.checklist.flatMap((c) => c.items)
}

// GET /api/checklist
// Setiap checklist sudah membawa items-nya
export function ambilDaftarChecklist() {
  if (pakaiBackend) return request('/checklist')

  const milikSaya = db.checklist.filter((c) => c.user_id === db.penggunaLogin)
  return balas(milikSaya)
}

// POST /api/checklist
// data: { judul, mata_kuliah_id }
export function buatChecklist(data) {
  if (pakaiBackend) return request('/checklist', { method: 'POST', body: data })

  if (!data.judul) return gagal(422, 'Data belum lengkap', { judul: ['Judul wajib diisi.'] })
  const checklist = { id: idBaru(db.checklist), user_id: db.penggunaLogin, mata_kuliah_id: null, ...data, items: [] }
  db.checklist.push(checklist)
  return balas(checklist)
}

// DELETE /api/checklist/{id}
export function hapusChecklist(id) {
  if (pakaiBackend) return request(`/checklist/${id}`, { method: 'DELETE' })

  db.checklist = db.checklist.filter((c) => c.id !== Number(id))
  return balas(null)
}

// POST /api/checklist/{id}/item
export function tambahItem(checklistId, isi) {
  if (pakaiBackend) return request(`/checklist/${checklistId}/item`, { method: 'POST', body: { isi } })

  const checklist = cari(db.checklist, checklistId)
  if (!checklist) return gagal(404, 'Checklist tidak ditemukan')
  if (!isi) return gagal(422, 'Isi item wajib diisi')
  const item = { id: idBaru(semuaItem()), isi, selesai: false, urutan: checklist.items.length + 1 }
  checklist.items.push(item)
  return balas(item)
}

// PUT /api/checklist-item/{id}
// data: misal { selesai: true } atau { isi: '...' }
export function ubahItem(itemId, data) {
  if (pakaiBackend) return request(`/checklist-item/${itemId}`, { method: 'PUT', body: data })

  const item = cari(semuaItem(), itemId)
  if (!item) return gagal(404, 'Item tidak ditemukan')
  Object.assign(item, data)
  return balas(item)
}

// DELETE /api/checklist-item/{id}
export function hapusItem(itemId) {
  if (pakaiBackend) return request(`/checklist-item/${itemId}`, { method: 'DELETE' })

  for (const checklist of db.checklist) {
    checklist.items = checklist.items.filter((i) => i.id !== Number(itemId))
  }
  return balas(null)
}
