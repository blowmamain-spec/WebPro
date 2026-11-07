import { useParams } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import RencanaIsi from '@/components/RencanaIsi'
import { useMuatData } from '@/hooks/useMuatData'
import { ambilCatatan } from '@/api/catatan'
import { formatTanggal } from '@/utils/format'
// Fungsi lain yang tersedia di @/api/catatan: simpanCatatan(), batalSimpanCatatan(), laporkanCatatan()

function CatatanDetailPage() {
  const { id } = useParams()
  const { data: catatan, memuat, error } = useMuatData(() => ambilCatatan(id), [id])

  return (
    <div>
      <PageHeader judul={catatan?.judul ?? 'Detail Catatan'} deskripsi="Catatan yang dibagikan mahasiswa lain.">
        <button className="tombol tombol-garis" type="button">Laporkan</button>
        <button className="tombol" type="button">{catatan?.tersimpan ? 'Tersimpan' : 'Simpan'}</button>
      </PageHeader>

      {/* Titik awal: tampilan paling sederhana dari data. Silakan dirombak. */}
      {memuat ? (
        <p className="teks-redup">Memuat...</p>
      ) : error ? (
        <p className="pesan-error">{error.message}</p>
      ) : (
        <section className="kartu">
          <p className="teks-redup">
            {catatan.penulis.name} · {catatan.mata_kuliah?.nama} · {formatTanggal(catatan.created_at)}
          </p>
          {/* Isi catatan ditampilkan sebagai teks biasa, jadi aman walaupun isinya HTML/script dari pengguna lain */}
          <pre className="mt-2 whitespace-pre-wrap">{catatan.isi}</pre>
        </section>
      )}

      <RencanaIsi>
        <li>Judul, penulis, mata kuliah, tanggal</li>
        <li>Isi catatan (Markdown ditampilkan rapi)</li>
        <li>Tombol simpan (bookmark) dan laporkan (dengan alasan)</li>
      </RencanaIsi>
    </div>
  )
}

export default CatatanDetailPage
