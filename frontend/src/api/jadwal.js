import { db, balas, gagal, idBaru, cari, ringkasMataKuliah } from './data-palsu'

function bentukJadwal(jadwal) {
  return { ...jadwal, mata_kuliah: ringkasMataKuliah(jadwal.mata_kuliah_id) }
}

// Tahap 2: GET /api/jadwal
// Sudah urut dari Senin pagi sampai Minggu malam
export function ambilJadwal() {
  const milikSaya = db.jadwal
    .filter((j) => j.user_id === db.penggunaLogin)
    .sort((a, b) => a.hari - b.hari || a.jam_mulai.localeCompare(b.jam_mulai))
  return balas(milikSaya.map(bentukJadwal))
}

// Tahap 2: POST /api/jadwal
// data: { mata_kuliah_id, hari (1-7), jam_mulai: '07:30', jam_selesai: '10:30', ruangan }
export function tambahJadwal(data) {
  if (!data.mata_kuliah_id || !data.hari || !data.jam_mulai || !data.jam_selesai) {
    return gagal(422, 'Data belum lengkap')
  }
  const jadwal = { id: idBaru(db.jadwal), user_id: db.penggunaLogin, ruangan: null, ...data }
  db.jadwal.push(jadwal)
  return balas(bentukJadwal(jadwal))
}

// Tahap 2: PUT /api/jadwal/{id}
export function ubahJadwal(id, data) {
  const jadwal = cari(db.jadwal, id)
  if (!jadwal) return gagal(404, 'Jadwal tidak ditemukan')
  Object.assign(jadwal, data)
  return balas(bentukJadwal(jadwal))
}

// Tahap 2: DELETE /api/jadwal/{id}
export function hapusJadwal(id) {
  db.jadwal = db.jadwal.filter((j) => j.id !== Number(id))
  return balas(null)
}
