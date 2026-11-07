import { db, balas, gagal, idBaru, cari } from './data-palsu'

// Tahap 1: password apa pun diterima, yang dicek cuma email-nya.
// Akun contoh: mahasiswa@contoh.ac.id (mahasiswa), admin@contoh.ac.id (admin).

// Tahap 2: POST /api/login
export function masuk(email, password) {
  const user = db.users.find((u) => u.email === email)
  if (!user || !password) {
    return gagal(422, 'Email atau password salah', { email: ['Email atau password salah.'] })
  }
  db.penggunaLogin = user.id
  return balas({ token: 'token-palsu', user })
}

// Tahap 2: POST /api/register
// data: { name, nim, email, password, semester }
export function daftar(data) {
  if (db.users.some((u) => u.email === data.email)) {
    return gagal(422, 'Email sudah dipakai', { email: ['Email sudah dipakai.'] })
  }
  // Password tidak ikut disimpan/dikirim balik, sama seperti backend nanti
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

// Tahap 2: POST /api/logout
export function keluar() {
  db.penggunaLogin = null
  return balas(null)
}

// Tahap 2: GET /api/user
export function ambilProfil() {
  const user = cari(db.users, db.penggunaLogin)
  if (!user) return gagal(401, 'Belum login')
  return balas(user)
}

// Tahap 2: PUT /api/user
// data: kolom yang mau diubah, misal { name, semester }
export function ubahProfil(data) {
  const user = cari(db.users, db.penggunaLogin)
  if (!user) return gagal(401, 'Belum login')
  Object.assign(user, data)
  return balas(user)
}
