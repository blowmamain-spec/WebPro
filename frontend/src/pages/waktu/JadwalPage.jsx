import { useEffect, useState } from 'react'
import PageHeader from '@/components/PageHeader'
import OpsiMataKuliah from '@/components/OpsiMataKuliah'
import { useMuatData } from '@/hooks/useMuatData'
import {
  ambilJadwal,
  tambahJadwal,
  ubahJadwal,
  hapusJadwal
} from '@/api/jadwal'
import { ambilDaftarMataKuliah } from '@/api/mataKuliah'
import { namaHari } from '@/utils/format'

function JadwalPage() {
  const { data: daftarJadwal, memuat, error, setData } = useMuatData(
    () => ambilJadwal(),
    []
  )

  const [daftarMataKuliah, setDaftarMataKuliah] = useState([])
  const [hariAktif, setHariAktif] = useState(1)
  const [formTerbuka, setFormTerbuka] = useState(false)
  const [mode, setMode] = useState('tambah')
  const [editId, setEditId] = useState(null)

  const [form, setForm] = useState({
    mata_kuliah_id: '',
    jam_mulai: '',
    jam_selesai: '',
    ruangan: ''
  })

  const hari = [
    { id: 1, nama: 'Senin' },
    { id: 2, nama: 'Selasa' },
    { id: 3, nama: 'Rabu' },
    { id: 4, nama: 'Kamis' },
    { id: 5, nama: 'Jumat' },
    { id: 6, nama: 'Sabtu' },
    { id: 7, nama: 'Minggu' }
  ]

  // Mengambil daftar mata kuliah untuk pilihan form
  useEffect(() => {
    async function muatMataKuliah() {
      try {
        const hasil = await ambilDaftarMataKuliah()
        setDaftarMataKuliah(hasil)
      } catch (error) {
        console.error('Gagal memuat mata kuliah:', error)
      }
    }

    muatMataKuliah()
  }, [])

  // Filter jadwal berdasarkan hari yang dipilih
  const jadwalHariIni = daftarJadwal
    ? daftarJadwal.filter((jadwal) => jadwal.hari === hariAktif)
    : []

  function resetForm() {
    setForm({
      mata_kuliah_id: '',
      jam_mulai: '',
      jam_selesai: '',
      ruangan: ''
    })
  }

  // Membuka form untuk menambah jadwal
  function bukaTambah() {
    resetForm()
    setMode('tambah')
    setEditId(null)
    setFormTerbuka(true)
  }

  // Membuka form edit
  function bukaEdit(jadwal) {
    setMode('edit')
    setEditId(jadwal.id)

    setForm({
      mata_kuliah_id: jadwal.mata_kuliah_id,
      jam_mulai: jadwal.jam_mulai,
      jam_selesai: jadwal.jam_selesai,
      ruangan: jadwal.ruangan || ''
    })

    setFormTerbuka(true)
  }

  // Menghapus jadwal
  async function handleHapus(id) {
    const yakin = window.confirm(
      'Apakah kamu yakin ingin menghapus jadwal ini?'
    )

    if (!yakin) return

    try {
      await hapusJadwal(id)

      setData((sebelumnya) =>
        sebelumnya.filter((jadwal) => jadwal.id !== id)
      )
    } catch (error) {
      console.error('ERROR HAPUS JADWAL:', error)
      alert(error.message || 'Jadwal gagal dihapus.')
    }
  }

  // Menyimpan tambah atau edit jadwal
  async function handleSubmit(event) {
  event.preventDefault()

  const data = {
    mata_kuliah_id: Number(form.mata_kuliah_id),
    hari: Number(hariAktif),
    jam_mulai: form.jam_mulai,
    jam_selesai: form.jam_selesai,
    ruangan: form.ruangan || null
  }

  try {
    if (mode === 'tambah') {
      const jadwalBaru = await tambahJadwal(data)

      setData((sebelumnya) => [
        ...sebelumnya,
        jadwalBaru
      ])
    } else {
      const jadwalDiubah = await ubahJadwal(editId, data)

      setData((sebelumnya) =>
        sebelumnya.map((jadwal) =>
          jadwal.id === editId ? jadwalDiubah : jadwal
        )
      )
    }

    setFormTerbuka(false)
    resetForm()
  } catch (error) {
    console.error('ERROR SIMPAN JADWAL:', error)
    alert(error.message || 'Data gagal disimpan. Pastikan semua data sudah diisi.')
  }
}
  return (
    <div className="jadwal-page">

      <PageHeader
        judul="Jadwal Kuliah"
        deskripsi="Kelola jadwal kuliah dan ruangan dengan mudah."
      >
        <button
          className="tombol"
          type="button"
          onClick={bukaTambah}
        >
          + Tambah Jadwal
        </button>
      </PageHeader>

      {/* Pilihan hari */}
      <div className="hari-list">
        {hari.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`hari ${hariAktif === item.id ? 'active' : ''}`}
            onClick={() => setHariAktif(item.id)}
          >
            {item.nama}
          </button>
        ))}
      </div>

      <div className="jadwal-content">

        {/* Card daftar jadwal */}
        <div className="jadwal-card">

          <div className="jadwal-table-header">
            <div>Mata Kuliah</div>
            <div>Jam</div>
            <div>Ruangan</div>
            <div></div>
          </div>

          {memuat ? (
            <p className="teks-redup">Memuat...</p>
          ) : error ? (
            <p className="pesan-error">{error.message}</p>
          ) : jadwalHariIni.length === 0 ? (
            <div className="jadwal-kosong">
              Belum ada jadwal untuk hari {namaHari(hariAktif)}.
            </div>
          ) : (
            jadwalHariIni.map((jadwal) => (
              <div className="jadwal-row" key={jadwal.id}>

                <div>
                  {jadwal.mata_kuliah?.nama ?? 'Mata Kuliah'}
                </div>

                <div>
                  {jadwal.jam_mulai} - {jadwal.jam_selesai}
                </div>

                <div>{jadwal.ruangan || '-'}</div>

                <div className="jadwal-actions">

                  <button
                    type="button"
                    className="jadwal-action-btn add-btn"
                    onClick={bukaTambah}
                    title="Tambah jadwal"
                  >
                    +
                  </button>

                  <button
                    type="button"
                    className="jadwal-action-btn delete-btn"
                    onClick={() => handleHapus(jadwal.id)}
                    title="Hapus jadwal"
                  >
                    −
                  </button>

                  <button
                    type="button"
                    className="jadwal-action-btn edit-btn"
                    onClick={() => bukaEdit(jadwal)}
                    title="Edit jadwal"
                  >
                    ✎
                  </button>

                </div>
              </div>
            ))
          )}
        </div>

        {/* Form tambah dan edit */}
        {formTerbuka && (
          <div className="jadwal-form-card">

            <h2>
              {mode === 'edit'
                ? 'Edit Jadwal'
                : 'Tambah Jadwal'}
            </h2>

            <form onSubmit={handleSubmit}>

              <label>Mata Kuliah</label>
              <select
                value={form.mata_kuliah_id}
                onChange={(event) =>
                  setForm({
                    ...form,
                    mata_kuliah_id: event.target.value
                  })
                }
                required
              >
                <option value="" disabled>Pilih mata kuliah</option>
                <OpsiMataKuliah daftar={daftarMataKuliah} />
              </select>

              <label>Jam Mulai</label>
              <input
                type="time"
                value={form.jam_mulai}
                onChange={(event) =>
                  setForm({
                    ...form,
                    jam_mulai: event.target.value
                  })
                }
                required
              />

              <label>Jam Selesai</label>
              <input
                type="time"
                value={form.jam_selesai}
                onChange={(event) =>
                  setForm({
                    ...form,
                    jam_selesai: event.target.value
                  })
                }
                required
              />

              <label>Ruangan</label>
              <input
                type="text"
                placeholder="Contoh: Gedung A 0302"
                value={form.ruangan}
                onChange={(event) =>
                  setForm({
                    ...form,
                    ruangan: event.target.value
                  })
                }
              />

              <div className="jadwal-form-buttons">

                <button
                  type="button"
                  onClick={() => {
                    setFormTerbuka(false)
                    resetForm()
                  }}
                >
                  Batal
                </button>

                <button
                  className="tombol"
                  type="submit"
                >
                  Simpan
                </button>

              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  )
}

export default JadwalPage