import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MahasiswaLayout from '@/layouts/MahasiswaLayout'
import AdminLayout from '@/layouts/AdminLayout'

import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import DashboardPage from '@/pages/DashboardPage'
import NotifikasiPage from '@/pages/NotifikasiPage'
import ProfilPage from '@/pages/ProfilPage'
import NotFoundPage from '@/pages/NotFoundPage'

import TugasPage from '@/pages/tugas/TugasPage'
import KelompokPage from '@/pages/tugas/KelompokPage'
import KelompokDetailPage from '@/pages/tugas/KelompokDetailPage'

import CatatanSayaPage from '@/pages/catatan/CatatanSayaPage'
import CatatanEditorPage from '@/pages/catatan/CatatanEditorPage'
import JelajahPage from '@/pages/catatan/JelajahPage'
import CatatanDetailPage from '@/pages/catatan/CatatanDetailPage'
import TersimpanPage from '@/pages/catatan/TersimpanPage'

import JadwalPage from '@/pages/waktu/JadwalPage'
import KalenderPage from '@/pages/waktu/KalenderPage'
import ChecklistPage from '@/pages/waktu/ChecklistPage'

import AdminDashboardPage from '@/pages/admin/AdminDashboardPage'
import ModerasiPage from '@/pages/admin/ModerasiPage'
import MataKuliahPage from '@/pages/admin/MataKuliahPage'
import KataTerlarangPage from '@/pages/admin/KataTerlarangPage'

// Setiap <Route> = satu alamat URL -> satu halaman di src/pages.
// Route yang ada di dalam route layout tampil di dalam layout itu (di posisi <Outlet />).
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman tanpa sidebar */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Halaman mahasiswa */}
        <Route element={<MahasiswaLayout />}>
          <Route path="/" element={<DashboardPage />} />

          {/* Domain Tugas */}
          <Route path="/tugas" element={<TugasPage />} />
          <Route path="/kelompok" element={<KelompokPage />} />
          <Route path="/kelompok/:id" element={<KelompokDetailPage />} />

          {/* Domain Catatan */}
          <Route path="/catatan" element={<CatatanSayaPage />} />
          <Route path="/catatan/baru" element={<CatatanEditorPage />} />
          <Route path="/catatan/:id/edit" element={<CatatanEditorPage />} />
          <Route path="/jelajah" element={<JelajahPage />} />
          <Route path="/jelajah/:id" element={<CatatanDetailPage />} />
          <Route path="/tersimpan" element={<TersimpanPage />} />

          {/* Domain Waktu & Belajar */}
          <Route path="/jadwal" element={<JadwalPage />} />
          <Route path="/kalender" element={<KalenderPage />} />
          <Route path="/checklist" element={<ChecklistPage />} />

          {/* Umum */}
          <Route path="/notifikasi" element={<NotifikasiPage />} />
          <Route path="/profil" element={<ProfilPage />} />
        </Route>

        {/* Halaman admin */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/moderasi" element={<ModerasiPage />} />
          <Route path="/admin/mata-kuliah" element={<MataKuliahPage />} />
          <Route path="/admin/kata-terlarang" element={<KataTerlarangPage />} />
        </Route>

        {/* Alamat yang tidak dikenal */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
