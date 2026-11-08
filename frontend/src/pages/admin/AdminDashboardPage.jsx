import { Link } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import { useMuatData } from '@/hooks/useMuatData'
import { ambilRingkasan } from '@/api/admin'

function AdminDashboardPage() {
  const { data: ringkasan, memuat, error } = useMuatData(() => ambilRingkasan(), [])

  const kartu = ringkasan
    ? [
        { label: 'Menunggu moderasi', nilai: ringkasan.menunggu_moderasi, tautan: '/admin/moderasi' },
        { label: 'Laporan baru', nilai: ringkasan.laporan_baru, tautan: '/admin/moderasi' },
        { label: 'Jumlah mahasiswa', nilai: ringkasan.jumlah_pengguna },
        { label: 'Catatan publik', nilai: ringkasan.catatan_publik },
      ]
    : []

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 sm:p-6 lg:p-8">
      <PageHeader judul="Ringkasan Admin" deskripsi="Kondisi konten di aplikasi." />

      {memuat ? (
        <p className="text-sm text-slate-500">Memuat...</p>
      ) : error ? (
        <p className="pesan-error">{error.message}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kartu.map(({ label, nilai, tautan }) => (
            <section key={label} className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{nilai}</p>
              {tautan && (
                <Link to={tautan} className="mt-3 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-700">
                  Buka moderasi
                </Link>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminDashboardPage
