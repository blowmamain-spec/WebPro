import PageHeader from '@/components/PageHeader'
import RencanaIsi from '@/components/RencanaIsi'
import { useMuatData } from '@/hooks/useMuatData'
import { ambilProfil } from '@/api/auth'
// Fungsi lain yang tersedia di @/api/auth: ubahProfil()

function ProfilPage() {
  const { data: profil, memuat, error } = useMuatData(() => ambilProfil(), [])

  return (
    <div>
      <PageHeader judul="Profil" deskripsi="Data akun kamu." />

      {/* Titik awal: tampilan paling sederhana dari data. Silakan dirombak. */}
      {memuat ? (
        <p className="teks-redup">Memuat...</p>
      ) : error ? (
        <p className="pesan-error">{error.message}</p>
      ) : (
        <section className="kartu">
          {profil.name} · {profil.nim} · {profil.email} · semester {profil.semester}
        </section>
      )}

      <RencanaIsi>
        <li>Ubah nama, NIM, semester</li>
        <li>Ganti password</li>
      </RencanaIsi>
    </div>
  )
}

export default ProfilPage
