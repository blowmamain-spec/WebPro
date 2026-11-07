import PageHeader from '@/components/PageHeader'
import RencanaIsi from '@/components/RencanaIsi'
import { useMuatData } from '@/hooks/useMuatData'
import { ambilRingkasan } from '@/api/admin'

function AdminDashboardPage() {
  const { data: ringkasan, memuat } = useMuatData(() => ambilRingkasan(), [])

  return (
    <div>
      <PageHeader judul="Ringkasan Admin" deskripsi="Kondisi konten di aplikasi." />

      {/* Titik awal: tampilan paling sederhana dari data. Silakan dirombak. */}
      {memuat ? (
        <p className="teks-redup">Memuat...</p>
      ) : (
        <ul className="kartu">
          <li>Menunggu moderasi: {ringkasan.menunggu_moderasi}</li>
          <li>Laporan baru: {ringkasan.laporan_baru}</li>
          <li>Jumlah mahasiswa: {ringkasan.jumlah_pengguna}</li>
          <li>Catatan publik: {ringkasan.catatan_publik}</li>
        </ul>
      )}

      <RencanaIsi>
        <li>Kartu angka: catatan menunggu moderasi, laporan baru, jumlah pengguna, catatan publik</li>
        <li>Tautan cepat ke halaman Moderasi</li>
      </RencanaIsi>
    </div>
  )
}

export default AdminDashboardPage
