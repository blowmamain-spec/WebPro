import { Link } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import RencanaIsi from '@/components/RencanaIsi'
import { useMuatData } from '@/hooks/useMuatData'
import { ambilDaftarKelompok } from '@/api/kelompok'
// Fungsi lain yang tersedia di @/api/kelompok: buatKelompok()

function KelompokPage() {
  const { data: daftarKelompok, memuat } = useMuatData(() => ambilDaftarKelompok(), [])

  return (
    <div>
      <PageHeader judul="Tugas Kelompok" deskripsi="Kelompok yang kamu ikuti dan tugas-tugasnya.">
        <button className="tombol" type="button">Buat Kelompok</button>
      </PageHeader>

      {/* Titik awal: tampilan paling sederhana dari data. Silakan dirombak. */}
      {memuat ? (
        <p className="teks-redup">Memuat...</p>
      ) : (
        <ul className="kartu">
          {daftarKelompok.map((kelompok) => (
            <li key={kelompok.id}>
              <Link to={`/kelompok/${kelompok.id}`}>{kelompok.nama}</Link> ({kelompok.mata_kuliah?.nama}) ·{' '}
              {kelompok.anggota.length} anggota
            </li>
          ))}
        </ul>
      )}

      <RencanaIsi>
        <li>Daftar kelompok yang diikuti (nama, mata kuliah, jumlah anggota)</li>
        <li>Form buat kelompok baru dan undang anggota</li>
        <li>Klik kelompok untuk membuka halaman detail</li>
      </RencanaIsi>
    </div>
  )
}

export default KelompokPage
