import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import OpsiMataKuliah from '@/components/OpsiMataKuliah'
import { useMuatData } from '@/hooks/useMuatData'
import { ambilCatatan, tambahCatatan, ubahCatatan } from '@/api/catatan'
import { ambilDaftarMataKuliah } from '@/api/mataKuliah'

const kelasIsian =
  'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100'
const kelasLabel = 'block text-sm font-medium text-slate-700'

const CATATAN_STATUS = {
  menunggu: 'Catatan ini sedang menunggu keputusan admin, jadi belum tampil di Jelajah. Statusnya tidak berubah sampai admin memutuskan.',
  ditolak: 'Catatan ini ditolak admin dan hanya kamu yang bisa melihatnya. Kalau dibagikan lagi, catatan akan menunggu keputusan admin dulu.',
}

// Form dibuat terpisah supaya isi awalnya baru dipakai setelah datanya selesai dimuat
function FormCatatan({ catatan, daftarMataKuliah }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    judul: catatan?.judul ?? '',
    isi: catatan?.isi ?? '',
    mata_kuliah_id: catatan?.mata_kuliah_id ?? '',
    status: !catatan || catatan.status === 'pribadi' ? 'pribadi' : 'publik',
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

    const data = { ...form, mata_kuliah_id: form.mata_kuliah_id ? Number(form.mata_kuliah_id) : null }
    try {
      if (catatan) {
        await ubahCatatan(catatan.id, data)
      } else {
        await tambahCatatan(data)
      }
      navigate('/catatan')
    } catch (error) {
      setPesanError(error.message)
      setMengirim(false)
    }
  }

  return (
    <form className="max-w-3xl space-y-4 rounded-xl border border-slate-200 bg-white p-5 sm:p-6" onSubmit={kirim}>
      {CATATAN_STATUS[catatan?.status] && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          {CATATAN_STATUS[catatan.status]}
        </p>
      )}

      <div>
        <label className={kelasLabel} htmlFor="judul">Judul</label>
        <input id="judul" name="judul" className={kelasIsian} value={form.judul} onChange={ubahIsian} maxLength={255} required />
      </div>

      <div>
        <label className={kelasLabel} htmlFor="mata_kuliah_id">Mata kuliah</label>
        <select id="mata_kuliah_id" name="mata_kuliah_id" className={kelasIsian} value={form.mata_kuliah_id} onChange={ubahIsian}>
          <option value="">Umum</option>
          <OpsiMataKuliah daftar={daftarMataKuliah} />
        </select>
      </div>

      <div>
        <label className={kelasLabel} htmlFor="isi">Isi catatan</label>
        <textarea
          id="isi"
          name="isi"
          rows={14}
          className={`${kelasIsian} font-mono`}
          value={form.isi}
          onChange={ubahIsian}
          maxLength={50000}
        />
      </div>

      <fieldset>
        <legend className={kelasLabel}>Siapa yang bisa melihat?</legend>
        <div className="mt-2 space-y-2 text-sm text-slate-700">
          <label className="flex items-start gap-2">
            <input className="mt-1" type="radio" name="status" value="pribadi" checked={form.status === 'pribadi'} onChange={ubahIsian} />
            <span>Pribadi: hanya kamu</span>
          </label>
          <label className="flex items-start gap-2">
            <input className="mt-1" type="radio" name="status" value="publik" checked={form.status === 'publik'} onChange={ubahIsian} />
            <span>Bagikan: tampil di Jelajah Catatan, kecuali kena kata terlarang (menunggu keputusan admin)</span>
          </label>
        </div>
      </fieldset>

      {pesanError && <p className="pesan-error">{pesanError}</p>}

      <div className="flex justify-end gap-3">
        <Link to="/catatan" className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 no-underline hover:bg-slate-50">
          Batal
        </Link>
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

// Satu halaman dipakai untuk dua alamat: /catatan/baru dan /catatan/:id/edit
function CatatanEditorPage() {
  const { id } = useParams()
  const modeEdit = id !== undefined

  const { data, memuat, error } = useMuatData(
    () => Promise.all([ambilDaftarMataKuliah(), modeEdit ? ambilCatatan(id) : null]),
    [id],
  )
  const [daftarMataKuliah, catatan] = data ?? []

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 sm:p-6 lg:p-8">
      <PageHeader
        judul={modeEdit ? 'Ubah Catatan' : 'Tulis Catatan'}
        deskripsi="Simpan sebagai catatan pribadi atau bagikan ke mahasiswa lain."
      />

      {memuat ? (
        <p className="text-sm text-slate-500">Memuat...</p>
      ) : error ? (
        <p className="pesan-error">{error.message}</p>
      ) : modeEdit && !catatan.milik_saya ? (
        <p className="pesan-error">Kamu hanya bisa mengubah catatan milikmu sendiri.</p>
      ) : (
        <FormCatatan key={id ?? 'baru'} catatan={catatan} daftarMataKuliah={daftarMataKuliah} />
      )}
    </div>
  )
}

export default CatatanEditorPage
