import { useParams } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import RencanaIsi from '@/components/RencanaIsi'
import { useMuatData } from '@/hooks/useMuatData'
import { ambilCatatan } from '@/api/catatan'
import { ambilDaftarMataKuliah } from '@/api/mataKuliah'
// Untuk tombol simpan: tambahCatatan() (mode tulis) atau ubahCatatan() (mode ubah) dari @/api/catatan.
// Kirim status 'pribadi' atau 'publik'; hasilnya bisa 'menunggu' kalau kena kata terlarang.

// Satu halaman dipakai untuk dua alamat: /catatan/baru dan /catatan/:id/edit
function CatatanEditorPage() {
  const { id } = useParams()
  const modeEdit = id !== undefined

  const { data, memuat, error } = useMuatData(
    () => Promise.all([ambilDaftarMataKuliah(), modeEdit ? ambilCatatan(id) : null]),
    [id],
  )
  const [daftarMataKuliah, catatan] = data ?? []

  // Isi awal form. Nanti simpan di useState dan sambungkan ke <input value onChange>.
  const isiAwalForm = catatan
    ? { judul: catatan.judul, isi: catatan.isi, mata_kuliah_id: catatan.mata_kuliah_id, status: catatan.status }
    : { judul: '', isi: '', mata_kuliah_id: null, status: 'pribadi' }

  return (
    <div>
      <PageHeader
        judul={modeEdit ? 'Ubah Catatan' : 'Tulis Catatan'}
        deskripsi="Simpan sebagai catatan pribadi atau bagikan ke mahasiswa lain."
      />

      {/* Titik awal: isi awal form. Ganti dengan form yang sebenarnya. */}
      {memuat ? (
        <p className="teks-redup">Memuat...</p>
      ) : error ? (
        <p className="pesan-error">{error.message}</p>
      ) : (
        <pre className="kartu">{JSON.stringify(isiAwalForm, null, 2)}</pre>
      )}

      <RencanaIsi>
        <li>Input judul dan pilihan mata kuliah ({daftarMataKuliah?.length ?? 0} mata kuliah sudah dimuat)</li>
        <li>Area isi catatan (Markdown)</li>
        <li>Pilihan: simpan pribadi atau bagikan</li>
        <li>Setelah disimpan, kembali ke Catatan Saya</li>
      </RencanaIsi>
    </div>
  )
}

export default CatatanEditorPage
