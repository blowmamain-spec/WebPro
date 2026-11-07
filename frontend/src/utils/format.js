// Fungsi bantu tampilan yang dipakai banyak halaman

const HARI = ['', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

// 1 -> "Senin"
export function namaHari(nomor) {
  return HARI[nomor] ?? ''
}

// "2026-11-02T23:59:00" -> "2 Nov 2026"
export function formatTanggal(iso) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

// "2026-11-02T23:59:00" -> "2 Nov 2026, 23.59"
export function formatTanggalJam(iso) {
  return new Date(iso).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
