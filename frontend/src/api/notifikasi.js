import { db, balas, sekarang } from './data-palsu'
import { request, pakaiBackend } from './client'

// GET /api/notifikasi
// Terbaru di atas
export function ambilNotifikasi() {
  if (pakaiBackend) return request('/notifikasi')

  const milikSaya = db.notifikasi
    .filter((n) => n.user_id === db.penggunaLogin)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
  return balas(milikSaya)
}

// POST /api/notifikasi/{id}/baca
export function tandaiDibaca(id) {
  if (pakaiBackend) return request(`/notifikasi/${id}/baca`, { method: 'POST' })

  const notif = db.notifikasi.find((n) => n.id === id)
  if (notif && !notif.dibaca_pada) notif.dibaca_pada = sekarang()
  return balas(null)
}

// POST /api/notifikasi/baca-semua
export function tandaiSemuaDibaca() {
  if (pakaiBackend) return request('/notifikasi/baca-semua', { method: 'POST' })

  for (const notif of db.notifikasi) {
    if (notif.user_id === db.penggunaLogin && !notif.dibaca_pada) notif.dibaca_pada = sekarang()
  }
  return balas(null)
}
