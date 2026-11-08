import { useState } from 'react'
import { Calendar, Clock, Pencil, Trash2 } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import FormTugas from '@/components/tugas/FormTugas'
import { useMuatData } from '@/hooks/useMuatData'
import { ambilDaftarTugas, tambahTugas, ubahTugas, hapusTugas } from '@/api/tugas'
import { ambilDaftarMataKuliah } from '@/api/mataKuliah'
import { formatTanggalJam } from '@/utils/format'

function TugasPage() {
  const { data: daftarTugas, memuat, error, setData } = useMuatData(() => ambilDaftarTugas(), [])
  const { data: daftarMataKuliah } = useMuatData(() => ambilDaftarMataKuliah(), [])

  // null = form tertutup, 'baru' = form tambah, objek tugas = form ubah
  const [formTugas, setFormTugas] = useState(null)
  const [pesanError, setPesanError] = useState('')

  const tugasUrut = [...(daftarTugas ?? [])].sort((a, b) => a.deadline.localeCompare(b.deadline))

  function gantiDiDaftar(tugasBaru) {
    setData((daftar) => daftar.map((tugas) => (tugas.id === tugasBaru.id ? tugasBaru : tugas)))
  }

  async function simpan(data) {
    if (formTugas === 'baru') {
      const tugasBaru = await tambahTugas(data)
      setData((daftar) => [...daftar, tugasBaru])
    } else {
      gantiDiDaftar(await ubahTugas(formTugas.id, data))
    }
    setFormTugas(null)
  }

  async function ubahStatus(tugas, status) {
    setPesanError('')
    try {
      gantiDiDaftar(await ubahTugas(tugas.id, { status }))
    } catch (error) {
      setPesanError(error.message)
    }
  }

  async function hapus(tugas) {
    if (!window.confirm(`Hapus tugas "${tugas.judul}"?`)) return

    setPesanError('')
    try {
      await hapusTugas(tugas.id)
      setData((daftar) => daftar.filter((t) => t.id !== tugas.id))
    } catch (error) {
      setPesanError(error.message)
    }
  }

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 text-slate-800 sm:p-6 lg:p-8">
      <PageHeader judul="Deadline Tugas" deskripsi="Daftar tugas pribadi beserta prioritas dan tenggatnya.">
        <button
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          type="button"
          onClick={() => setFormTugas('baru')}
        >
          Tambah Tugas
        </button>
      </PageHeader>

      {pesanError && <p className="pesan-error">{pesanError}</p>}

      {memuat ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Memuat daftar tugas...
        </div>
      ) : error ? (
        <p className="pesan-error">{error.message}</p>
      ) : tugasUrut.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <Calendar className="mx-auto mb-3 h-6 w-6 text-slate-400" aria-hidden="true" />
          <p className="text-sm font-medium text-slate-700">Belum ada tugas</p>
          <p className="mt-1 text-sm text-slate-500">Tugas yang kamu tambahkan akan muncul di sini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {tugasUrut.map((tugas) => {
            const badgeClass =
              tugas.prioritas === 'tinggi'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : tugas.prioritas === 'sedang'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'

            return (
              <article
                key={tugas.id}
                className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-slate-300 hover:shadow-md sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                      <Calendar className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <h2 className="break-words font-semibold text-slate-900">{tugas.judul}</h2>
                      <p className="mt-1 text-sm text-slate-500">
                        {tugas.mata_kuliah?.nama ?? 'Tanpa mata kuliah'}
                      </p>
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${badgeClass}`}>
                    {tugas.prioritas}
                  </span>
                </div>

                {tugas.deskripsi && (
                  <p className="mt-3 whitespace-pre-wrap break-words text-sm text-slate-600">{tugas.deskripsi}</p>
                )}

                <span className="mt-4 inline-flex items-center gap-2 text-sm text-slate-500">
                  <Clock className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  {formatTanggalJam(tugas.deadline)}
                </span>

                <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-4 [&:not(:first-child)]:mt-4">
                  <select
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700"
                    aria-label={`Status ${tugas.judul}`}
                    value={tugas.status}
                    onChange={(event) => ubahStatus(tugas, event.target.value)}
                  >
                    <option value="belum">Belum</option>
                    <option value="dikerjakan">Dikerjakan</option>
                    <option value="selesai">Selesai</option>
                  </select>

                  <div className="flex gap-1">
                    <button
                      type="button"
                      className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                      aria-label={`Ubah ${tugas.judul}`}
                      onClick={() => setFormTugas(tugas)}
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-700"
                      aria-label={`Hapus ${tugas.judul}`}
                      onClick={() => hapus(tugas)}
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

      {formTugas && (
        <FormTugas
          key={formTugas === 'baru' ? 'baru' : formTugas.id}
          tugas={formTugas === 'baru' ? null : formTugas}
          daftarMataKuliah={daftarMataKuliah ?? []}
          onSimpan={simpan}
          onBatal={() => setFormTugas(null)}
        />
      )}
    </div>
  )
}

export default TugasPage
