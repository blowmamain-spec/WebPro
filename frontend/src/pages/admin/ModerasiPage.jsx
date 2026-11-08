import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import { useMuatData } from '@/hooks/useMuatData'
import {
  ambilAntreanModerasi,
  ambilDaftarLaporan,
  setujuiCatatan,
  tindakLanjutiLaporan,
  tolakCatatan,
} from '@/api/admin'
import { formatTanggal } from '@/utils/format'

const kelasSetujui = 'rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60'
const kelasTolak = 'rounded-lg border border-rose-200 px-3 py-1.5 text-sm font-medium text-rose-700 hover:bg-rose-50 disabled:opacity-60'
const kelasAbaikan = 'rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60'

const WARNA_STATUS = {
  baru: 'bg-amber-50 text-amber-700 border-amber-200',
  ditindaklanjuti: 'bg-rose-50 text-rose-700 border-rose-200',
  diabaikan: 'bg-slate-50 text-slate-600 border-slate-200',
}

function ModerasiPage() {
  const muat = () => Promise.all([ambilAntreanModerasi(), ambilDaftarLaporan()])
  const { data, memuat, error, setData } = useMuatData(muat, [])
  const [antrean, daftarLaporan] = data ?? []

  const [pesanError, setPesanError] = useState('')
  const [mengirim, setMengirim] = useState(false)

  // Keputusan pada satu catatan bisa ikut mengubah laporan lain, jadi datanya diambil ulang
  async function jalankan(aksi) {
    setPesanError('')
    setMengirim(true)
    try {
      await aksi()
      setData(await muat())
    } catch (error) {
      setPesanError(error.message)
    }
    setMengirim(false)
  }

  function tolak(catatan) {
    if (!window.confirm(`Tolak catatan "${catatan.judul}"? Catatan ini tidak akan tampil di Jelajah.`)) return
    jalankan(() => tolakCatatan(catatan.id))
  }

  function tindakLanjuti(laporan) {
    if (!window.confirm(`Tolak catatan "${laporan.catatan?.judul}" berdasarkan laporan ini?`)) return
    jalankan(() => tindakLanjutiLaporan(laporan.id, 'ditindaklanjuti'))
  }

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 sm:p-6 lg:p-8">
      <PageHeader judul="Moderasi Catatan" deskripsi="Catatan yang ditandai otomatis atau dilaporkan pengguna." />

      {pesanError && <p className="pesan-error">{pesanError}</p>}

      {memuat ? (
        <p className="text-sm text-slate-500">Memuat...</p>
      ) : error ? (
        <p className="pesan-error">{error.message}</p>
      ) : (
        <>
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">Menunggu keputusan ({antrean.length})</h2>
            {antrean.length === 0 ? (
              <p className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">Antrean kosong.</p>
            ) : (
              antrean.map((catatan) => (
                <article key={catatan.id} className="rounded-xl border border-slate-200 bg-white p-5">
                  <h3 className="break-words font-semibold text-slate-900">{catatan.judul}</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {catatan.penulis?.name} · {catatan.mata_kuliah?.nama ?? 'Umum'} · {formatTanggal(catatan.updated_at)}
                  </p>
                  {/* Isi dari pengguna ditampilkan sebagai teks biasa */}
                  <p className="mt-3 max-h-48 overflow-y-auto whitespace-pre-wrap break-words rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                    {catatan.isi}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button type="button" className={kelasSetujui} disabled={mengirim} onClick={() => jalankan(() => setujuiCatatan(catatan.id))}>
                      Setujui
                    </button>
                    <button type="button" className={kelasTolak} disabled={mengirim} onClick={() => tolak(catatan)}>
                      Tolak
                    </button>
                  </div>
                </article>
              ))
            )}
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">Laporan pengguna</h2>
            {daftarLaporan.length === 0 ? (
              <p className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">Belum ada laporan.</p>
            ) : (
              daftarLaporan.map((laporan) => (
                <article key={laporan.id} className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="flex items-start justify-between gap-3">
                    <Link to={`/jelajah/${laporan.catatan_id}`} className="break-words font-semibold text-slate-900 hover:text-indigo-600">
                      {laporan.catatan?.judul ?? 'Catatan sudah dihapus'}
                    </Link>
                    <span className={`shrink-0 rounded-md border px-2 py-1 text-[10px] font-semibold uppercase tracking-wider ${WARNA_STATUS[laporan.status] ?? WARNA_STATUS.diabaikan}`}>
                      {laporan.status}
                    </span>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap break-words text-sm text-slate-700">{laporan.alasan}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    Dilaporkan {laporan.pelapor?.name} · {formatTanggal(laporan.created_at)}
                  </p>
                  {laporan.status === 'baru' && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button type="button" className={kelasTolak} disabled={mengirim} onClick={() => tindakLanjuti(laporan)}>
                        Tolak catatan
                      </button>
                      <button
                        type="button"
                        className={kelasAbaikan}
                        disabled={mengirim}
                        onClick={() => jalankan(() => tindakLanjutiLaporan(laporan.id, 'diabaikan'))}
                      >
                        Abaikan
                      </button>
                    </div>
                  )}
                </article>
              ))
            )}
          </section>
        </>
      )}
    </div>
  )
}

export default ModerasiPage
