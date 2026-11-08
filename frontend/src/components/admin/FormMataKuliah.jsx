import { useState } from 'react'
import { KATEGORI_MATA_KULIAH } from '@/utils/format'

const kelasIsian =
  'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100'
const kelasLabel = 'block text-sm font-medium text-slate-700'

// `mataKuliah` kosong = form tambah, terisi = form ubah.
function FormMataKuliah({ mataKuliah, onSimpan, onBatal }) {
  const [form, setForm] = useState({
    kode: mataKuliah?.kode ?? '',
    nama: mataKuliah?.nama ?? '',
    semester: mataKuliah?.semester ?? 1,
    sks: mataKuliah?.sks ?? 3,
    kategori: mataKuliah?.kategori ?? 'wajib',
  })
  const [pesanError, setPesanError] = useState('')
  const [mengirim, setMengirim] = useState(false)

  function ubahIsian(event) {
    const { name, value, type } = event.target
    setForm({ ...form, [name]: type === 'number' ? Number(value) : value })
  }

  async function kirim(event) {
    event.preventDefault()
    setPesanError('')
    setMengirim(true)
    try {
      await onSimpan({ ...form, kode: form.kode.trim(), nama: form.nama.trim() })
    } catch (error) {
      setPesanError(error.message)
      setMengirim(false)
    }
  }

  return (
    <div className="fixed inset-0 z-20 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4 sm:items-center">
      <form
        className="w-full max-w-lg space-y-4 rounded-xl bg-white p-5 shadow-xl sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="judul-form-mk"
        onSubmit={kirim}
      >
        <h2 id="judul-form-mk" className="text-lg font-semibold text-slate-900">
          {mataKuliah ? 'Ubah Mata Kuliah' : 'Tambah Mata Kuliah'}
        </h2>

        <div>
          <label className={kelasLabel} htmlFor="kode">Kode</label>
          <input id="kode" name="kode" className={kelasIsian} value={form.kode} onChange={ubahIsian} maxLength={20} required autoFocus />
        </div>

        <div>
          <label className={kelasLabel} htmlFor="nama">Nama</label>
          <input id="nama" name="nama" className={kelasIsian} value={form.nama} onChange={ubahIsian} maxLength={255} required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={kelasLabel} htmlFor="semester">Semester</label>
            <input id="semester" name="semester" type="number" min="1" max="14" className={kelasIsian} value={form.semester} onChange={ubahIsian} required />
          </div>
          <div>
            <label className={kelasLabel} htmlFor="sks">SKS</label>
            <input id="sks" name="sks" type="number" min="1" max="8" className={kelasIsian} value={form.sks} onChange={ubahIsian} required />
          </div>
        </div>

        <div>
          <label className={kelasLabel} htmlFor="kategori">Kategori</label>
          <select id="kategori" name="kategori" className={kelasIsian} value={form.kategori} onChange={ubahIsian}>
            <option value="wajib">Wajib</option>
            {Object.entries(KATEGORI_MATA_KULIAH).map(([kategori, label]) => (
              <option key={kategori} value={kategori}>{label}</option>
            ))}
          </select>
        </div>

        {pesanError && <p className="pesan-error">{pesanError}</p>}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={onBatal}
          >
            Batal
          </button>
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
            disabled={mengirim}
          >
            {mengirim ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default FormMataKuliah
