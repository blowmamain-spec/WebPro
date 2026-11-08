import { KATEGORI_MATA_KULIAH } from '@/utils/format'

// Isi <select> mata kuliah, dikelompokkan per semester lalu per kategori pilihan.
// Dipakai di dalam <select>: <OpsiMataKuliah daftar={daftarMataKuliah} />

function urutNama(a, b) {
  return a.nama.localeCompare(b.nama)
}

function OpsiMataKuliah({ daftar }) {
  const daftarWajib = daftar.filter((mk) => mk.kategori === 'wajib')
  const daftarSemester = [...new Set(daftarWajib.map((mk) => mk.semester))].sort((a, b) => a - b)

  const grup = [
    ...daftarSemester.map((semester) => ({
      label: `Semester ${semester}`,
      isi: daftarWajib.filter((mk) => mk.semester === semester),
    })),
    ...Object.entries(KATEGORI_MATA_KULIAH).map(([kategori, label]) => ({
      label,
      isi: daftar.filter((mk) => mk.kategori === kategori),
    })),
  ]

  return grup
    .filter(({ isi }) => isi.length > 0)
    .map(({ label, isi }) => (
      <optgroup key={label} label={label}>
        {[...isi].sort(urutNama).map((mk) => (
          <option key={mk.id} value={mk.id}>{mk.nama}</option>
        ))}
      </optgroup>
    ))
}

export default OpsiMataKuliah
