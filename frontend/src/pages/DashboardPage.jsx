import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';
import { useMuatData } from '@/hooks/useMuatData';
import { ambilDaftarTugas } from '@/api/tugas';
import { ambilNotifikasi } from '@/api/notifikasi';
import { ambilJadwal } from '@/api/jadwal';
import { ambilDaftarChecklist } from '@/api/checklist';
import { jelajahCatatan } from '@/api/catatan';
import { formatTanggal } from '@/utils/format';
import {
  Clock,
  Calendar,
  CalendarCheck,
  Bell,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

const getUrgencyBadge = (tugas) => {
  const priority = (tugas?.prioritas || '').toLowerCase();

  if (priority.includes('tinggi') || priority.includes('high') || priority.includes('urgent')) {
    return {
      label: 'Tinggi',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
      dotClass: 'bg-rose-500',
    };
  }
  if (priority.includes('sedang') || priority.includes('medium')) {
    return {
      label: 'Sedang',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
      dotClass: 'bg-amber-500',
    };
  }
  if (priority.includes('rendah') || priority.includes('low')) {
    return {
      label: 'Rendah',
      badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
      dotClass: 'bg-slate-400',
    };
  }

  if (tugas?.deadline) {
    const selisihHari = (new Date(tugas.deadline) - new Date()) / (1000 * 60 * 60 * 24);
    if (selisihHari <= 1) {
      return {
        label: 'Tinggi',
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
        dotClass: 'bg-rose-500',
      };
    }
    if (selisihHari <= 3) {
      return {
        label: 'Sedang',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
        dotClass: 'bg-amber-500',
      };
    }
  }

  return {
    label: 'Rendah',
    badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
    dotClass: 'bg-slate-400',
  };
};

function DashboardPage() {
  const { data: daftarTugas, memuat: memuatTugas } = useMuatData(() => ambilDaftarTugas(), []);
  const { data: daftarNotifikasi, memuat: memuatNotifikasi } = useMuatData(() => ambilNotifikasi(), []);
  const { data: daftarJadwal, memuat: memuatJadwal } = useMuatData(() => ambilJadwal(), []);
  const { data: daftarChecklist, memuat: memuatChecklist } = useMuatData(
    () => ambilDaftarChecklist(),
    [],
  );
  const { data: daftarCatatan, memuat: memuatCatatan } = useMuatData(() => jelajahCatatan(), []);

  const tugasTerdekat = [...(daftarTugas ?? [])]
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 3);

  const notifikasiBaru = daftarNotifikasi?.filter((notif) => !notif.dibaca_pada).length ?? 0;
  const hariIni = new Date().getDay() || 7;
  const jadwalHariIni = (daftarJadwal ?? []).filter((jadwal) => jadwal.hari === hariIni);
  const catatanTerbaru = [...(daftarCatatan ?? [])]
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 4);

  return (
    <React.Fragment>
      <div className="min-h-full space-y-6 bg-slate-50 p-4 text-slate-800 sm:p-6 lg:p-8">
      <PageHeader
        judul="Beranda"
        deskripsi="Ringkasan aktivitas belajar dan tugasmu hari ini."
      >
        <Link
          to="/tugas"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Buat tugas
        </Link>
        <Link
          to="/notifikasi"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          <Bell className="h-4 w-4 text-slate-500" aria-hidden="true" />
          <span>
            {memuatNotifikasi ? 'Memuat notifikasi...' : `${notifikasiBaru} notifikasi baru`}
          </span>
        </Link>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        <div className="md:col-span-8 flex flex-col gap-6">
          <section className="rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md sm:p-6">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="font-semibold text-slate-900">Deadline terdekat</h2>
                  <p className="mt-0.5 text-sm text-slate-500">Tugas yang perlu kamu perhatikan.</p>
                </div>
              </div>
              <Link
                to="/tugas"
                className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                Semua tugas
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {memuatTugas ? (
                <p className="py-6 text-center text-sm text-slate-500">Memuat daftar tugas...</p>
              ) : tugasTerdekat.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-500">
                  Belum ada tugas yang dijadwalkan.
                </p>
              ) : (
                tugasTerdekat.map((tugas) => {
                  const badge = getUrgencyBadge(tugas);

                  return (
                    <article
                      key={tugas.id}
                      className="flex flex-col gap-3 rounded-lg border border-slate-200 p-4 transition-colors hover:border-slate-300 hover:bg-slate-50/60 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                          <Calendar className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold text-slate-900">
                            {tugas.judul}
                          </h3>
                          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                            <span>{tugas.mata_kuliah?.nama ?? 'Tanpa mata kuliah'}</span>
                            <span aria-hidden="true">·</span>
                            <span>{formatTanggal(tugas.deadline)}</span>
                          </p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${badge.badgeClass}`}
                      >
                        {badge.label === 'Tinggi' ? (
                          <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                        ) : (
                          <span className={`h-1.5 w-1.5 rounded-full ${badge.dotClass}`} />
                        )}
                        {badge.label}
                      </span>
                    </article>
                  );
                })
              )}
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md sm:p-6">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="font-semibold text-slate-900">Checklist belajar</h2>
                  <p className="mt-0.5 text-sm text-slate-500">Pantau progres target belajarmu.</p>
                </div>
              </div>
              <Link
                to="/checklist"
                className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                Lihat semua
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-4 space-y-4">
              {memuatChecklist ? (
                <p className="py-6 text-center text-sm text-slate-500">Memuat checklist...</p>
              ) : (daftarChecklist ?? []).length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-500">
                  Belum ada checklist belajar.
                </p>
              ) : (
                daftarChecklist.map((checklist) => {
                  const jumlahItem = checklist.items?.length ?? 0;
                  const jumlahSelesai = checklist.items?.filter((item) => item.selesai).length ?? 0;
                  const progres = jumlahItem > 0 ? Math.round((jumlahSelesai / jumlahItem) * 100) : 0;

                  return (
                    <article key={checklist.id} className="rounded-lg border border-slate-200 p-4">
                      <div className="mb-3 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-medium text-slate-900">
                            {checklist.judul}
                          </h3>
                          {checklist.mata_kuliah?.nama && (
                            <p className="mt-1 text-xs text-slate-500">
                              {checklist.mata_kuliah.nama}
                            </p>
                          )}
                        </div>
                        <span className="shrink-0 text-sm font-medium text-slate-600">
                          {jumlahSelesai}/{jumlahItem}
                        </span>
                      </div>
                      <div
                        className="h-2 overflow-hidden rounded-full bg-slate-100"
                        role="progressbar"
                        aria-label={`Progres ${checklist.judul}`}
                        aria-valuemin={0}
                        aria-valuemax={jumlahItem}
                        aria-valuenow={jumlahSelesai}
                      >
                        <div
                          className="h-full rounded-full bg-indigo-600 transition-[width]"
                          style={{ width: `${progres}%` }}
                        />
                      </div>
                      <p className="mt-2 text-xs text-slate-500">{progres}% selesai</p>
                    </article>
                  );
                })
              )}
            </div>
          </section>
        </div>

        <div className="md:col-span-4 flex flex-col gap-6">
          <section className="rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md sm:p-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Calendar className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-semibold text-slate-900">Jadwal hari ini</h2>
                <p className="mt-0.5 text-sm text-slate-500">Kelas yang ada di agendamu.</p>
              </div>
            </div>

            <div className="mt-4">
              {memuatJadwal ? (
                <p className="py-6 text-center text-sm text-slate-500">Memuat jadwal...</p>
              ) : jadwalHariIni.length === 0 ? (
                <div className="flex flex-col items-center rounded-lg bg-slate-50 px-5 py-8 text-center">
                  <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white text-indigo-500">
                    <CalendarCheck className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="text-sm font-medium text-slate-700">Tidak ada kuliah hari ini</p>
                  <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-500">
                    Nikmati waktu luangmu atau gunakan untuk menyelesaikan tugas.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {jadwalHariIni.map((jadwal) => (
                    <article
                      key={jadwal.id}
                      className="flex gap-3 rounded-lg border border-slate-200 p-3.5"
                    >
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-medium text-slate-900">
                          {jadwal.mata_kuliah?.nama ?? 'Mata kuliah'}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                          {jadwal.jam_mulai}–{jadwal.jam_selesai}
                          {jadwal.ruangan ? ` · ${jadwal.ruangan}` : ''}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md sm:p-6">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <BookOpen className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="font-semibold text-slate-900">Catatan terbaru</h2>
                  <p className="mt-0.5 text-sm text-slate-500">Dibagikan oleh mahasiswa.</p>
                </div>
              </div>
              <Link
                to="/jelajah"
                className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                aria-label="Jelajahi semua catatan"
              >
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-2 divide-y divide-slate-100">
              {memuatCatatan ? (
                <p className="py-6 text-center text-sm text-slate-500">Memuat catatan...</p>
              ) : catatanTerbaru.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-500">
                  Belum ada catatan terbaru.
                </p>
              ) : (
                catatanTerbaru.map((catatan) => (
                  <article key={catatan.id} className="py-3.5 first:pt-2 last:pb-1">
                    <h3 className="text-sm font-medium text-slate-800">{catatan.judul}</h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {catatan.penulis?.name ?? 'Penulis tidak diketahui'}
                    </p>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
      </div>
    </React.Fragment>
  );
}

export default DashboardPage;
