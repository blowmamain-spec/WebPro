import PageHeader from '@/components/PageHeader'
import RencanaIsi from '@/components/RencanaIsi'
import { useMuatData } from '@/hooks/useMuatData'
import { ambilJadwal } from '@/api/jadwal'
import { namaHari } from '@/utils/format'
// Fungsi lain yang tersedia di @/api/jadwal: tambahJadwal(), ubahJadwal(), hapusJadwal()
// Daftar mata kuliah untuk pilihan di form: ambilDaftarMataKuliah() dari @/api/mataKuliah

function JadwalPage() {
  const { data: daftarJadwal, memuat } = useMuatData(() => ambilJadwal(), [])

  return (
    <div>
      <PageHeader judul="Jadwal Mingguan" deskripsi="Jadwal kuliah Senin sampai Minggu.">
        <button className="tombol" type="button">Tambah Jadwal</button>
      </PageHeader>

      {/* Titik awal: tampilan paling sederhana dari data. Silakan dirombak. */}
      {memuat ? (
        <p className="teks-redup">Memuat...</p>
      ) : (
        <ul className="kartu">
          {daftarJadwal.map((jadwal) => (
            <li key={jadwal.id}>
              {namaHari(jadwal.hari)}, {jadwal.jam_mulai}–{jadwal.jam_selesai} · {jadwal.mata_kuliah?.nama} · {jadwal.ruangan}
            </li>
          ))}
        </ul>
      )}

      <RencanaIsi>
        <li>Tabel/grid per hari: mata kuliah, jam mulai–selesai, ruangan</li>
        <li>Form tambah/ubah/hapus jadwal</li>
      </RencanaIsi>
    </div>
  )
}

export default JadwalPage
