import { useState } from 'react'
import PageHeader from '@/components/PageHeader'
import { useMuatData } from '@/hooks/useMuatData'
import { ambilProfil, ubahProfil } from '@/api/auth'

const kelasIsian =
  'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100 disabled:text-slate-500'
const kelasLabel = 'block text-sm font-medium text-slate-700'

// Form dibuat terpisah supaya isi awalnya baru dipakai setelah datanya selesai dimuat
function FormProfil({ profil, onTersimpan }) {
  const [form, setForm] = useState({ name: profil.name, nim: profil.nim ?? '', semester: profil.semester ?? 1 })
  const [pesanError, setPesanError] = useState('')
  const [pesanBerhasil, setPesanBerhasil] = useState('')
  const [mengirim, setMengirim] = useState(false)

  function ubahIsian(event) {
    const { name, value, type } = event.target
    setPesanBerhasil('')
    setForm({ ...form, [name]: type === 'number' ? Number(value) : value })
  }

  async function kirim(event) {
    event.preventDefault()
    setPesanError('')
    setMengirim(true)
    try {
      onTersimpan(await ubahProfil({ ...form, name: form.name.trim(), nim: form.nim.trim() }))
      setPesanBerhasil('Profil tersimpan.')
    } catch (error) {
      setPesanError(error.message)
    }
    setMengirim(false)
  }

  return (
    <form className="max-w-xl space-y-4 rounded-xl border border-slate-200 bg-white p-5 sm:p-6" onSubmit={kirim}>
      <div>
        <label className={kelasLabel} htmlFor="email">Email</label>
        <input id="email" className={kelasIsian} value={profil.email} disabled />
      </div>
      <div>
        <label className={kelasLabel} htmlFor="name">Nama lengkap</label>
        <input id="name" name="name" className={kelasIsian} value={form.name} onChange={ubahIsian} maxLength={255} required />
      </div>
      <div>
        <label className={kelasLabel} htmlFor="nim">NIM</label>
        <input id="nim" name="nim" className={kelasIsian} value={form.nim} onChange={ubahIsian} maxLength={20} required />
      </div>
      <div>
        <label className={kelasLabel} htmlFor="semester">Semester</label>
        <input id="semester" name="semester" type="number" min="1" max="14" className={kelasIsian} value={form.semester} onChange={ubahIsian} required />
      </div>

      {pesanError && <p className="pesan-error">{pesanError}</p>}
      {pesanBerhasil && <p className="text-sm text-emerald-700" role="status">{pesanBerhasil}</p>}

      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          disabled={mengirim}
        >
          {mengirim ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>
    </form>
  )
}

function ProfilPage() {
  const { data: profil, memuat, error, setData } = useMuatData(() => ambilProfil(), [])

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 sm:p-6 lg:p-8">
      <PageHeader judul="Profil" deskripsi="Data akun kamu." />

      {memuat ? (
        <p className="text-sm text-slate-500">Memuat...</p>
      ) : error ? (
        <p className="pesan-error">{error.message}</p>
      ) : (
        <FormProfil profil={profil} onTersimpan={setData} />
      )}
    </div>
  )
}

export default ProfilPage
