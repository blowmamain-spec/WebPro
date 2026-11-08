import { db, balas, gagal, idBaru, cari } from './data-palsu'

function bentukJadwal(jadwal) {
  return { ...jadwal }
}

// GET /api/jadwal
export function ambilJadwal() {
  const milikSaya = db.jadwal
    .filter((j) => j.user_id === db.penggunaLogin)
    .sort((a, b) => a.hari - b.hari || a.jam_mulai.localeCompare(b.jam_mulai))

  return balas(milikSaya.map(bentukJadwal))
}

// POST /api/jadwal
// data: { mata_kuliah, hari, jam_mulai, jam_selesai, ruangan }
export function tambahJadwal(data) {
  if (!data.mata_kuliah || !data.hari || !data.jam_mulai || !data.jam_selesai) {
    return gagal(422, 'Data belum lengkap')
  }

  const jadwal = {
    id: idBaru(db.jadwal),
    user_id: db.penggunaLogin,
    ...data,
  }

  db.jadwal.push(jadwal)
  return balas(bentukJadwal(jadwal))
}

// PUT /api/jadwal/{id}
export function ubahJadwal(id, data) {
  const jadwal = cari(db.jadwal, id)

  if (!jadwal) {
    return gagal(404, 'Jadwal tidak ditemukan')
  }

  Object.assign(jadwal, data)
  return balas(bentukJadwal(jadwal))
}

// DELETE /api/jadwal/{id}
export function hapusJadwal(id) {
  db.jadwal = db.jadwal.filter((j) => j.id !== Number(id))
  return balas(null)
}