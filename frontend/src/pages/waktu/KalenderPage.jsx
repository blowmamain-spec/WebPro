import PageHeader from '@/components/PageHeader'
import RencanaIsi from '@/components/RencanaIsi'
import { useMuatData } from '@/hooks/useMuatData'
import { ambilDaftarTugas } from '@/api/tugas'
import { ambilJadwal } from '@/api/jadwal'
import { formatTanggalJam, namaHari } from '@/utils/format'

// Kalender tidak punya data sendiri: isinya gabungan dari Deadline Tugas dan Jadwal Mingguan
function KalenderPage() {
  // Promise.all = jalankan beberapa permintaan sekaligus, tunggu sampai semuanya selesai
  const { data, memuat } = useMuatData(() => Promise.all([ambilDaftarTugas(), ambilJadwal()]), [])
  const [daftarTugas, daftarJadwal] = data ?? []

  return (
    <div>
      <PageHeader judul="Kalender" deskripsi="Deadline tugas dan jadwal dalam tampilan bulanan." />

      {/* Titik awal: tampilan paling sederhana dari data. Silakan dirombak. */}
      {memuat ? (
        <p className="teks-redup">Memuat...</p>
      ) : (
        <>
          <ul className="kartu">
            {daftarTugas.map((tugas) => (
              <li key={tugas.id}>Deadline: {tugas.judul} · {formatTanggalJam(tugas.deadline)}</li>
            ))}
          </ul>
          <ul className="kartu">
            {daftarJadwal.map((jadwal) => (
              <li key={jadwal.id}>Kuliah tiap {namaHari(jadwal.hari)}: {jadwal.mata_kuliah?.nama}</li>
            ))}
          </ul>
        </>
      )}

      <RencanaIsi>
        <li>Grid kalender per bulan, tombol bulan sebelumnya/berikutnya</li>
        <li>Tampilkan deadline dari Deadline Tugas dan jadwal dari Jadwal Mingguan</li>
        <li>Klik tanggal untuk melihat detail hari itu</li>
      </RencanaIsi>
    </div>
  )
}

export default KalenderPage
