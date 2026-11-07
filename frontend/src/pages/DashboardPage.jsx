import PageHeader from '@/components/PageHeader'
import RencanaIsi from '@/components/RencanaIsi'
import { useMuatData } from '@/hooks/useMuatData'
import { ambilDaftarTugas } from '@/api/tugas'
import { ambilJadwal } from '@/api/jadwal'
import { ambilDaftarChecklist } from '@/api/checklist'
import { jelajahCatatan } from '@/api/catatan'
import { formatTanggalJam } from '@/utils/format'

// getDay(): 0 = Minggu, 1 = Senin, ... Di data kita Minggu = 7.
const hariIni = new Date().getDay() || 7

// Beranda tidak punya data sendiri: isinya ringkasan dari fitur-fitur lain
function DashboardPage() {
  const { data, memuat } = useMuatData(
    () => Promise.all([ambilDaftarTugas(), ambilJadwal(), ambilDaftarChecklist(), jelajahCatatan()]),
    [],
  )
  const [daftarTugas = [], daftarJadwal = [], daftarChecklist = [], daftarCatatan = []] = data ?? []

  // Nilai turunan cukup dihitung biasa setiap render, tidak perlu disimpan di state
  const tugasTerdekat = daftarTugas
    .filter((t) => t.status !== 'selesai')
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
    .slice(0, 3)
  const jadwalHariIni = daftarJadwal.filter((j) => j.hari === hariIni)
  const catatanTerbaru = daftarCatatan.slice(0, 3)

  return (
    <div>
      <PageHeader judul="Beranda" deskripsi="Ringkasan hari ini: deadline terdekat, jadwal, dan progres belajar." />

      {/* Titik awal: tampilan paling sederhana dari data. Silakan dirombak. */}
      {memuat ? (
        <p className="teks-redup">Memuat...</p>
      ) : (
        <>
          <section className="kartu">
            <strong>Deadline terdekat</strong>
            <ul>
              {tugasTerdekat.map((tugas) => (
                <li key={tugas.id}>{tugas.judul} · {formatTanggalJam(tugas.deadline)}</li>
              ))}
            </ul>
          </section>
          <section className="kartu">
            <strong>Jadwal hari ini</strong>
            {jadwalHariIni.length === 0 ? (
              <p className="teks-redup">Tidak ada kuliah.</p>
            ) : (
              <ul>
                {jadwalHariIni.map((jadwal) => (
                  <li key={jadwal.id}>{jadwal.jam_mulai} · {jadwal.mata_kuliah?.nama}</li>
                ))}
              </ul>
            )}
          </section>
          <section className="kartu">
            <strong>Checklist</strong>
            <ul>
              {daftarChecklist.map((checklist) => (
                <li key={checklist.id}>
                  {checklist.judul} ({checklist.items.filter((i) => i.selesai).length}/{checklist.items.length})
                </li>
              ))}
            </ul>
          </section>
          <section className="kartu">
            <strong>Catatan terbaru</strong>
            <ul>
              {catatanTerbaru.map((catatan) => (
                <li key={catatan.id}>{catatan.judul} · {catatan.penulis.name}</li>
              ))}
            </ul>
          </section>
        </>
      )}

      <RencanaIsi>
        <li>Kartu deadline terdekat (3–5 tugas, urut dari yang paling dekat)</li>
        <li>Jadwal kuliah hari ini</li>
        <li>Progres checklist belajar</li>
        <li>Catatan terbaru dari mahasiswa lain</li>
      </RencanaIsi>
    </div>
  )
}

export default DashboardPage
