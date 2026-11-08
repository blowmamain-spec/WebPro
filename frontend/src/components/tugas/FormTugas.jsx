import { useState } from 'react'

const kelasIsian =
  'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100'
const kelasLabel = 'block text-sm font-medium text-slate-700'

// `tugas` kosong = form tambah, terisi = form ubah.
function FormTugas({ tugas, daftarMataKuliah, onSimpan, onBatal }) {
  const [form, setForm] = useState({
    judul: tugas?.judul ?? '',
    mata_kuliah_id: tugas?.mata_kuliah_id ?? '',
    // <input type="datetime-local"> memakai format "2026-11-02T23:59"
    deadline: tugas?.deadline?.slice(0, 16) ?? '',
    prioritas: tugas?.prioritas ?? 'sedang',
    status: tugas?.status ?? 'belum',
    deskripsi: tugas?.deskripsi ?? '',
  })
  const [pesanError, setPesanError] = useState('')
  const [mengirim, setMengirim] = useState(false)

  function ubahIsian(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function kirim(event) {
    event.preventDefault()
    setPesanError('')
    setMengirim(true)
    try {
      await onSimpan({
        ...form,
        mata_kuliah_id: form.mata_kuliah_id ? Number(form.mata_kuliah_id) : null,
        deskripsi: form.deskripsi || null,
      })
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
        aria-labelledby="judul-form-tugas"
        onSubmit={kirim}
      >
        <h2 id="judul-form-tugas" className="text-lg font-semibold text-slate-900">
          {tugas ? 'Ubah Tugas' : 'Tambah Tugas'}
        </h2>

        <div>
          <label className={kelasLabel} htmlFor="judul">Judul</label>
          <input id="judul" name="judul" className={kelasIsian} value={form.judul} onChange={ubahIsian} maxLength={255} required autoFocus />
        </div>

        <div>
          <label className={kelasLabel} htmlFor="mata_kuliah_id">Mata kuliah</label>
          <select id="mata_kuliah_id" name="mata_kuliah_id" className={kelasIsian} value={form.mata_kuliah_id} onChange={ubahIsian}>
            <option value="">Tanpa mata kuliah</option>
            {daftarMataKuliah.map((mataKuliah) => (
              <option key={mataKuliah.id} value={mataKuliah.id}>{mataKuliah.nama}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={kelasLabel} htmlFor="deadline">Deadline</label>
          <input id="deadline" name="deadline" type="datetime-local" className={kelasIsian} value={form.deadline} onChange={ubahIsian} required />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={kelasLabel} htmlFor="prioritas">Prioritas</label>
            <select id="prioritas" name="prioritas" className={kelasIsian} value={form.prioritas} onChange={ubahIsian}>
              <option value="rendah">Rendah</option>
              <option value="sedang">Sedang</option>
              <option value="tinggi">Tinggi</option>
            </select>
          </div>
          <div>
            <label className={kelasLabel} htmlFor="status">Status</label>
            <select id="status" name="status" className={kelasIsian} value={form.status} onChange={ubahIsian}>
              <option value="belum">Belum</option>
              <option value="dikerjakan">Dikerjakan</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>
        </div>

        <div>
          <label className={kelasLabel} htmlFor="deskripsi">Deskripsi (boleh kosong)</label>
          <textarea id="deskripsi" name="deskripsi" rows={3} className={kelasIsian} value={form.deskripsi} onChange={ubahIsian} maxLength={5000} />
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

export default FormTugas
