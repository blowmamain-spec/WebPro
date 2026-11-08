import { useState } from 'react'
import { X } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import { useMuatData } from '@/hooks/useMuatData'
import { ambilKataTerlarang, hapusKataTerlarang, tambahKataTerlarang } from '@/api/admin'

function KataTerlarangPage() {
  const { data: daftarKata, memuat, error, setData } = useMuatData(() => ambilKataTerlarang(), [])
  const [kataBaru, setKataBaru] = useState('')
  const [pesanError, setPesanError] = useState('')
  const [mengirim, setMengirim] = useState(false)

  async function tambah(event) {
    event.preventDefault()
    setPesanError('')
    setMengirim(true)
    try {
      const baru = await tambahKataTerlarang(kataBaru)
      setData((daftar) => [...daftar, baru].sort((a, b) => a.kata.localeCompare(b.kata)))
      setKataBaru('')
    } catch (error) {
      setPesanError(error.message)
    }
    setMengirim(false)
  }

  async function hapus(kata) {
    if (!window.confirm(`Hapus kata "${kata.kata}"?`)) return

    setPesanError('')
    try {
      await hapusKataTerlarang(kata.id)
      setData((daftar) => daftar.filter((k) => k.id !== kata.id))
    } catch (error) {
      setPesanError(error.message)
    }
  }

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 sm:p-6 lg:p-8">
      <PageHeader
        judul="Kata Terlarang"
        deskripsi="Catatan yang mengandung kata ini masuk antrean moderasi saat dibagikan."
      />

      <form className="flex max-w-xl gap-2 rounded-xl border border-slate-200 bg-white p-4" onSubmit={tambah}>
        <label htmlFor="kata-baru" className="sr-only">Kata baru</label>
        <input
          id="kata-baru"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          placeholder="Kata baru"
          maxLength={100}
          value={kataBaru}
          onChange={(event) => setKataBaru(event.target.value)}
          required
        />
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          disabled={mengirim}
        >
          Tambah Kata
        </button>
      </form>

      {pesanError && <p className="pesan-error">{pesanError}</p>}

      {memuat ? (
        <p className="text-sm text-slate-500">Memuat...</p>
      ) : error ? (
        <p className="pesan-error">{error.message}</p>
      ) : daftarKata.length === 0 ? (
        <p className="text-sm text-slate-500">Belum ada kata terlarang.</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {daftarKata.map((kata) => (
            <li key={kata.id} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white py-1 pl-3 pr-1 text-sm text-slate-700">
              <span className="break-all">{kata.kata}</span>
              <button
                type="button"
                className="rounded-full p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-700"
                aria-label={`Hapus kata ${kata.kata}`}
                onClick={() => hapus(kata)}
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default KataTerlarangPage
