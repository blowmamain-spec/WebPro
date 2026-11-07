import { Link } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import RencanaIsi from '@/components/RencanaIsi'
import { useMuatData } from '@/hooks/useMuatData'
import { jelajahCatatan } from '@/api/catatan'
import { formatTanggal } from '@/utils/format'
// Untuk filter: jelajahCatatan({ mata_kuliah_id, semester, cari }), lalu masukkan filter ke deps useMuatData
// Daftar mata kuliah untuk pilihan filter: ambilDaftarMataKuliah() dari @/api/mataKuliah

function JelajahPage() {
  const { data: daftarCatatan, memuat } = useMuatData(() => jelajahCatatan(), [])

  return (
    <div>
      <PageHeader judul="Jelajah Catatan" deskripsi="Catatan yang dibagikan mahasiswa lain." />

      {/* Titik awal: tampilan paling sederhana dari data. Silakan dirombak. */}
      {memuat ? (
        <p className="teks-redup">Memuat...</p>
      ) : (
        <ul className="kartu">
          {daftarCatatan.map((catatan) => (
            <li key={catatan.id}>
              <Link to={`/jelajah/${catatan.id}`}>{catatan.judul}</Link> · {catatan.penulis.name} ·{' '}
              {catatan.mata_kuliah?.nama} (semester {catatan.mata_kuliah?.semester}) · {formatTanggal(catatan.created_at)}
            </li>
          ))}
        </ul>
      )}

      <RencanaIsi>
        <li>Daftar catatan publik (judul, penulis, mata kuliah, tanggal)</li>
        <li>Filter per mata kuliah dan tingkat/semester, kolom pencarian</li>
        <li>Klik catatan untuk membuka halaman detail</li>
      </RencanaIsi>
    </div>
  )
}

export default JelajahPage
