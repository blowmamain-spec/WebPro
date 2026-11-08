import { db, balas, gagal, idBaru, cari } from './data-palsu'
import { request, pakaiBackend } from './client'

// Tanpa backend: password apa pun diterima, yang dicek cuma email-nya.
// Akun contoh: mahasiswa@contoh.ac.id (mahasiswa), admin@contoh.ac.id (admin).

// POST /api/login
export function masuk(email, password) {
  if (pakaiBackend) return request('/login', { method: 'POST', body: { email, password } })

  const user = db.users.find((u) => u.email === email)
  if (!user || !password) {
    return gagal(422, 'Email atau password salah', { email: ['Email atau password salah.'] })
  }
  db.penggunaLogin = user.id
  return balas({ token: 'token-palsu', user })
}

// POST /api/register
// data: { name, nim, email, password, semester }
export function daftar(data) {
  if (pakaiBackend) return request('/register', { method: 'POST', body: data })

  if (db.users.some((u) => u.email === data.email)) {
    return gagal(422, 'Email sudah dipakai', { email: ['Email sudah dipakai.'] })
  }
  // Password tidak ikut disimpan/dikirim balik, sama seperti backend
  const user = {
    id: idBaru(db.users),
    name: data.name,
    nim: data.nim,
    email: data.email,
    role: 'mahasiswa',
    semester: data.semester ?? null,
  }
  db.users.push(user)
  db.penggunaLogin = user.id
  return balas({ token: 'token-palsu', user })
}

// POST /api/logout
export function keluar() {
  if (pakaiBackend) return request('/logout', { method: 'POST' })

  db.penggunaLogin = null
  return balas(null)
}

// GET /api/user
export function ambilProfil() {
  if (pakaiBackend) return request('/user')

  const user = cari(db.users, db.penggunaLogin)
  if (!user) return gagal(401, 'Belum login')
  return balas(user)
}

// PUT /api/user
// data: kolom yang mau diubah, misal { name, semester }
export function ubahProfil(data) {
  if (pakaiBackend) return request('/user', { method: 'PUT', body: data })

  const user = cari(db.users, db.penggunaLogin)
  if (!user) return gagal(401, 'Belum login')
  Object.assign(user, data)
  return balas(user)
}
