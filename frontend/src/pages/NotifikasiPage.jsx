import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';
import { useMuatData } from '@/hooks/useMuatData';
import { ambilNotifikasi, tandaiDibaca, tandaiSemuaDibaca } from '@/api/notifikasi';
import { formatTanggalJam } from '@/utils/format';
import { 
  Bell, 
  CheckCheck, 
  Clock, 
  Users, 
  FileText, 
  AlertCircle
} from 'lucide-react';

// Fungsi Helper untuk memetakan Ikon & Warna berdasarkan Jenis Notifikasi
const getNotifStyle = (jenis) => {
  const tipe = (jenis || '').toLowerCase();
  
  if (tipe.includes('deadline') || tipe.includes('tugas')) {
    return { icon: Clock, bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100' };
  }
  if (tipe.includes('kelompok') || tipe.includes('undangan')) {
    return { icon: Users, bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100' };
  }
  if (tipe.includes('catatan') || tipe.includes('moderasi') || tipe.includes('disetujui') || tipe.includes('ditolak')) {
    return { icon: FileText, bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' };
  }
  // Default Style
  return { icon: AlertCircle, bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' };
};

function NotifikasiPage() {
  // Ditambahkan 'setData' untuk memanipulasi data secara instan (Optimistic UI)
  const { data: daftarNotifikasi, memuat, setData } = useMuatData(() => ambilNotifikasi(), []);
  
  const [filterAktif, setFilterAktif] = useState('semua'); // 'semua' | 'belum_dibaca'
  const navigate = useNavigate();

  // Memisahkan data berdasarkan tab filter
  const notifikasiTampil = (daftarNotifikasi || []).filter(notif => {
    if (filterAktif === 'belum_dibaca') return !notif.dibaca_pada;
    return true;
  });

  const jumlahBelumDibaca = (daftarNotifikasi || []).filter(n => !n.dibaca_pada).length;

  // --- LOGIKA CRUD & INTERAKSI ---

  const handleKlikNotifikasi = async (notif) => {
    // 1. Jika belum dibaca, tembak API untuk update status
    if (!notif.dibaca_pada) {
      try {
        await tandaiDibaca(notif.id);
        // Update state lokal seketika agar UI terasa cepat tanpa harus memuat ulang API
        setData(sebelumnya => 
          sebelumnya.map(n => n.id === notif.id ? { ...n, dibaca_pada: new Date().toISOString() } : n)
        );
      } catch (error) {
        console.error("Gagal menandai dibaca:", error);
      }
    }
    
    // 2. Pindah ke halaman tujuan jika ada tautan
    if (notif.tautan) {
      navigate(notif.tautan);
    }
  };

  const handleTandaiSemua = async () => {
    if (jumlahBelumDibaca === 0) return;
    
    try {
      await tandaiSemuaDibaca();
      // Update semua data lokal seketika menjadi terbaca
      setData(sebelumnya => 
        sebelumnya.map(n => ({ ...n, dibaca_pada: n.dibaca_pada || new Date().toISOString() }))
      );
    } catch (error) {
      console.error("Gagal menandai semua dibaca:", error);
      alert("Gagal memperbarui notifikasi.");
    }
  };

  // --- RENDER UI ---

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 sm:p-6 lg:p-8">
      
      <PageHeader 
        judul="Notifikasi" 
        deskripsi="Pengingat deadline dan kabar terbaru tentang aktivitas belajarmu."
      >
        <button 
          onClick={handleTandaiSemua}
          disabled={jumlahBelumDibaca === 0}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
            jumlahBelumDibaca > 0 
              ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2' 
              : 'bg-transparent border border-transparent text-slate-400 cursor-not-allowed'
          }`}
          type="button"
        >
          <CheckCheck className="h-4 w-4" aria-hidden="true" />
          Tandai semua dibaca
        </button>
      </PageHeader>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
        <button
          onClick={() => setFilterAktif('semua')}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
            filterAktif === 'semua'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Semua
        </button>
        <button
          onClick={() => setFilterAktif('belum_dibaca')}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-all flex items-center gap-2 ${
            filterAktif === 'belum_dibaca'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Belum Dibaca
          {jumlahBelumDibaca > 0 && (
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
              filterAktif === 'belum_dibaca' ? 'bg-white text-indigo-600' : 'bg-indigo-100 text-indigo-600'
            }`}>
              {jumlahBelumDibaca}
            </span>
          )}
        </button>
      </div>

      {/* KONTEN LIST VERTIKAL */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {memuat ? (
          <div className="p-8 text-center text-sm text-slate-500">Memuat notifikasi...</div>
        ) : notifikasiTampil.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-slate-400">
              <Bell className="h-7 w-7" aria-hidden="true" />
            </span>
            <h3 className="text-base font-semibold text-slate-900">Masa tenang</h3>
            <p className="mt-1 text-sm text-slate-500">
              {filterAktif === 'belum_dibaca' 
                ? "Tidak ada notifikasi baru yang perlu diperhatikan." 
                : "Belum ada notifikasi apapun sejauh ini."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifikasiTampil.map((notif) => {
              const style = getNotifStyle(notif.jenis);
              const IconComp = style.icon;
              const isUnread = !notif.dibaca_pada;

              return (
                <div 
                  key={notif.id}
                  onClick={() => handleKlikNotifikasi(notif)}
                  className={`group relative flex cursor-pointer items-start gap-4 p-5 transition-all hover:bg-slate-50 ${
                    isUnread ? 'bg-indigo-50/20' : 'bg-white'
                  }`}
                >
                  {/* Indikator Titik Biru (Unread) */}
                  {isUnread && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full" />
                  )}

                  {/* Ikon Kategori */}
                  <span className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${style.bg} ${style.text} ${style.border}`}>
                    <IconComp className="h-5 w-5" aria-hidden="true" />
                  </span>

                  {/* Konten Teks */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4">
                      <p className={`text-sm font-medium line-clamp-1 ${isUnread ? 'text-slate-900' : 'text-slate-700'}`}>
                        {notif.pesan}
                      </p>
                      <span className="shrink-0 text-xs text-slate-500 whitespace-nowrap">
                        {formatTanggalJam(notif.created_at)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-400">
                      {notif.jenis}
                    </p>
                  </div>

                  {/* Indikator Aksi Interaktif (Hanya muncul saat di-hover jika belum dibaca) */}
                  {isUnread && (
                    <span className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100 hidden sm:flex items-center text-xs font-medium text-indigo-600">
                      Tandai dibaca
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default NotifikasiPage;