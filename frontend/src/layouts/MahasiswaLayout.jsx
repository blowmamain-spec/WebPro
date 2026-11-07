import { Link, Outlet } from 'react-router-dom'
import SidebarMenu from '@/components/SidebarMenu'

const menu = [
  {
    label: 'Utama',
    items: [
      { to: '/', teks: 'Beranda', end: true },
      { to: '/kalender', teks: 'Kalender' },
      { to: '/notifikasi', teks: 'Notifikasi' },
    ],
  },
  {
    label: 'Tugas',
    items: [
      { to: '/tugas', teks: 'Deadline Tugas' },
      { to: '/kelompok', teks: 'Tugas Kelompok' },
    ],
  },
  {
    label: 'Catatan',
    items: [
      { to: '/catatan', teks: 'Catatan Saya' },
      { to: '/jelajah', teks: 'Jelajah Catatan' },
      { to: '/tersimpan', teks: 'Tersimpan' },
    ],
  },
  {
    label: 'Belajar',
    items: [
      { to: '/jadwal', teks: 'Jadwal Mingguan' },
      { to: '/checklist', teks: 'Checklist Belajar' },
    ],
  },
]

function MahasiswaLayout() {
  return (
    <div className="layout">
      <SidebarMenu judul="Tracking Belajar" menu={menu}>
        <Link to="/profil" className="sidebar-link">Profil</Link>
        <Link to="/login" className="sidebar-link">Keluar</Link>
      </SidebarMenu>

      <main className="konten">
        {/* Halaman yang cocok dengan alamat sekarang tampil di sini */}
        <Outlet />
      </main>
    </div>
  )
}

export default MahasiswaLayout
