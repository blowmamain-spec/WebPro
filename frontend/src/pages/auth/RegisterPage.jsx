import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { daftar } from '@/api/auth'

function RegisterPage() {
  const navigate = useNavigate()

  // Satu objek untuk seluruh isi form, nama kolomnya sama dengan docs/kontrak-data.md
  const [form, setForm] = useState({ name: '', nim: '', email: '', password: '', semester: 1 })
  const [pesanError, setPesanError] = useState('')
  const [mengirim, setMengirim] = useState(false)

  // Satu fungsi untuk semua input: kolom yang diubah ditentukan dari atribut name di <input>
  function ubahIsian(event) {
    const { name, value, type } = event.target
    setForm({ ...form, [name]: type === 'number' ? Number(value) : value })
  }

  async function kirim(event) {
    event.preventDefault()
    setPesanError('')
    setMengirim(true)
    try {
      const hasil = await daftar(form)
      localStorage.setItem('token', hasil.token)
      navigate('/')
    } catch (error) {
      setPesanError(error.message)
      setMengirim(false)
    }
  }

  return (
    <div className="auth">
      <form className="kartu auth-form" onSubmit={kirim}>
        <h1>Daftar</h1>

        <label htmlFor="name">Nama lengkap</label>
        <input id="name" name="name" type="text" value={form.name} onChange={ubahIsian} required />

        <label htmlFor="nim">NIM</label>
        <input id="nim" name="nim" type="text" value={form.nim} onChange={ubahIsian} required />

        <label htmlFor="semester">Semester</label>
        <input id="semester" name="semester" type="number" min="1" max="14" value={form.semester} onChange={ubahIsian} required />

        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" value={form.email} onChange={ubahIsian} required />

        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" minLength={8} value={form.password} onChange={ubahIsian} required />

        {pesanError && <p className="pesan-error">{pesanError}</p>}

        <button className="tombol" type="submit" disabled={mengirim}>
          {mengirim ? 'Memproses...' : 'Daftar'}
        </button>

        <p className="teks-redup">
          Sudah punya akun? <Link to="/login">Masuk</Link>
        </p>
      </form>
    </div>
  )
}

export default RegisterPage
