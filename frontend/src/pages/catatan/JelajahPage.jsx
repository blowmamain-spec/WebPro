import { useState } from 'react'
import { BookOpen, Search } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import KartuCatatan from '@/components/catatan/KartuCatatan'
import OpsiMataKuliah from '@/components/OpsiMataKuliah'
import { KATEGORI_MATA_KULIAH } from '@/utils/format'
import { useMuatData } from '@/hooks/useMuatData'
import { jelajahCatatan } from '@/api/catatan'
import { ambilDaftarMataKuliah } from '@/api/mataKuliah'

const kelasIsian =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100'

function JelajahPage() {
  // `filter` yang dikirim ke API. Kata kunci baru masuk ke sini setelah form dikirim, bukan tiap huruf diketik.
  const [filter, setFilter] = useState({ kategori: '', semester: '', mata_kuliah_id: '', cari: '' })
  const [kataKunci, setKataKunci] = useState('')

  const { data: daftarCatatan, memuat, error } = useMuatData(() => jelajahCatatan(filter), [filter])
  const { data: daftarMataKuliah } = useMuatData(() => ambilDaftarMataKuliah(), [])

  const daftarSemester = [...new Set((daftarMataKuliah ?? []).map((mk) => mk.semester))].sort((a, b) => a - b)

  // Pilihan mata kuliah mengikuti kategori dan semester yang sedang dipilih
  const mataKuliahSesuai = (daftarMataKuliah ?? [])
    .filter((mk) => !filter.kategori || mk.kategori === filter.kategori)
    .filter((mk) => !filter.semester || mk.semester === Number(filter.semester))

  // Kategori atau semester berubah: mata kuliah yang dipilih bisa jadi sudah tidak cocok, jadi dikosongkan
  function ubahPenyaring(kolom, nilai) {
    setFilter({ ...filter, [kolom]: nilai, mata_kuliah_id: '' })
  }

  function cari(event) {
    event.preventDefault()
    setFilter({ ...filter, cari: kataKunci.trim() })
  }

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 sm:p-6 lg:p-8">
      <PageHeader judul="Jelajah Catatan" deskripsi="Catatan yang dibagikan mahasiswa lain." />

      <form className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-3 lg:grid-cols-[1fr_1fr_1.5fr_2fr]" onSubmit={cari}>
        <select
          className={kelasIsian}
          aria-label="Filter kategori"
          value={filter.kategori}
          onChange={(event) => ubahPenyaring('kategori', event.target.value)}
        >
          <option value="">Semua kategori</option>
          <option value="wajib">Wajib</option>
          {Object.entries(KATEGORI_MATA_KULIAH).map(([kategori, label]) => (
            <option key={kategori} value={kategori}>{label}</option>
          ))}
        </select>

        <select
          className={kelasIsian}
          aria-label="Filter semester"
          value={filter.semester}
          onChange={(event) => ubahPenyaring('semester', event.target.value)}
        >
          <option value="">Semua semester</option>
          {daftarSemester.map((semester) => (
            <option key={semester} value={semester}>Semester {semester}</option>
          ))}
        </select>

        <select
          className={kelasIsian}
          aria-label="Filter mata kuliah"
          value={filter.mata_kuliah_id}
          onChange={(event) => setFilter({ ...filter, mata_kuliah_id: event.target.value })}
        >
          <option value="">Semua mata kuliah</option>
          <OpsiMataKuliah daftar={mataKuliahSesuai} />
        </select>

        <div className="flex gap-2 sm:col-span-3 lg:col-span-1">
          <input
            className={kelasIsian}
            type="search"
            placeholder="Cari judul atau isi catatan"
            aria-label="Cari catatan"
            maxLength={100}
            value={kataKunci}
            onChange={(event) => setKataKunci(event.target.value)}
          />
          <button
            type="submit"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            Cari
          </button>
        </div>
      </form>

      {memuat ? (
        <div className="flex h-40 items-center justify-center rounded-xl border border-slate-200 bg-white">
          <p className="text-sm font-medium text-slate-500">Memuat catatan...</p>
        </div>
      ) : error ? (
        <p className="pesan-error">{error.message}</p>
      ) : daftarCatatan.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-16 text-center">
          <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
            <BookOpen className="h-6 w-6" aria-hidden="true" />
          </span>
          <h2 className="text-base font-semibold text-slate-900">Catatan tidak ditemukan</h2>
          <p className="mt-1 text-sm text-slate-500">Coba ganti filter atau kata kuncinya.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {daftarCatatan.map((catatan) => (
            <KartuCatatan key={catatan.id} catatan={catatan} />
          ))}
        </div>
      )}
    </div>
  )
}

export default JelajahPage
