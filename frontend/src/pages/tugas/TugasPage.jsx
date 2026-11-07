import PageHeader from '@/components/PageHeader'
import RencanaIsi from '@/components/RencanaIsi'
import { useMuatData } from '@/hooks/useMuatData'
import { ambilDaftarTugas } from '@/api/tugas'
import { formatTanggalJam } from '@/utils/format'
// Fungsi lain yang tersedia di @/api/tugas: tambahTugas(), ubahTugas(), hapusTugas()
// Daftar mata kuliah untuk pilihan di form: ambilDaftarMataKuliah() dari @/api/mataKuliah

function TugasPage() {
  const { data: daftarTugas, memuat } = useMuatData(() => ambilDaftarTugas(), [])

  return (
    <div>
      <PageHeader judul="Deadline Tugas" deskripsi="Daftar tugas pribadi beserta prioritas dan tenggatnya.">
        <button className="tombol" type="button">Tambah Tugas</button>
      </PageHeader>

      {/* Titik awal: tampilan paling sederhana dari data. Silakan dirombak. */}
      {memuat ? (
        <p className="teks-redup">Memuat...</p>
      ) : (
        <ul className="kartu">
          {daftarTugas.map((tugas) => (
            <li key={tugas.id}>
              {tugas.judul} ({tugas.mata_kuliah?.nama}) · {formatTanggalJam(tugas.deadline)} · {tugas.prioritas} · {tugas.status}
            </li>
          ))}
        </ul>
      )}

      <RencanaIsi>
        <li>Daftar tugas: judul, mata kuliah, deadline, prioritas (rendah/sedang/tinggi), status</li>
        <li>Filter berdasarkan status dan prioritas, urutkan berdasarkan deadline</li>
        <li>Form tambah/ubah tugas (bisa berupa modal)</li>
        <li>Tandai tugas selesai</li>
      </RencanaIsi>
    </div>
  )
}

export default TugasPage
