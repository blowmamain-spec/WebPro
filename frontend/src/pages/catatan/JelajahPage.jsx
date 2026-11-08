import { useState } from 'react'
import { BookOpen, Search } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import KartuCatatan from '@/components/catatan/KartuCatatan'
import { useMuatData } from '@/hooks/useMuatData'
import { jelajahCatatan } from '@/api/catatan'
import { ambilDaftarMataKuliah } from '@/api/mataKuliah'

const kelasIsian =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100'

function JelajahPage() {
  // `filter` yang dikirim ke API. Kata kunci baru masuk ke sini setelah form dikirim, bukan tiap huruf diketik.
  const [filter, setFilter] = useState({ mata_kuliah_id: '', semester: '', cari: '' })
  const [kataKunci, setKataKunci] = useState('')

  const { data: daftarCatatan, memuat, error } = useMuatData(() => jelajahCatatan(filter), [filter])
  const { data: daftarMataKuliah } = useMuatData(() => ambilDaftarMataKuliah(), [])

  const daftarSemester = [...new Set((daftarMataKuliah ?? []).map((mk) => mk.semester))].sort((a, b) => a - b)

  function cari(event) {
    event.preventDefault()
    setFilter({ ...filter, cari: kataKunci.trim() })
  }

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 sm:p-6 lg:p-8">
      <PageHeader judul="Jelajah Catatan" deskripsi="Catatan yang dibagikan mahasiswa lain." />

      <form className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-[1fr_1fr_2fr]" onSubmit={cari}>
        <select
          className={kelasIsian}
          aria-label="Filter mata kuliah"
          value={filter.mata_kuliah_id}
          onChange={(event) => setFilter({ ...filter, mata_kuliah_id: event.target.value })}
        >
          <option value="">Semua mata kuliah</option>
          {(daftarMataKuliah ?? []).map((mk) => (
            <option key={mk.id} value={mk.id}>{mk.nama}</option>
          ))}
        </select>

        <select
          className={kelasIsian}
          aria-label="Filter semester"
          value={filter.semester}
          onChange={(event) => setFilter({ ...filter, semester: event.target.value })}
        >
          <option value="">Semua semester</option>
          {daftarSemester.map((semester) => (
            <option key={semester} value={semester}>Semester {semester}</option>
          ))}
        </select>

        <div className="flex gap-2">
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
