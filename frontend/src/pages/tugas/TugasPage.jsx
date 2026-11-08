import PageHeader from '@/components/PageHeader'
import { useMuatData } from '@/hooks/useMuatData'
import { ambilDaftarTugas } from '@/api/tugas'
import { formatTanggalJam } from '@/utils/format'
import { Calendar, Clock } from 'lucide-react'
// Fungsi lain yang tersedia di @/api/tugas: tambahTugas(), ubahTugas(), hapusTugas()
// Daftar mata kuliah untuk pilihan di form: ambilDaftarMataKuliah() dari @/api/mataKuliah

function TugasPage() {
  const { data: daftarTugas, memuat } = useMuatData(() => ambilDaftarTugas(), [])

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 text-slate-800 sm:p-6 lg:p-8">
      <PageHeader judul="Deadline Tugas" deskripsi="Daftar tugas pribadi beserta prioritas dan tenggatnya.">
        <button
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          type="button"
        >
          Tambah Tugas
        </button>
      </PageHeader>

      {memuat ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Memuat daftar tugas...
        </div>
      ) : (daftarTugas ?? []).length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <Calendar className="mx-auto mb-3 h-6 w-6 text-slate-400" aria-hidden="true" />
          <p className="text-sm font-medium text-slate-700">Belum ada tugas</p>
          <p className="mt-1 text-sm text-slate-500">Tugas yang kamu tambahkan akan muncul di sini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {daftarTugas.map((tugas) => {
            const prioritas = (tugas.prioritas ?? '').toLowerCase()
            const badgeClass =
              prioritas.includes('tinggi') || prioritas.includes('high') || prioritas.includes('urgent')
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : prioritas.includes('sedang') || prioritas.includes('medium')
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'

            return (
              <article
                key={tugas.id}
                className="rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-slate-300 hover:shadow-md sm:p-6"
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
                    {tugas.prioritas ?? 'Rendah'}
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <span className="inline-flex items-center gap-2 text-sm text-slate-500">
                    <Clock className="h-4 w-4 text-slate-400" aria-hidden="true" />
                    {formatTanggalJam(tugas.deadline)}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-600">
                    {tugas.status}
                  </span>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default TugasPage
