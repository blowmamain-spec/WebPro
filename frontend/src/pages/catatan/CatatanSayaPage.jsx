import { Link } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import RencanaIsi from '@/components/RencanaIsi'
import { useMuatData } from '@/hooks/useMuatData'
import { ambilCatatanSaya } from '@/api/catatan'
import { formatTanggal } from '@/utils/format'
// Fungsi lain yang tersedia di @/api/catatan: hapusCatatan(), ubahCatatan() (misal untuk membagikan)

function CatatanSayaPage() {
  const { data: daftarCatatan, memuat } = useMuatData(() => ambilCatatanSaya(), [])

  return (
    <div>
      <PageHeader judul="Catatan Saya" deskripsi="Semua catatan pribadi dan catatan yang kamu bagikan.">
        <Link to="/catatan/baru" className="tombol">Tulis Catatan</Link>
      </PageHeader>

      {/* Titik awal: tampilan paling sederhana dari data. Silakan dirombak. */}
      {memuat ? (
        <p className="teks-redup">Memuat...</p>
      ) : (
        <ul className="kartu">
          {daftarCatatan.map((catatan) => (
            <li key={catatan.id}>
              <Link to={`/catatan/${catatan.id}/edit`}>{catatan.judul}</Link> ({catatan.mata_kuliah?.nama}) ·{' '}
              {catatan.status} · {formatTanggal(catatan.updated_at)}
            </li>
          ))}
        </ul>
      )}

      <RencanaIsi>
        <li>Daftar catatan milik sendiri dengan status: pribadi / publik / menunggu moderasi / ditolak</li>
        <li>Filter per mata kuliah</li>
        <li>Tombol ubah dan hapus</li>
      </RencanaIsi>
    </div>
  )
}

export default CatatanSayaPage
