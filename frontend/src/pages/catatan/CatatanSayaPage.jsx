import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookText, Pencil, Plus, Trash2 } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import { useMuatData } from '@/hooks/useMuatData'
import { ambilCatatanSaya, hapusCatatan } from '@/api/catatan'
import { formatTanggal } from '@/utils/format'

const TAMPILAN_STATUS = {
  pribadi: { teks: 'Pribadi', warna: 'bg-slate-50 text-slate-600 border-slate-200' },
  publik: { teks: 'Publik', warna: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  menunggu: { teks: 'Menunggu moderasi', warna: 'bg-amber-50 text-amber-700 border-amber-200' },
  ditolak: { teks: 'Ditolak', warna: 'bg-rose-50 text-rose-700 border-rose-200' },
}

function CatatanSayaPage() {
  const { data: daftarCatatan, memuat, error, setData } = useMuatData(() => ambilCatatanSaya(), [])
  const [pesanError, setPesanError] = useState('')

  async function hapus(catatan) {
    if (!window.confirm(`Hapus catatan "${catatan.judul}"?`)) return

    setPesanError('')
    try {
      await hapusCatatan(catatan.id)
      setData((daftar) => daftar.filter((c) => c.id !== catatan.id))
    } catch (error) {
      setPesanError(error.message)
    }
  }

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 sm:p-6 lg:p-8">
      <PageHeader judul="Catatan Saya" deskripsi="Semua catatan pribadi dan catatan yang kamu bagikan.">
        <Link
          to="/catatan/baru"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Tulis Catatan
        </Link>
      </PageHeader>

      {pesanError && <p className="pesan-error">{pesanError}</p>}

      {memuat ? (
        <div className="flex h-40 items-center justify-center rounded-xl border border-slate-200 bg-white">
          <p className="text-sm font-medium text-slate-500">Memuat catatan...</p>
        </div>
      ) : error ? (
        <p className="pesan-error">{error.message}</p>
      ) : daftarCatatan.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-16 text-center">
          <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
            <BookText className="h-6 w-6" aria-hidden="true" />
          </span>
          <h2 className="text-base font-semibold text-slate-900">Belum ada catatan</h2>
          <p className="mt-1 text-sm text-slate-500">Mulai tulis ringkasan atau materi kuliah pertamamu.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {daftarCatatan.map((catatan) => {
            const status = TAMPILAN_STATUS[catatan.status] ?? TAMPILAN_STATUS.pribadi

            return (
              <article
                key={catatan.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-slate-300 hover:shadow-md"
              >
                <div>
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600">
                      {catatan.mata_kuliah?.nama ?? 'Umum'}
                    </span>
                    <span className={`shrink-0 rounded-md border px-2 py-1 text-[10px] font-semibold uppercase tracking-wider ${status.warna}`}>
                      {status.teks}
                    </span>
                  </div>

                  <Link to={`/jelajah/${catatan.id}`} className="group block">
                    <h2 className="line-clamp-2 break-words text-lg font-semibold text-slate-900 transition-colors group-hover:text-indigo-600">
                      {catatan.judul}
                    </h2>
                  </Link>
                  <p className="mt-2 line-clamp-2 whitespace-pre-line break-words text-sm text-slate-600">{catatan.isi}</p>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500">
                  <span>Terakhir diubah: {formatTanggal(catatan.updated_at)}</span>
                  <div className="flex gap-1">
                    <Link
                      to={`/catatan/${catatan.id}/edit`}
                      className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                      aria-label={`Ubah ${catatan.judul}`}
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    <button
                      type="button"
                      className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-700"
                      aria-label={`Hapus ${catatan.judul}`}
                      onClick={() => hapus(catatan)}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default CatatanSayaPage
