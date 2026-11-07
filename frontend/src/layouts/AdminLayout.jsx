import { Link, Outlet } from 'react-router-dom'
import SidebarMenu from '@/components/SidebarMenu'

const menu = [
  {
    label: 'Admin',
    items: [
      { to: '/admin', teks: 'Ringkasan', end: true },
      { to: '/admin/moderasi', teks: 'Moderasi Catatan' },
      { to: '/admin/mata-kuliah', teks: 'Mata Kuliah' },
      { to: '/admin/kata-terlarang', teks: 'Kata Terlarang' },
    ],
  },
]

function AdminLayout() {
  return (
    <div className="layout layout-admin">
      <SidebarMenu judul="Panel Admin" menu={menu}>
        <Link to="/login" className="sidebar-link">Keluar</Link>
      </SidebarMenu>

      <main className="konten">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
