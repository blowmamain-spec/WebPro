import { db, balas, gagal, idBaru, cari, sekarang, ringkasMataKuliah, ringkasPengguna } from './data-palsu'
import { request, pakaiBackend } from './client'

export function bentukCatatan(catatan) {
  return {
    ...catatan,
    penulis: ringkasPengguna(catatan.user_id),
    mata_kuliah: ringkasMataKuliah(catatan.mata_kuliah_id),
    tersimpan: db.tersimpan.some((s) => s.user_id === db.penggunaLogin && s.catatan_id === catatan.id),
    milik_saya: catatan.user_id === db.penggunaLogin,
  }
}

// Meniru moderasi otomatis di backend: catatan yang mau dibagikan dicek dulu ke daftar kata terlarang.
// Catatan yang pernah ditolak atau masih diantre harus diputuskan admin dulu.
function statusSetelahModerasi(statusLama, statusDiminta, judul, isi) {
  if (statusLama === 'menunggu' || statusLama === 'ditolak') {
    return statusDiminta === 'publik' ? 'menunggu' : statusLama
  }
  if (statusDiminta !== 'publik') return 'pribadi'
  const teks = `${judul} ${isi}`.toLowerCase()
  const kena = db.kataTerlarang.some((k) => teks.includes(k.kata.toLowerCase()))
  return kena ? 'menunggu' : 'publik'
}

// GET /api/catatan
// Semua catatan milik sendiri, apa pun statusnya
export function ambilCatatanSaya() {
  if (pakaiBackend) return request('/catatan')

  const milikSaya = db.catatan
    .filter((c) => c.user_id === db.penggunaLogin)
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
  return balas(milikSaya.map(bentukCatatan))
}

// GET /api/catatan/{id}
// Catatan orang lain hanya bisa dibuka kalau statusnya publik
export function ambilCatatan(id) {
  if (pakaiBackend) return request(`/catatan/${id}`)

  const catatan = cari(db.catatan, id)
  if (!catatan || (catatan.user_id !== db.penggunaLogin && catatan.status !== 'publik')) {
    return gagal(404, 'Catatan tidak ditemukan')
  }
  return balas(bentukCatatan(catatan))
}

// POST /api/catatan
// data: { judul, isi, mata_kuliah_id, status: 'pribadi' | 'publik' }
// Status akhirnya bisa jadi 'menunggu' kalau isinya kena kata terlarang.
export function tambahCatatan(data) {
  if (pakaiBackend) return request('/catatan', { method: 'POST', body: data })

  if (!data.judul) return gagal(422, 'Judul wajib diisi.', { judul: ['Judul wajib diisi.'] })
  const waktu = sekarang()
  const catatan = {
    id: idBaru(db.catatan),
    user_id: db.penggunaLogin,
    mata_kuliah_id: data.mata_kuliah_id ?? null,
    judul: data.judul,
    isi: data.isi ?? '',
    status: statusSetelahModerasi(null, data.status, data.judul, data.isi ?? ''),
    created_at: waktu,
    updated_at: waktu,
  }
  db.catatan.push(catatan)
  return balas(bentukCatatan(catatan))
}

// PUT /api/catatan/{id}
// data: kolom yang mau diubah, misal { judul, isi } atau { status: 'publik' } untuk membagikan
export function ubahCatatan(id, data) {
  if (pakaiBackend) return request(`/catatan/${id}`, { method: 'PUT', body: data })

  const catatan = cari(db.catatan, id)
  if (!catatan || catatan.user_id !== db.penggunaLogin) return gagal(404, 'Catatan tidak ditemukan')

  const statusLama = catatan.status
  const statusDiminta = data.status ?? (statusLama === 'pribadi' ? 'pribadi' : 'publik')
  Object.assign(catatan, data, { updated_at: sekarang() })
  catatan.status = statusSetelahModerasi(statusLama, statusDiminta, catatan.judul, catatan.isi)
  return balas(bentukCatatan(catatan))
}

// DELETE /api/catatan/{id}
export function hapusCatatan(id) {
  if (pakaiBackend) return request(`/catatan/${id}`, { method: 'DELETE' })

  db.catatan = db.catatan.filter((c) => !(c.id === Number(id) && c.user_id === db.penggunaLogin))
  db.tersimpan = db.tersimpan.filter((s) => s.catatan_id !== Number(id))
  return balas(null)
}

// GET /api/jelajah?mata_kuliah_id=&semester=&kategori=&cari=
// filter: { mata_kuliah_id, semester, kategori, cari } — semuanya boleh kosong
export function jelajahCatatan(filter = {}) {
  if (pakaiBackend) {
    const yangTerisi = Object.entries(filter).filter(([, nilai]) => nilai)
    const query = new URLSearchParams(yangTerisi).toString()
    return request(query ? `/jelajah?${query}` : '/jelajah')
  }

  const kataKunci = (filter.cari ?? '').toLowerCase()
  const hasil = db.catatan
    .filter((c) => c.status === 'publik')
    .filter((c) => !filter.mata_kuliah_id || c.mata_kuliah_id === Number(filter.mata_kuliah_id))
    .filter((c) => !filter.semester || ringkasMataKuliah(c.mata_kuliah_id)?.semester === Number(filter.semester))
    .filter((c) => !filter.kategori || cari(db.mataKuliah, c.mata_kuliah_id)?.kategori === filter.kategori)
    .filter((c) => !kataKunci || `${c.judul} ${c.isi}`.toLowerCase().includes(kataKunci))
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
  return balas(hasil.map(bentukCatatan))
}

// GET /api/tersimpan
export function ambilCatatanTersimpan() {
  if (pakaiBackend) return request('/tersimpan')

  const idTersimpan = db.tersimpan.filter((s) => s.user_id === db.penggunaLogin).map((s) => s.catatan_id)
  const hasil = db.catatan.filter((c) => idTersimpan.includes(c.id) && c.status === 'publik')
  return balas(hasil.map(bentukCatatan))
}

// POST /api/catatan/{id}/simpan
export function simpanCatatan(id) {
  if (pakaiBackend) return request(`/catatan/${id}/simpan`, { method: 'POST' })

  const sudah = db.tersimpan.some((s) => s.user_id === db.penggunaLogin && s.catatan_id === Number(id))
  if (!sudah) db.tersimpan.push({ user_id: db.penggunaLogin, catatan_id: Number(id) })
  return balas(null)
}

// DELETE /api/catatan/{id}/simpan
export function batalSimpanCatatan(id) {
  if (pakaiBackend) return request(`/catatan/${id}/simpan`, { method: 'DELETE' })

  db.tersimpan = db.tersimpan.filter((s) => !(s.user_id === db.penggunaLogin && s.catatan_id === Number(id)))
  return balas(null)
}

// POST /api/catatan/{id}/laporan
export function laporkanCatatan(id, alasan) {
  if (pakaiBackend) return request(`/catatan/${id}/laporan`, { method: 'POST', body: { alasan } })

  if (!alasan) return gagal(422, 'Alasan wajib diisi.', { alasan: ['Alasan wajib diisi.'] })
  const laporan = {
    id: idBaru(db.laporan),
    catatan_id: Number(id),
    pelapor_id: db.penggunaLogin,
    alasan,
    status: 'baru',
    created_at: sekarang(),
  }
  db.laporan.push(laporan)
  return balas(null)
}
