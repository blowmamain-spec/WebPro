import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import { useMuatData } from '@/hooks/useMuatData'
import { ambilKelompok, ambilTugasKelompok, tambahTugasKelompok } from '@/api/kelompok'
import { formatTanggalJam } from '@/utils/format'
// Fungsi lain: ubahTugas() / hapusTugas() dari @/api/tugas untuk mengubah tugas kelompok

const gayaInput =
  'w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-900'

const TITIK_STATUS = {
  belum: 'bg-zinc-300',
  dikerjakan: 'bg-amber-400',
  selesai: 'bg-zinc-900',
}

function KelompokDetailPage() {
  // :id di alamat /kelompok/:id dibaca lewat useParams()
  const { id } = useParams()

  // Dua permintaan sekaligus. [id] artinya muat ulang kalau id di alamat berubah.
  const { data, memuat, error, setData } = useMuatData(
    () => Promise.all([ambilKelompok(id), ambilTugasKelompok(id)]),
    [id],
  )
  const [kelompok, daftarTugas] = data ?? []

  const [formTerbuka, setFormTerbuka] = useState(false)
  const [judul, setJudul] = useState('')
  const [deskripsi, setDeskripsi] = useState('')
  const [deadline, setDeadline] = useState('')
  const [prioritas, setPrioritas] = useState('sedang')
  const [ditugaskanKe, setDitugaskanKe] = useState('')
  const [menyimpan, setMenyimpan] = useState(false)
  const [pesanError, setPesanError] = useState('')

  async function simpan(e) {
    e.preventDefault()
    setPesanError('')
    if (!judul.trim()) {
      setPesanError('Judul tugas belum diisi.')
      return
    }
    if (!deadline) {
      setPesanError('Deadline belum diisi.')
      return
    }

    setMenyimpan(true)
    try {
      const baru = await tambahTugasKelompok(id, {
        judul: judul.trim(),
        deskripsi: deskripsi.trim() || null,
        deadline: deadline.length === 16 ? `${deadline}:00` : deadline,
        prioritas,
        ditugaskan_ke: ditugaskanKe ? Number(ditugaskanKe) : null,
      })
      // data berbentuk [kelompok, daftarTugas], jadi yang ditambah hanya elemen kedua
      setData(([k, daftar]) => [k, [...daftar, baru]])
      setJudul('')
      setDeskripsi('')
      setDeadline('')
      setPrioritas('sedang')
      setDitugaskanKe('')
      setFormTerbuka(false)
    } catch (error) {
      setPesanError(error.message ?? 'Tugas belum bisa disimpan.')
    }
    setMenyimpan(false)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/kelompok" className="mb-4 inline-block text-sm text-zinc-500 hover:text-zinc-900">
        ← Semua kelompok
      </Link>

      <PageHeader judul={kelompok?.nama ?? 'Detail Kelompok'} deskripsi={kelompok?.mata_kuliah?.nama}>
        {!formTerbuka && !memuat && !error && (
          <button
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white transition-colors hover:bg-zinc-700"
            type="button"
            onClick={() => setFormTerbuka(true)}
          >
            Tambah tugas
          </button>
        )}
      </PageHeader>

      {memuat ? (
        <p className="py-10 text-sm text-zinc-400">Memuat...</p>
      ) : error ? (
        <p className="py-10 text-sm text-red-700">{error.message}</p>
      ) : (
        <>
          <p className="mb-8 text-sm text-zinc-500">
            <span className="text-zinc-400">Anggota</span> &nbsp;{kelompok.anggota.map((a) => a.name).join(', ')}
          </p>

          {formTerbuka && (
            <form onSubmit={simpan} className="mb-8 rounded-lg border border-zinc-200 p-5">
              <label htmlFor="tugas-judul" className="sr-only">
                Judul tugas
              </label>
              <input
                id="tugas-judul"
                autoFocus
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder="Apa yang harus dikerjakan?"
                className="w-full border-0 border-b border-zinc-200 bg-transparent pb-2 text-lg text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-900"
              />
              <label htmlFor="tugas-deskripsi" className="sr-only">
                Catatan
              </label>
              <textarea
                id="tugas-deskripsi"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Catatan singkat (boleh kosong)"
                rows={2}
                className="mt-3 w-full resize-none border-0 bg-transparent text-sm text-zinc-700 outline-none placeholder:text-zinc-400"
              />

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="tugas-deadline" className="mb-1 block text-sm text-zinc-600">
                    Deadline
                  </label>
                  <input
                    id="tugas-deadline"
                    type="datetime-local"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className={gayaInput}
                  />
                </div>
                <div>
                  <label htmlFor="tugas-prioritas" className="mb-1 block text-sm text-zinc-600">
                    Prioritas
                  </label>
                  <select
                    id="tugas-prioritas"
                    value={prioritas}
                    onChange={(e) => setPrioritas(e.target.value)}
                    className={gayaInput}
                  >
                    <option value="rendah">Rendah</option>
                    <option value="sedang">Sedang</option>
                    <option value="tinggi">Tinggi</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="tugas-penanggung-jawab" className="mb-1 block text-sm text-zinc-600">
                    Dikerjakan oleh
                  </label>
                  <select
                    id="tugas-penanggung-jawab"
                    value={ditugaskanKe}
                    onChange={(e) => setDitugaskanKe(e.target.value)}
                    className={gayaInput}
                  >
                    <option value="">Belum dibagi</option>
                    {kelompok.anggota.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {pesanError && <p className="mt-4 text-sm text-red-700">{pesanError}</p>}

              <div className="mt-5 flex items-center gap-4">
                <button
                  type="submit"
                  disabled={menyimpan}
                  className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
                >
                  {menyimpan ? 'Menyimpan...' : 'Simpan'}
                </button>
                <button
                  type="button"
                  onClick={() => setFormTerbuka(false)}
                  className="text-sm text-zinc-500 hover:text-zinc-900"
                >
                  Batal
                </button>
              </div>
            </form>
          )}

          {daftarTugas.length === 0 ? (
            <p className="border-t border-zinc-200 py-12 text-sm text-zinc-500">Belum ada tugas di kelompok ini.</p>
          ) : (
            <ul className="divide-y divide-zinc-100 border-t border-zinc-200">
              {daftarTugas.map((tugas) => (
                <li key={tugas.id} className="flex items-start justify-between gap-4 py-4">
                  <div className="min-w-0">
                    <p className={tugas.status === 'selesai' ? 'text-zinc-400 line-through' : 'text-zinc-900'}>
                      {tugas.judul}
                    </p>
                    <p className="mt-1.5 flex flex-wrap items-center gap-x-3 text-xs text-zinc-400">
                      <span className="inline-flex items-center gap-1.5">
                        <span className={`h-1.5 w-1.5 rounded-full ${TITIK_STATUS[tugas.status] ?? 'bg-zinc-300'}`} />
                        {tugas.status}
                      </span>
                      <span>{tugas.ditugaskan_ke?.name ?? 'belum dibagi'}</span>
                    </p>
                  </div>
                  <p className="shrink-0 text-sm text-zinc-600">{formatTanggalJam(tugas.deadline)}</p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}

export default KelompokDetailPage