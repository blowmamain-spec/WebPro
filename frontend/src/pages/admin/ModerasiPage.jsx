import PageHeader from '@/components/PageHeader'
import RencanaIsi from '@/components/RencanaIsi'
import { useMuatData } from '@/hooks/useMuatData'
import { ambilAntreanModerasi, ambilDaftarLaporan } from '@/api/admin'
import { formatTanggal } from '@/utils/format'
// Fungsi lain yang tersedia di @/api/admin:
// setujuiCatatan(), tolakCatatan(), tindakLanjutiLaporan(id, 'ditindaklanjuti' | 'diabaikan')

function ModerasiPage() {
  const { data, memuat } = useMuatData(() => Promise.all([ambilAntreanModerasi(), ambilDaftarLaporan()]), [])
  const [antrean, daftarLaporan] = data ?? []

  return (
    <div>
      <PageHeader judul="Moderasi Catatan" deskripsi="Catatan yang ditandai otomatis atau dilaporkan pengguna." />

      {/* Titik awal: tampilan paling sederhana dari data. Silakan dirombak. */}
      {memuat ? (
        <p className="teks-redup">Memuat...</p>
      ) : (
        <>
          <section className="kartu">
            <strong>Kena filter kata terlarang</strong>
            <ul>
              {antrean.map((catatan) => (
                <li key={catatan.id}>{catatan.judul} · {catatan.penulis.name}</li>
              ))}
            </ul>
          </section>
          <section className="kartu">
            <strong>Laporan pengguna</strong>
            <ul>
              {daftarLaporan.map((laporan) => (
                <li key={laporan.id}>
                  &quot;{laporan.catatan?.judul}&quot; dilaporkan {laporan.pelapor.name}: {laporan.alasan} · {laporan.status} ·{' '}
                  {formatTanggal(laporan.created_at)}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      <RencanaIsi>
        <li>Antrean catatan yang kena filter kata terlarang</li>
        <li>Daftar laporan dari pengguna beserta alasannya</li>
        <li>Aksi: setujui, tolak/turunkan catatan, abaikan laporan</li>
      </RencanaIsi>
    </div>
  )
}

export default ModerasiPage
