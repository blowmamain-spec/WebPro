import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="auth">
      <div className="kartu auth-form">
        <h1>Halaman tidak ditemukan</h1>
        <p className="teks-redup">Alamat yang kamu buka tidak ada.</p>
        <Link to="/" className="tombol text-center">Kembali ke Beranda</Link>
      </div>
    </div>
  )
}

export default NotFoundPage
