import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, BookmarkX } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import KartuCatatan from '@/components/catatan/KartuCatatan'
import { useMuatData } from '@/hooks/useMuatData'
import { ambilCatatanTersimpan, batalSimpanCatatan } from '@/api/catatan'

function TersimpanPage() {
  const { data: daftarCatatan, memuat, error, setData } = useMuatData(() => ambilCatatanTersimpan(), [])
  const [pesanError, setPesanError] = useState('')

  async function hapusDariSimpanan(catatan) {
    setPesanError('')
    try {
      await batalSimpanCatatan(catatan.id)
      setData((daftar) => daftar.filter((c) => c.id !== catatan.id))
    } catch (error) {
      setPesanError(error.message)
    }
  }

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 sm:p-6 lg:p-8">
      <PageHeader judul="Tersimpan" deskripsi="Catatan orang lain yang kamu simpan." />

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
            <Bookmark className="h-6 w-6" aria-hidden="true" />
          </span>
          <h2 className="text-base font-semibold text-slate-900">Belum ada catatan tersimpan</h2>
          <p className="mt-1 text-sm text-slate-500">
            Simpan catatan yang berguna dari <Link to="/jelajah">Jelajah Catatan</Link>.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {daftarCatatan.map((catatan) => (
            <KartuCatatan key={catatan.id} catatan={catatan}>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-700"
                onClick={() => hapusDariSimpanan(catatan)}
              >
                <BookmarkX className="h-4 w-4" aria-hidden="true" />
                Hapus dari simpanan
              </button>
            </KartuCatatan>
          ))}
        </div>
      )}
    </div>
  )
}

export default TersimpanPage
