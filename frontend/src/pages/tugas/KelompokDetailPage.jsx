import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import { useMuatData } from '@/hooks/useMuatData'
import {
  ambilKelompok,
  ambilTugasKelompok,
  hapusAnggota,
  hapusKelompok,
  tambahAnggota,
  tambahTugasKelompok,
  ubahKelompok,
} from '@/api/kelompok'
import { hapusTugas, ubahTugas } from '@/api/tugas'
import { ambilProfil } from '@/api/auth'
import { formatTanggalJam } from '@/utils/format'

const gayaInput =
  'w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-900'

const TITIK_STATUS = {
  belum: 'bg-zinc-300',
  dikerjakan: 'bg-amber-400',
  selesai: 'bg-zinc-900',
}

const FORM_KOSONG = { judul: '', deskripsi: '', deadline: '', prioritas: 'sedang', ditugaskanKe: '' }

function KelompokDetailPage() {
  // :id di alamat /kelompok/:id dibaca lewat useParams()
  const { id } = useParams()
  const navigate = useNavigate()

  // Tiga permintaan sekaligus. [id] artinya muat ulang kalau id di alamat berubah.
  const { data, memuat, error, setData } = useMuatData(
    () => Promise.all([ambilKelompok(id), ambilTugasKelompok(id), ambilProfil()]),
    [id],
  )
  const [kelompok, daftarTugas, profil] = data ?? []

  const [formTerbuka, setFormTerbuka] = useState(false)
  const [editId, setEditId] = useState(null) // null = form tambah, terisi = form ubah
  const [form, setForm] = useState(FORM_KOSONG)
  const [menyimpan, setMenyimpan] = useState(false)
  const [pesanError, setPesanError] = useState('')
  const [emailBaru, setEmailBaru] = useState('')
  const [errorAnggota, setErrorAnggota] = useState('')

  function ubahIsian(kolom, nilai) {
    setForm({ ...form, [kolom]: nilai })
  }

  function tutupForm() {
    setForm(FORM_KOSONG)
    setEditId(null)
    setFormTerbuka(false)
    setPesanError('')
  }

  function bukaUbah(tugas) {
    setForm({
      judul: tugas.judul,
      deskripsi: tugas.deskripsi ?? '',
      deadline: tugas.deadline.slice(0, 16),
      prioritas: tugas.prioritas,
      ditugaskanKe: tugas.ditugaskan_ke?.id ?? '',
    })
    setEditId(tugas.id)
    setPesanError('')
    setFormTerbuka(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function simpan(e) {
    e.preventDefault()
    setPesanError('')
    if (!form.judul.trim()) {
      setPesanError('Judul tugas belum diisi.')
      return
    }
    if (!form.deadline) {
      setPesanError('Deadline belum diisi.')
      return
    }

    setMenyimpan(true)
    const isi = {
      judul: form.judul.trim(),
      deskripsi: form.deskripsi.trim() || null,
      deadline: form.deadline.length === 16 ? `${form.deadline}:00` : form.deadline,
      prioritas: form.prioritas,
      ditugaskan_ke: form.ditugaskanKe ? Number(form.ditugaskanKe) : null,
    }

    try {
      if (editId) {
        const hasil = await ubahTugas(editId, isi)
        setData(([k, daftar, p]) => [k, daftar.map((t) => (t.id === hasil.id ? hasil : t)), p])
      } else {
        const baru = await tambahTugasKelompok(id, isi)
        // data berbentuk [kelompok, daftarTugas, profil], jadi yang ditambah hanya elemen kedua
        setData(([k, daftar, p]) => [k, [...daftar, baru], p])
      }
      tutupForm()
    } catch (error) {
      setPesanError(error.message ?? 'Tugas belum bisa disimpan.')
    }
    setMenyimpan(false)
  }

  async function ubahStatus(tugas, status) {
    setPesanError('')
    try {
      const hasil = await ubahTugas(tugas.id, { status })
      setData(([k, daftar, p]) => [k, daftar.map((t) => (t.id === hasil.id ? hasil : t)), p])
    } catch (error) {
      setPesanError(error.message ?? 'Status belum bisa diubah.')
    }
  }

  async function hapus(tugas) {
    if (!window.confirm(`Hapus tugas "${tugas.judul}"?`)) return

    setPesanError('')
    try {
      await hapusTugas(tugas.id)
      setData(([k, daftar, p]) => [k, daftar.filter((t) => t.id !== tugas.id), p])
    } catch (error) {
      setPesanError(error.message ?? 'Tugas belum bisa dihapus.')
    }
  }

  async function kirimAnggota(e) {
    e.preventDefault()
    setErrorAnggota('')
    try {
      const hasil = await tambahAnggota(id, emailBaru.trim())
      setData(([, daftar, p]) => [hasil, daftar, p])
      setEmailBaru('')
    } catch (error) {
      setErrorAnggota(error.message ?? 'Anggota belum bisa ditambahkan.')
    }
  }

  async function keluarkan(anggota) {
    const sendiri = anggota.id === profil.id
    const tanya = sendiri ? `Keluar dari ${kelompok.nama}?` : `Keluarkan ${anggota.name} dari kelompok?`
    if (!window.confirm(tanya)) return

    setErrorAnggota('')
    try {
      const hasil = await hapusAnggota(id, anggota.id)
      if (sendiri) {
        navigate('/kelompok')
        return
      }
      // Tugas orang yang dikeluarkan kembali jadi belum dibagi
      const tugasTerbaru = await ambilTugasKelompok(id)
      setData(([, , p]) => [hasil, tugasTerbaru, p])
    } catch (error) {
      setErrorAnggota(error.message ?? 'Anggota belum bisa dikeluarkan.')
    }
  }

  async function gantiNama() {
    const nama = window.prompt('Nama kelompok baru', kelompok.nama)?.trim()
    if (!nama || nama === kelompok.nama) return

    setErrorAnggota('')
    try {
      const hasil = await ubahKelompok(id, { nama })
      setData(([, daftar, p]) => [hasil, daftar, p])
    } catch (error) {
      setErrorAnggota(error.message ?? 'Nama kelompok belum bisa diubah.')
    }
  }

  async function hapusSemua() {
    if (!window.confirm(`Hapus ${kelompok.nama} beserta semua tugasnya?`)) return

    setErrorAnggota('')
    try {
      await hapusKelompok(id)
      navigate('/kelompok')
    } catch (error) {
      setErrorAnggota(error.message ?? 'Kelompok belum bisa dihapus.')
    }
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
          <section className="mb-8 border-b border-zinc-200 pb-6 text-sm">
            <p className="mb-2 text-zinc-400">Anggota</p>
            <ul className="space-y-1">
              {kelompok.anggota.map((a) => {
                const pembuat = a.id === kelompok.dibuat_oleh
                const bolehHapus = !pembuat && (kelompok.milik_saya || a.id === profil.id)

                return (
                  <li key={a.id} className="flex items-center justify-between gap-4 text-zinc-700">
                    <span>
                      {a.name}
                      {pembuat && <span className="ml-2 text-xs text-zinc-400">pembuat</span>}
                    </span>
                    {bolehHapus && (
                      <button type="button" className="text-xs text-zinc-500 hover:text-red-700" onClick={() => keluarkan(a)}>
                        {a.id === profil.id ? 'Keluar' : 'Keluarkan'}
                      </button>
                    )}
                  </li>
                )
              })}
            </ul>

            {kelompok.milik_saya && (
              <>
                <form onSubmit={kirimAnggota} className="mt-4 flex gap-2">
                  <label htmlFor="anggota-email" className="sr-only">Email anggota baru</label>
                  <input
                    id="anggota-email"
                    type="email"
                    required
                    value={emailBaru}
                    onChange={(e) => setEmailBaru(e.target.value)}
                    placeholder="Email akun anggota baru"
                    className={gayaInput}
                  />
                  <button type="submit" className="shrink-0 rounded-md border border-zinc-300 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50">
                    Tambah
                  </button>
                </form>
                <div className="mt-3 flex gap-4 text-xs">
                  <button type="button" className="text-zinc-500 hover:text-zinc-900" onClick={gantiNama}>Ubah nama kelompok</button>
                  <button type="button" className="text-zinc-500 hover:text-red-700" onClick={hapusSemua}>Hapus kelompok</button>
                </div>
              </>
            )}
            {errorAnggota && <p className="mt-3 text-sm text-red-700">{errorAnggota}</p>}
          </section>

          {formTerbuka && (
            <form onSubmit={simpan} className="mb-8 rounded-lg border border-zinc-200 p-5">
              <label htmlFor="tugas-judul" className="sr-only">
                Judul tugas
              </label>
              <input
                id="tugas-judul"
                autoFocus
                value={form.judul}
                onChange={(e) => ubahIsian('judul', e.target.value)}
                placeholder="Apa yang harus dikerjakan?"
                className="w-full border-0 border-b border-zinc-200 bg-transparent pb-2 text-lg text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-900"
              />
              <label htmlFor="tugas-deskripsi" className="sr-only">
                Catatan
              </label>
              <textarea
                id="tugas-deskripsi"
                value={form.deskripsi}
                onChange={(e) => ubahIsian('deskripsi', e.target.value)}
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
                    value={form.deadline}
                    onChange={(e) => ubahIsian('deadline', e.target.value)}
                    className={gayaInput}
                  />
                </div>
                <div>
                  <label htmlFor="tugas-prioritas" className="mb-1 block text-sm text-zinc-600">
                    Prioritas
                  </label>
                  <select
                    id="tugas-prioritas"
                    value={form.prioritas}
                    onChange={(e) => ubahIsian('prioritas', e.target.value)}
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
                    value={form.ditugaskanKe}
                    onChange={(e) => ubahIsian('ditugaskanKe', e.target.value)}
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
                <button type="button" onClick={tutupForm} className="text-sm text-zinc-500 hover:text-zinc-900">
                  Batal
                </button>
              </div>
            </form>
          )}

          {!formTerbuka && pesanError && <p className="mb-4 text-sm text-red-700">{pesanError}</p>}

          {daftarTugas.length === 0 ? (
            <p className="border-t border-zinc-200 py-12 text-sm text-zinc-500">Belum ada tugas di kelompok ini.</p>
          ) : (
            <ul className="divide-y divide-zinc-100 border-t border-zinc-200">
              {daftarTugas.map((tugas) => (
                <li key={tugas.id} className="flex flex-wrap items-start justify-between gap-4 py-4">
                  <div className="min-w-0">
                    <p className={tugas.status === 'selesai' ? 'text-zinc-400 line-through' : 'text-zinc-900'}>
                      {tugas.judul}
                    </p>
                    {tugas.deskripsi && <p className="mt-1 whitespace-pre-wrap break-words text-sm text-zinc-500">{tugas.deskripsi}</p>}
                    <p className="mt-1.5 flex flex-wrap items-center gap-x-3 text-xs text-zinc-400">
                      <span className="inline-flex items-center gap-1.5">
                        <span className={`h-1.5 w-1.5 rounded-full ${TITIK_STATUS[tugas.status] ?? 'bg-zinc-300'}`} />
                        <select
                          aria-label={`Status ${tugas.judul}`}
                          className="bg-transparent text-xs text-zinc-500"
                          value={tugas.status}
                          onChange={(e) => ubahStatus(tugas, e.target.value)}
                        >
                          <option value="belum">belum</option>
                          <option value="dikerjakan">dikerjakan</option>
                          <option value="selesai">selesai</option>
                        </select>
                      </span>
                      <span>{tugas.ditugaskan_ke?.name ?? 'belum dibagi'}</span>
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm text-zinc-600">{formatTanggalJam(tugas.deadline)}</p>
                    <p className="mt-1.5 flex justify-end gap-3 text-xs">
                      <button type="button" className="text-zinc-500 hover:text-zinc-900" onClick={() => bukaUbah(tugas)}>Ubah</button>
                      <button type="button" className="text-zinc-500 hover:text-red-700" onClick={() => hapus(tugas)}>Hapus</button>
                    </p>
                  </div>
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
