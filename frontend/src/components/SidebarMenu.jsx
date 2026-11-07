import { NavLink } from 'react-router-dom'

// `menu` dikirim dari layout, isinya daftar grup menu beserta link-nya.
// `children` = apa pun yang ditulis di antara <SidebarMenu>...</SidebarMenu> (tampil di bagian bawah).
function SidebarMenu({ judul, menu, children }) {
  return (
    <aside className="sidebar">
      <p className="sidebar-judul">{judul}</p>

      <nav>
        {menu.map((grup) => (
          <div key={grup.label} className="sidebar-grup">
            <p className="sidebar-label">{grup.label}</p>
            {grup.items.map((item) => (
              // NavLink = <a> versi React Router: pindah halaman tanpa reload,
              // dan tahu apakah link ini sedang aktif (isActive).
              // `end` artinya hanya aktif kalau alamatnya sama persis (dipakai untuk "/" dan "/admin").
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => (isActive ? 'sidebar-link aktif' : 'sidebar-link')}
              >
                {item.teks}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-bawah">{children}</div>
    </aside>
  )
}

export default SidebarMenu
