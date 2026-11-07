import { useParams } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import RencanaIsi from '@/components/RencanaIsi'
import { useMuatData } from '@/hooks/useMuatData'
import { ambilKelompok, ambilTugasKelompok } from '@/api/kelompok'
import { formatTanggalJam } from '@/utils/format'
// Fungsi lain: tambahTugasKelompok() dari @/api/kelompok,
// ubahTugas() / hapusTugas() dari @/api/tugas untuk mengubah tugas kelompok

function KelompokDetailPage() {
  // :id di alamat /kelompok/:id dibaca lewat useParams()
  const { id } = useParams()

  // Dua permintaan sekaligus. [id] artinya muat ulang kalau id di alamat berubah.
  const { data, memuat, error } = useMuatData(
    () => Promise.all([ambilKelompok(id), ambilTugasKelompok(id)]),
    [id],
  )
  const [kelompok, daftarTugas] = data ?? []

  return (
    <div>
      <PageHeader judul={kelompok?.nama ?? 'Detail Kelompok'} deskripsi="Anggota dan tugas kelompok ini.">
        <button className="tombol" type="button">Tambah Tugas Kelompok</button>
      </PageHeader>

      {/* Titik awal: tampilan paling sederhana dari data. Silakan dirombak. */}
      {memuat ? (
        <p className="teks-redup">Memuat...</p>
      ) : error ? (
        <p className="pesan-error">{error.message}</p>
      ) : (
        <>
          <section className="kartu">
            <strong>Anggota:</strong> {kelompok.anggota.map((a) => a.name).join(', ')}
          </section>
          <ul className="kartu">
            {daftarTugas.map((tugas) => (
              <li key={tugas.id}>
                {tugas.judul} · {formatTanggalJam(tugas.deadline)} · {tugas.status} ·{' '}
                {tugas.ditugaskan_ke?.name ?? 'belum dibagi'}
              </li>
            ))}
          </ul>
        </>
      )}

      <RencanaIsi>
        <li>Daftar anggota kelompok, tombol undang anggota</li>
        <li>Daftar tugas kelompok beserta deadline dan status</li>
        <li>Pembagian tugas ke anggota (kolom ditugaskan_ke)</li>
      </RencanaIsi>
    </div>
  )
}

export default KelompokDetailPage
