import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import OpsiMataKuliah from '@/components/OpsiMataKuliah'
import { useMuatData } from '@/hooks/useMuatData'
import { ambilDaftarKelompok, buatKelompok } from '@/api/kelompok'
import { ambilDaftarMataKuliah } from '@/api/mataKuliah'

const gayaInput =
  'w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-900'

function KelompokPage() {
  const { data: daftarKelompok, memuat, error, setData } = useMuatData(() => ambilDaftarKelompok(), [])
  const { data: daftarMataKuliah } = useMuatData(() => ambilDaftarMataKuliah(), [])

  const [formTerbuka, setFormTerbuka] = useState(false)
  const [nama, setNama] = useState('')
  const [mataKuliahId, setMataKuliahId] = useState('')
  const [menyimpan, setMenyimpan] = useState(false)
  const [pesanError, setPesanError] = useState('')

  async function simpan(e) {
    e.preventDefault()
    setPesanError('')
    if (!nama.trim()) {
      setPesanError('Nama kelompok belum diisi.')
      return
    }

    setMenyimpan(true)
    try {
      const baru = await buatKelompok({
        nama: nama.trim(),
        mata_kuliah_id: mataKuliahId ? Number(mataKuliahId) : null,
      })
      setData((lama) => [...lama, baru])
      setNama('')
      setMataKuliahId('')
      setFormTerbuka(false)
    } catch (error) {
      setPesanError(error.message ?? 'Kelompok belum bisa dibuat.')
    }
    setMenyimpan(false)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader judul="Tugas Kelompok" deskripsi="Kelompok yang kamu ikuti dan tugas-tugasnya.">
        {!formTerbuka && (
          <button
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white transition-colors hover:bg-zinc-700"
            type="button"
            onClick={() => setFormTerbuka(true)}
          >
            Buat kelompok
          </button>
        )}
      </PageHeader>

      {formTerbuka && (
        <form onSubmit={simpan} className="mb-8 rounded-lg border border-zinc-200 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="kelompok-nama" className="mb-1 block text-sm text-zinc-600">
                Nama kelompok
              </label>
              <input
                id="kelompok-nama"
                autoFocus
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Misal: Kelompok 6 RPL"
                className={gayaInput}
              />
            </div>
            <div>
              <label htmlFor="kelompok-mk" className="mb-1 block text-sm text-zinc-600">
                Mata kuliah
              </label>
              <select
                id="kelompok-mk"
                value={mataKuliahId}
                onChange={(e) => setMataKuliahId(e.target.value)}
                className={gayaInput}
              >
                <option value="">Tidak ada</option>
                <OpsiMataKuliah daftar={daftarMataKuliah ?? []} />
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
              {menyimpan ? 'Menyimpan...' : 'Buat'}
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

      {memuat ? (
        <p className="py-10 text-sm text-zinc-400">Memuat...</p>
      ) : error ? (
        <p className="py-10 text-sm text-red-700">{error.message}</p>
      ) : daftarKelompok.length === 0 ? (
        <p className="py-12 text-sm text-zinc-500">Belum ada kelompok.</p>
      ) : (
        <ul className="divide-y divide-zinc-100 border-t border-zinc-200">
          {daftarKelompok.map((kelompok) => (
            <li key={kelompok.id}>
              <Link
                to={`/kelompok/${kelompok.id}`}
                className="group flex items-baseline justify-between gap-4 py-4 text-zinc-900"
              >
                <span className="min-w-0">
                  <span className="block font-medium group-hover:underline">{kelompok.nama}</span>
                  <span className="mt-0.5 block text-sm text-zinc-500">
                    {kelompok.mata_kuliah?.nama ?? 'Tanpa mata kuliah'}
                  </span>
                </span>
                <span className="shrink-0 text-sm text-zinc-400">{kelompok.anggota.length} anggota</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default KelompokPage