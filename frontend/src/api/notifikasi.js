import { db, balas, sekarang } from './data-palsu'

// Tahap 2: GET /api/notifikasi
// Terbaru di atas
export function ambilNotifikasi() {
  const milikSaya = db.notifikasi
    .filter((n) => n.user_id === db.penggunaLogin)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
  return balas(milikSaya)
}

// Tahap 2: POST /api/notifikasi/{id}/baca
export function tandaiDibaca(id) {
  const notif = db.notifikasi.find((n) => n.id === id)
  if (notif && !notif.dibaca_pada) notif.dibaca_pada = sekarang()
  return balas(null)
}

// Tahap 2: POST /api/notifikasi/baca-semua
export function tandaiSemuaDibaca() {
  for (const notif of db.notifikasi) {
    if (notif.user_id === db.penggunaLogin && !notif.dibaca_pada) notif.dibaca_pada = sekarang()
  }
  return balas(null)
}
