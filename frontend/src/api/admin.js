import { db, balas, gagal, idBaru, cari, sekarang, ringkasPengguna } from './data-palsu'
import { bentukCatatan } from './catatan'
import { request, pakaiBackend } from './client'

function kirimNotifikasi(userId, pesan, tautan) {
  db.notifikasi.push({
    id: `notif-${db.notifikasi.length + 1}`,
    user_id: userId,
    jenis: 'moderasi',
    pesan,
    tautan,
    dibaca_pada: null,
    created_at: sekarang(),
  })
}

// GET /api/admin/ringkasan
export function ambilRingkasan() {
  if (pakaiBackend) return request('/admin/ringkasan')

  return balas({
    menunggu_moderasi: db.catatan.filter((c) => c.status === 'menunggu').length,
    laporan_baru: db.laporan.filter((l) => l.status === 'baru').length,
    jumlah_pengguna: db.users.filter((u) => u.role === 'mahasiswa').length,
    catatan_publik: db.catatan.filter((c) => c.status === 'publik').length,
  })
}

// ---------- Moderasi catatan ----------

// GET /api/admin/moderasi
// Catatan yang menunggu keputusan admin
export function ambilAntreanModerasi() {
  if (pakaiBackend) return request('/admin/moderasi')

  const antrean = db.catatan.filter((c) => c.status === 'menunggu')
  return balas(antrean.map(bentukCatatan))
}

// POST /api/admin/catatan/{id}/setujui
export function setujuiCatatan(id) {
  if (pakaiBackend) return request(`/admin/catatan/${id}/setujui`, { method: 'POST' })

  const catatan = cari(db.catatan, id)
  if (!catatan) return gagal(404, 'Catatan tidak ditemukan')
  catatan.status = 'publik'
  kirimNotifikasi(catatan.user_id, `Catatan "${catatan.judul}" sudah tayang`, `/jelajah/${catatan.id}`)
  return balas(bentukCatatan(catatan))
}

// POST /api/admin/catatan/{id}/tolak
export function tolakCatatan(id) {
  if (pakaiBackend) return request(`/admin/catatan/${id}/tolak`, { method: 'POST' })

  const catatan = cari(db.catatan, id)
  if (!catatan) return gagal(404, 'Catatan tidak ditemukan')
  catatan.status = 'ditolak'
  for (const laporan of db.laporan) {
    if (laporan.catatan_id === catatan.id && laporan.status === 'baru') laporan.status = 'ditindaklanjuti'
  }
  kirimNotifikasi(catatan.user_id, `Catatan "${catatan.judul}" ditolak admin`, '/catatan')
  return balas(bentukCatatan(catatan))
}

// ---------- Laporan dari pengguna ----------

// GET /api/admin/laporan
export function ambilDaftarLaporan() {
  if (pakaiBackend) return request('/admin/laporan')

  const daftar = [...db.laporan]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map((l) => {
      const catatan = cari(db.catatan, l.catatan_id)
      return {
        id: l.id,
        catatan_id: l.catatan_id,
        catatan: catatan ? { id: catatan.id, judul: catatan.judul } : null,
        pelapor: ringkasPengguna(l.pelapor_id),
        alasan: l.alasan,
        status: l.status,
        created_at: l.created_at,
      }
    })
  return balas(daftar)
}

// PUT /api/admin/laporan/{id}
// status: 'ditindaklanjuti' (catatan ikut ditolak) atau 'diabaikan'
export function tindakLanjutiLaporan(id, status) {
  if (pakaiBackend) return request(`/admin/laporan/${id}`, { method: 'PUT', body: { status } })

  const laporan = cari(db.laporan, id)
  if (!laporan) return gagal(404, 'Laporan tidak ditemukan')
  if (status === 'ditindaklanjuti') return tolakCatatan(laporan.catatan_id)
  laporan.status = status
  return balas(null)
}

// ---------- Kata terlarang ----------

// GET /api/admin/kata-terlarang
export function ambilKataTerlarang() {
  if (pakaiBackend) return request('/admin/kata-terlarang')

  return balas(db.kataTerlarang)
}

// POST /api/admin/kata-terlarang
export function tambahKataTerlarang(kata) {
  if (pakaiBackend) return request('/admin/kata-terlarang', { method: 'POST', body: { kata } })

  const bersih = (kata ?? '').trim().toLowerCase()
  if (!bersih) return gagal(422, 'Kata wajib diisi.')
  if (db.kataTerlarang.some((k) => k.kata === bersih)) return gagal(422, 'Kata itu sudah ada.')
  const baru = { id: idBaru(db.kataTerlarang), kata: bersih }
  db.kataTerlarang.push(baru)
  return balas(baru)
}

// DELETE /api/admin/kata-terlarang/{id}
export function hapusKataTerlarang(id) {
  if (pakaiBackend) return request(`/admin/kata-terlarang/${id}`, { method: 'DELETE' })

  db.kataTerlarang = db.kataTerlarang.filter((k) => k.id !== Number(id))
  return balas(null)
}
