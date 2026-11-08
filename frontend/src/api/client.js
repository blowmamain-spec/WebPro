// Penghubung frontend ke backend Laravel.
//
// Kalau VITE_API_URL di frontend/.env diisi, fitur yang sudah punya backend memanggil Laravel.
// Kalau kosong, semuanya tetap memakai data palsu, jadi frontend bisa dikerjakan tanpa menjalankan backend.
//
// Cara memindahkan satu fitur ke backend, contoh di src/api/tugas.js:
//
//   import { request, pakaiBackend } from './client'
//
//   export function ambilDaftarTugas() {
//     if (pakaiBackend) return request('/tugas')
//     ...kode data palsu yang lama...
//   }
//
// Nama dan parameter fungsinya tetap sama, jadi halaman-halaman tidak perlu diubah.

const BASE_URL = import.meta.env.VITE_API_URL

export const pakaiBackend = Boolean(BASE_URL)

export async function request(alamat, { method = 'GET', body } = {}) {
  const token = localStorage.getItem('token')

  let res
  try {
    res = await fetch(`${BASE_URL}/api${alamat}`, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw { status: 0, message: 'Backend tidak bisa dihubungi. Pastikan sudah dijalankan.' }
  }

  const data = res.status === 204 ? null : await res.json()

  // Token tidak ada atau sudah tidak berlaku: harus login lagi
  if (res.status === 401) {
    localStorage.removeItem('token')
    window.location.assign('/login')
  }

  // Laravel mengirim { message, errors } kalau gagal, misal validasi (422) atau tidak ditemukan (404)
  if (!res.ok) {
    throw { status: res.status, ...data }
  }

  return data
}
