import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';
import { useMuatData } from '@/hooks/useMuatData';
import { ambilCatatanSaya } from '@/api/catatan';
import { formatTanggal } from '@/utils/format';
import { Plus, BookText } from 'lucide-react'; // Lupa mengimpor ini biasanya bikin eror!

function CatatanSayaPage() {
  const { data: daftarCatatan, memuat } = useMuatData(() => ambilCatatanSaya(), []);

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* LANGKAH 1: Page Header dengan Tombol Baru */}
      <PageHeader judul="Catatan Saya" deskripsi="Semua catatan pribadi dan catatan yang kamu bagikan.">
        <Link 
          to="/catatan/baru" 
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Tulis Catatan
        </Link>
      </PageHeader>

      {/* LANGKAH 2: Logika Memuat & Kosong */}
      {memuat ? (
        <div className="flex h-40 items-center justify-center rounded-xl border border-slate-200 bg-white">
          <p className="text-sm font-medium text-slate-500">Memuat catatan...</p>
        </div>
      ) : (daftarCatatan ?? []).length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-16 text-center">
          <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
            <BookText className="h-6 w-6" aria-hidden="true" />
          </span>
          <h3 className="text-base font-semibold text-slate-900">Belum ada catatan</h3>
          <p className="mt-1 text-sm text-slate-500">Mulai tulis ringkasan atau materi kuliah pertamamu.</p>
        </div>
      ) : (
        /* LANGKAH 3: Pembungkus Grid */
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          
          {/* LANGKAH 4: Mapping Kartu Catatan */}
          {daftarCatatan.map((catatan) => (
            <article 
              key={catatan.id} 
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-slate-300 hover:shadow-md"
            >
              <div>
                <div className="mb-3 flex items-start justify-between gap-4">
                  <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                    {catatan.mata_kuliah?.nama || 'Umum'}
                  </span>
                  
                  {/* Logika Warna Status */}
                  <span className={`px-2 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-md border ${
                    catatan.status === 'Publik' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    catatan.status === 'Menunggu Moderasi' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-slate-50 text-slate-600 border-slate-200'
                  }`}>
                    {catatan.status || 'Pribadi'}
                  </span>
                </div>

                <Link to={`/catatan/${catatan.id}/edit`} className="group block">
                  <h3 className="text-lg font-semibold text-slate-900 transition-colors group-hover:text-indigo-600 line-clamp-2">
                    {catatan.judul}
                  </h3>
                </Link>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-500">
                Terakhir diubah: {formatTanggal(catatan.updated_at)}
              </div>
            </article>
          ))}
          
        </div>
      )}
    </div>
  );
}

export default CatatanSayaPage;