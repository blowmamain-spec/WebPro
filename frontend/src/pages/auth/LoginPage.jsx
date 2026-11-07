import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { masuk } from '@/api/auth'

function LoginPage() {
  const navigate = useNavigate()

  // useState = data yang kalau diubah lewat setter-nya, tampilannya ikut berubah.
  // Input dihubungkan lewat value + onChange (disebut "controlled input").
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pesanError, setPesanError] = useState('')
  const [mengirim, setMengirim] = useState(false)

  async function kirim(event) {
    event.preventDefault()
    setPesanError('')
    setMengirim(true)
    try {
      const hasil = await masuk(email, password)
      localStorage.setItem('token', hasil.token)
      navigate(hasil.user.role === 'admin' ? '/admin' : '/')
    } catch (error) {
      setPesanError(error.message)
      setMengirim(false)
    }
  }

  return (
    <div className="auth">
      <form className="kartu auth-form" onSubmit={kirim}>
        <h1>Masuk</h1>
        <p className="teks-redup">Tracking belajar &amp; berbagi catatan mahasiswa</p>

        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label htmlFor="password">Password</label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        {pesanError && <p className="pesan-error">{pesanError}</p>}

        <button className="tombol" type="submit" disabled={mengirim}>
          {mengirim ? 'Memproses...' : 'Masuk'}
        </button>

        <p className="teks-redup">
          Belum punya akun? <Link to="/register">Daftar</Link>
        </p>
        <p className="teks-redup">
          Akun contoh (tahap 1, password bebas): mahasiswa@contoh.ac.id atau admin@contoh.ac.id
        </p>
      </form>
    </div>
  )
}

export default LoginPage
