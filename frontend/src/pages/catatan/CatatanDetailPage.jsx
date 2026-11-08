import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Bookmark, BookmarkCheck, Flag, Pencil } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import { useMuatData } from '@/hooks/useMuatData'
import { ambilCatatan, batalSimpanCatatan, laporkanCatatan, simpanCatatan } from '@/api/catatan'
import { formatTanggal } from '@/utils/format'

const kelasTombolGaris =
  'inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 no-underline hover:bg-slate-50'
const kelasTombolUtama =
  'inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60'

function CatatanDetailPage() {
  const { id } = useParams()
  const { data: catatan, memuat, error, setData } = useMuatData(() => ambilCatatan(id), [id])

  const [pesanError, setPesanError] = useState('')
  const [formLaporanTerbuka, setFormLaporanTerbuka] = useState(false)
  const [alasan, setAlasan] = useState('')
  const [sudahDilaporkan, setSudahDilaporkan] = useState(false)
  const [mengirim, setMengirim] = useState(false)

  async function aturSimpanan() {
    setPesanError('')
    setMengirim(true)
    try {
      if (catatan.tersimpan) {
        await batalSimpanCatatan(catatan.id)
      } else {
        await simpanCatatan(catatan.id)
      }
      setData({ ...catatan, tersimpan: !catatan.tersimpan })
    } catch (error) {
      setPesanError(error.message)
    }
    setMengirim(false)
  }

  async function kirimLaporan(event) {
    event.preventDefault()
    setPesanError('')
    setMengirim(true)
    try {
      await laporkanCatatan(catatan.id, alasan.trim())
      setSudahDilaporkan(true)
      setFormLaporanTerbuka(false)
    } catch (error) {
      setPesanError(error.message)
    }
    setMengirim(false)
  }

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 sm:p-6 lg:p-8">
      <PageHeader judul={catatan?.judul ?? 'Detail Catatan'} deskripsi={catatan?.milik_saya ? 'Catatan milikmu.' : 'Catatan yang dibagikan mahasiswa lain.'}>
        {catatan?.milik_saya && (
          <Link to={`/catatan/${catatan.id}/edit`} className={kelasTombolGaris}>
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Ubah
          </Link>
        )}
        {catatan && !catatan.milik_saya && (
          <>
            <button
              className={kelasTombolGaris}
              type="button"
              disabled={sudahDilaporkan}
              onClick={() => setFormLaporanTerbuka(!formLaporanTerbuka)}
            >
              <Flag className="h-4 w-4" aria-hidden="true" />
              {sudahDilaporkan ? 'Sudah dilaporkan' : 'Laporkan'}
            </button>
            <button className={kelasTombolUtama} type="button" disabled={mengirim} onClick={aturSimpanan}>
              {catatan.tersimpan ? (
                <BookmarkCheck className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Bookmark className="h-4 w-4" aria-hidden="true" />
              )}
              {catatan.tersimpan ? 'Tersimpan' : 'Simpan'}
            </button>
          </>
        )}
      </PageHeader>

      {pesanError && <p className="pesan-error">{pesanError}</p>}

      {formLaporanTerbuka && (
        <form className="max-w-3xl space-y-3 rounded-xl border border-slate-200 bg-white p-5" onSubmit={kirimLaporan}>
          <label className="block text-sm font-medium text-slate-700" htmlFor="alasan">Alasan melaporkan catatan ini</label>
          <textarea
            id="alasan"
            rows={3}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            maxLength={1000}
            value={alasan}
            onChange={(event) => setAlasan(event.target.value)}
            required
          />
          <div className="flex justify-end gap-3">
            <button className={kelasTombolGaris} type="button" onClick={() => setFormLaporanTerbuka(false)}>Batal</button>
            <button className={kelasTombolUtama} type="submit" disabled={mengirim}>Kirim Laporan</button>
          </div>
        </form>
      )}

      {memuat ? (
        <p className="text-sm text-slate-500">Memuat...</p>
      ) : error ? (
        <p className="pesan-error">{error.message}</p>
      ) : (
        <article className="max-w-3xl rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <p className="text-sm text-slate-500">
            {catatan.penulis?.name} · {catatan.mata_kuliah?.nama ?? 'Umum'} · {formatTanggal(catatan.created_at)}
          </p>
          {/* Isi catatan ditampilkan sebagai teks biasa, jadi aman walaupun isinya HTML/script dari pengguna lain */}
          <p className="mt-4 whitespace-pre-wrap break-words text-slate-800">{catatan.isi}</p>
        </article>
      )}
    </div>
  )
}

export default CatatanDetailPage
