import PageHeader from '@/components/PageHeader'
import RencanaIsi from '@/components/RencanaIsi'
import { useMuatData } from '@/hooks/useMuatData'
import { ambilKataTerlarang } from '@/api/admin'
// Fungsi lain yang tersedia di @/api/admin: tambahKataTerlarang(), hapusKataTerlarang()

function KataTerlarangPage() {
  const { data: daftarKata, memuat } = useMuatData(() => ambilKataTerlarang(), [])

  return (
    <div>
      <PageHeader judul="Kata Terlarang" deskripsi="Daftar kata untuk moderasi otomatis.">
        <button className="tombol" type="button">Tambah Kata</button>
      </PageHeader>

      {/* Titik awal: tampilan paling sederhana dari data. Silakan dirombak. */}
      {memuat ? (
        <p className="teks-redup">Memuat...</p>
      ) : (
        <ul className="kartu">
          {daftarKata.map((kata) => (
            <li key={kata.id}>{kata.kata}</li>
          ))}
        </ul>
      )}

      <RencanaIsi>
        <li>Daftar kata terlarang</li>
        <li>Form tambah dan tombol hapus</li>
      </RencanaIsi>
    </div>
  )
}

export default KataTerlarangPage
