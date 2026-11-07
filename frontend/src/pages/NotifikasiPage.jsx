import { Link } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import RencanaIsi from '@/components/RencanaIsi'
import { useMuatData } from '@/hooks/useMuatData'
import { ambilNotifikasi } from '@/api/notifikasi'
import { formatTanggalJam } from '@/utils/format'
// Fungsi lain yang tersedia di @/api/notifikasi: tandaiDibaca(), tandaiSemuaDibaca()

function NotifikasiPage() {
  const { data: daftarNotifikasi, memuat } = useMuatData(() => ambilNotifikasi(), [])

  return (
    <div>
      <PageHeader judul="Notifikasi" deskripsi="Pengingat deadline dan kabar terbaru tentang catatanmu.">
        <button className="tombol tombol-garis" type="button">Tandai semua dibaca</button>
      </PageHeader>

      {/* Titik awal: tampilan paling sederhana dari data. Silakan dirombak. */}
      {memuat ? (
        <p className="teks-redup">Memuat...</p>
      ) : (
        <ul className="kartu">
          {daftarNotifikasi.map((notif) => (
            <li key={notif.id}>
              <Link to={notif.tautan}>{notif.pesan}</Link> · {notif.jenis} · {formatTanggalJam(notif.created_at)} ·{' '}
              {notif.dibaca_pada ? 'sudah dibaca' : 'baru'}
            </li>
          ))}
        </ul>
      )}

      <RencanaIsi>
        <li>Daftar notifikasi: deadline H-1, catatan disetujui/ditolak, undangan kelompok</li>
        <li>Tandai sudah dibaca / tandai semua sudah dibaca</li>
      </RencanaIsi>
    </div>
  )
}

export default NotifikasiPage
