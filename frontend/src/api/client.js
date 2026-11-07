// Dipakai mulai tahap 2, setelah backend Laravel jadi.
// Cara pindah dari data palsu ke backend, contoh di src/api/tugas.js:
//
//   import { request } from './client'
//
//   export function ambilDaftarTugas() {
//     return request('/tugas')
//   }
//
//   export function tambahTugas(data) {
//     return request('/tugas', { method: 'POST', body: data })
//   }
//
// Nama dan parameter fungsinya tetap sama, jadi halaman-halaman tidak perlu diubah.

const BASE_URL = import.meta.env.VITE_API_URL

export async function request(alamat, { method = 'GET', body } = {}) {
  const token = localStorage.getItem('token')

  const res = await fetch(`${BASE_URL}/api${alamat}`, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = res.status === 204 ? null : await res.json()

  // Laravel mengirim { message, errors } kalau gagal, misal validasi (422) atau belum login (401)
  if (!res.ok) {
    throw { status: res.status, ...data }
  }

  return data
}
