import PageHeader from '@/components/PageHeader'
import RencanaIsi from '@/components/RencanaIsi'
import { useMuatData } from '@/hooks/useMuatData'
import { ambilDaftarMataKuliah } from '@/api/mataKuliah'
// Fungsi lain yang tersedia di @/api/mataKuliah: tambahMataKuliah(), ubahMataKuliah(), hapusMataKuliah()

function MataKuliahPage() {
  const { data: daftarMataKuliah, memuat } = useMuatData(() => ambilDaftarMataKuliah(), [])

  return (
    <div>
      <PageHeader judul="Mata Kuliah" deskripsi="Kategori mata kuliah yang dipakai di seluruh aplikasi.">
        <button className="tombol" type="button">Tambah Mata Kuliah</button>
      </PageHeader>

      {/* Titik awal: tampilan paling sederhana dari data. Silakan dirombak. */}
      {memuat ? (
        <p className="teks-redup">Memuat...</p>
      ) : (
        <ul className="kartu">
          {daftarMataKuliah.map((mk) => (
            <li key={mk.id}>{mk.kode} · {mk.nama} · semester {mk.semester}</li>
          ))}
        </ul>
      )}

      <RencanaIsi>
        <li>Tabel mata kuliah: kode, nama, semester</li>
        <li>Form tambah/ubah/hapus</li>
      </RencanaIsi>
    </div>
  )
}

export default MataKuliahPage
