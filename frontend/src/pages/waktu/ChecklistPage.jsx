import PageHeader from '@/components/PageHeader'
import RencanaIsi from '@/components/RencanaIsi'
import { useMuatData } from '@/hooks/useMuatData'
import { ambilDaftarChecklist } from '@/api/checklist'
// Fungsi lain yang tersedia di @/api/checklist:
// buatChecklist(), hapusChecklist(), tambahItem(), ubahItem() (misal { selesai: true }), hapusItem()

function ChecklistPage() {
  const { data: daftarChecklist, memuat } = useMuatData(() => ambilDaftarChecklist(), [])

  return (
    <div>
      <PageHeader judul="Checklist Belajar" deskripsi="Target belajar mandiri yang bisa dicentang.">
        <button className="tombol" type="button">Buat Checklist</button>
      </PageHeader>

      {/* Titik awal: tampilan paling sederhana dari data. Silakan dirombak. */}
      {memuat ? (
        <p className="teks-redup">Memuat...</p>
      ) : (
        daftarChecklist.map((checklist) => (
          <section key={checklist.id} className="kartu">
            <strong>{checklist.judul}</strong> ({checklist.items.filter((i) => i.selesai).length}/
            {checklist.items.length} selesai)
            <ul>
              {checklist.items.map((item) => (
                <li key={item.id}>
                  {item.selesai ? '☑' : '☐'} {item.isi}
                </li>
              ))}
            </ul>
          </section>
        ))
      )}

      <RencanaIsi>
        <li>Daftar checklist (misal &quot;Persiapan UTS Basis Data&quot;) dengan progres x/y</li>
        <li>Item di dalam checklist bisa dicentang, ditambah, dihapus</li>
      </RencanaIsi>
    </div>
  )
}

export default ChecklistPage
