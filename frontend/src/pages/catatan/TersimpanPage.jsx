import { Link } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import RencanaIsi from '@/components/RencanaIsi'
import { useMuatData } from '@/hooks/useMuatData'
import { ambilCatatanTersimpan } from '@/api/catatan'
// Fungsi lain yang tersedia di @/api/catatan: batalSimpanCatatan()

function TersimpanPage() {
  const { data: daftarCatatan, memuat } = useMuatData(() => ambilCatatanTersimpan(), [])

  return (
    <div>
      <PageHeader judul="Tersimpan" deskripsi="Catatan orang lain yang kamu simpan." />

      {/* Titik awal: tampilan paling sederhana dari data. Silakan dirombak. */}
      {memuat ? (
        <p className="teks-redup">Memuat...</p>
      ) : (
        <ul className="kartu">
          {daftarCatatan.map((catatan) => (
            <li key={catatan.id}>
              <Link to={`/jelajah/${catatan.id}`}>{catatan.judul}</Link> · {catatan.penulis.name}
            </li>
          ))}
        </ul>
      )}

      <RencanaIsi>
        <li>Daftar catatan yang disimpan (bookmark)</li>
        <li>Tombol hapus dari daftar simpanan</li>
      </RencanaIsi>
    </div>
  )
}

export default TersimpanPage
