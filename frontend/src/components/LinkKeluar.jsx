import { Link } from 'react-router-dom'
import { keluar } from '@/api/auth'

function LinkKeluar() {
  function hapusSesi() {
    // keluar() membaca token dulu, baru tokennya dihapus dari browser.
    // Kalau backend gagal dihubungi, pengguna tetap keluar dari browser ini.
    keluar().catch(() => {})
    localStorage.removeItem('token')
  }

  return (
    <Link to="/login" className="sidebar-link" onClick={hapusSesi}>
      Keluar
    </Link>
  )
}

export default LinkKeluar
