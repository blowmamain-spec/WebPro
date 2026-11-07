import { db, balas, gagal, idBaru, cari } from './data-palsu'

function semuaItem() {
  return db.checklist.flatMap((c) => c.items)
}

// Tahap 2: GET /api/checklist
// Setiap checklist sudah membawa items-nya
export function ambilDaftarChecklist() {
  const milikSaya = db.checklist.filter((c) => c.user_id === db.penggunaLogin)
  return balas(milikSaya)
}

// Tahap 2: POST /api/checklist
// data: { judul, mata_kuliah_id }
export function buatChecklist(data) {
  if (!data.judul) return gagal(422, 'Data belum lengkap', { judul: ['Judul wajib diisi.'] })
  const checklist = { id: idBaru(db.checklist), user_id: db.penggunaLogin, mata_kuliah_id: null, ...data, items: [] }
  db.checklist.push(checklist)
  return balas(checklist)
}

// Tahap 2: DELETE /api/checklist/{id}
export function hapusChecklist(id) {
  db.checklist = db.checklist.filter((c) => c.id !== Number(id))
  return balas(null)
}

// Tahap 2: POST /api/checklist/{id}/item
export function tambahItem(checklistId, isi) {
  const checklist = cari(db.checklist, checklistId)
  if (!checklist) return gagal(404, 'Checklist tidak ditemukan')
  if (!isi) return gagal(422, 'Isi item wajib diisi')
  const item = { id: idBaru(semuaItem()), isi, selesai: false, urutan: checklist.items.length + 1 }
  checklist.items.push(item)
  return balas(item)
}

// Tahap 2: PUT /api/checklist-item/{id}
// data: misal { selesai: true } atau { isi: '...' }
export function ubahItem(itemId, data) {
  const item = cari(semuaItem(), itemId)
  if (!item) return gagal(404, 'Item tidak ditemukan')
  Object.assign(item, data)
  return balas(item)
}

// Tahap 2: DELETE /api/checklist-item/{id}
export function hapusItem(itemId) {
  for (const checklist of db.checklist) {
    checklist.items = checklist.items.filter((i) => i.id !== Number(itemId))
  }
  return balas(null)
}
