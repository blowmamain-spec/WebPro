import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import FormMataKuliah from '@/components/admin/FormMataKuliah'
import { useMuatData } from '@/hooks/useMuatData'
import { ambilDaftarMataKuliah, hapusMataKuliah, tambahMataKuliah, ubahMataKuliah } from '@/api/mataKuliah'
import { KATEGORI_MATA_KULIAH } from '@/utils/format'

const kelasIsian =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100'

function namaKategori(kategori) {
  return KATEGORI_MATA_KULIAH[kategori] ?? 'Wajib'
}

function urutkan(daftar) {
  return [...daftar].sort((a, b) => a.semester - b.semester || a.nama.localeCompare(b.nama))
}

function MataKuliahPage() {
  const { data: daftarMataKuliah, memuat, error, setData } = useMuatData(() => ambilDaftarMataKuliah(), [])

  // null = form tertutup, 'baru' = form tambah, objek = form ubah
  const [formMk, setFormMk] = useState(null)
  const [pesanError, setPesanError] = useState('')
  const [cari, setCari] = useState('')
  const [kategori, setKategori] = useState('')

  const kataKunci = cari.trim().toLowerCase()
  const daftarTampil = (daftarMataKuliah ?? [])
    .filter((mk) => !kategori || mk.kategori === kategori)
    .filter((mk) => !kataKunci || `${mk.kode} ${mk.nama}`.toLowerCase().includes(kataKunci))

  async function simpan(data) {
    if (formMk === 'baru') {
      const baru = await tambahMataKuliah(data)
      setData((daftar) => urutkan([...daftar, baru]))
    } else {
      const hasil = await ubahMataKuliah(formMk.id, data)
      setData((daftar) => urutkan(daftar.map((mk) => (mk.id === hasil.id ? hasil : mk))))
    }
    setFormMk(null)
  }

  async function hapus(mk) {
    if (!window.confirm(`Hapus mata kuliah "${mk.nama}"?`)) return

    setPesanError('')
    try {
      await hapusMataKuliah(mk.id)
      setData((daftar) => daftar.filter((item) => item.id !== mk.id))
    } catch (error) {
      setPesanError(error.message)
    }
  }

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 sm:p-6 lg:p-8">
      <PageHeader judul="Mata Kuliah" deskripsi="Kategori mata kuliah yang dipakai di seluruh aplikasi.">
        <button
          className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
          type="button"
          onClick={() => setFormMk('baru')}
        >
          Tambah Mata Kuliah
        </button>
      </PageHeader>

      {pesanError && <p className="pesan-error">{pesanError}</p>}

      {memuat ? (
        <p className="text-sm text-slate-500">Memuat...</p>
      ) : error ? (
        <p className="pesan-error">{error.message}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-[1fr_2fr]">
            <select className={kelasIsian} aria-label="Filter kategori" value={kategori} onChange={(e) => setKategori(e.target.value)}>
              <option value="">Semua kategori</option>
              <option value="wajib">Wajib</option>
              {Object.entries(KATEGORI_MATA_KULIAH).map(([kunci, label]) => (
                <option key={kunci} value={kunci}>{label}</option>
              ))}
            </select>
            <input
              className={kelasIsian}
              type="search"
              placeholder="Cari kode atau nama"
              aria-label="Cari mata kuliah"
              value={cari}
              onChange={(e) => setCari(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Kode</th>
                  <th className="px-4 py-3 font-medium">Nama</th>
                  <th className="px-4 py-3 font-medium">Semester</th>
                  <th className="px-4 py-3 font-medium">SKS</th>
                  <th className="px-4 py-3 font-medium">Kategori</th>
                  <th className="px-4 py-3"><span className="sr-only">Aksi</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {daftarTampil.map((mk) => (
                  <tr key={mk.id}>
                    <td className="px-4 py-3 font-mono text-xs">{mk.kode}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{mk.nama}</td>
                    <td className="px-4 py-3">{mk.semester}</td>
                    <td className="px-4 py-3">{mk.sks}</td>
                    <td className="px-4 py-3">{namaKategori(mk.kategori)}</td>
                    <td className="px-4 py-2 text-right whitespace-nowrap">
                      <button
                        type="button"
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                        aria-label={`Ubah ${mk.nama}`}
                        onClick={() => setFormMk(mk)}
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-700"
                        aria-label={`Hapus ${mk.nama}`}
                        onClick={() => hapus(mk)}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
                {daftarTampil.length === 0 && (
                  <tr>
                    <td className="px-4 py-8 text-center text-slate-500" colSpan={6}>Mata kuliah tidak ditemukan.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {formMk && (
        <FormMataKuliah
          key={formMk === 'baru' ? 'baru' : formMk.id}
          mataKuliah={formMk === 'baru' ? null : formMk}
          onSimpan={simpan}
          onBatal={() => setFormMk(null)}
        />
      )}
    </div>
  )
}

export default MataKuliahPage
