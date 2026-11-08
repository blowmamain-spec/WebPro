# Panduan Frontend (React)

Panduan singkat buat anggota kelompok yang baru pertama kali pakai React. Bacanya urut, 15 menit cukup.

## 1. Kamu ngoding di mana?

Hampir semua kerjaan ada di **file halaman milikmu** di `frontend/src/pages/`. Halamannya sudah ada semua, sudah terdaftar di router, sudah muncul di sidebar, dan sudah mengambil data. Tinggal dirombak tampilannya.

| Domain | File halaman | File data |
| --- | --- | --- |
| Admin & Sistem | `pages/auth/*`, `pages/admin/*`, `ProfilPage`, `NotifikasiPage` | `api/auth.js`, `api/admin.js`, `api/mataKuliah.js`, `api/notifikasi.js` |
| Tugas | `pages/tugas/*` | `api/tugas.js`, `api/kelompok.js` |
| Catatan | `pages/catatan/*` | `api/catatan.js` |
| Waktu & Belajar | `pages/waktu/*` | `api/jadwal.js`, `api/checklist.js` |
| Bersama (terakhir) | `DashboardPage` | (memakai semua) |

Komponen yang khusus untuk domainmu (misal `KartuTugas.jsx`) taruh di subfolder `src/components/<domain>/`, contohnya `src/components/tugas/KartuTugas.jsx`.

## 2. Menjalankan

```bash
cd frontend
npm install
npm run dev
```

Buka `http://localhost:5173`. Setiap file disimpan, browser langsung ikut berubah. Sebelum push, jalankan `npm run lint` untuk mengecek kesalahan umum.

Akun contoh di halaman login (password bebas selama memakai data palsu): `mahasiswa@contoh.ac.id` dan `admin@contoh.ac.id`. Panel admin juga bisa langsung dibuka di `/admin`.

Backend tidak perlu dijalankan selama `VITE_API_URL` di `frontend/.env` kosong. Kalau file `.env`-mu masih berisi `http://localhost:8000` dan muncul pesan "Backend tidak bisa dihubungi", kosongkan isinya lalu jalankan ulang `npm run dev`.

## 3. Isi satu file halaman

Satu halaman = satu fungsi yang mengembalikan tampilan (JSX):

```jsx
import PageHeader from '@/components/PageHeader'

function TugasPage() {
  // JS: data dan fungsi ditulis di sini

  return (
    // JSX: tampilannya
    <div>
      <PageHeader judul="Deadline Tugas" />
    </div>
  )
}

export default TugasPage
```

`@/` artinya folder `src/`, jadi `@/components/PageHeader` = `src/components/PageHeader.jsx`.

## 4. JSX vs HTML

JSX hampir sama dengan HTML. Bedanya cuma ini:

| HTML | JSX |
| --- | --- |
| `class="kartu"` | `className="kartu"` |
| `for="email"` | `htmlFor="email"` |
| `onclick="simpan()"` | `onClick={simpan}` (huruf besar di tengah, tanpa tanda kurung) |
| `<input>` | `<input />` (tag kosong wajib ditutup) |
| `<!-- komentar -->` | `{/* komentar */}` |
| Isi teks dari variabel lewat JS | `{nama}` langsung di dalam tag |

Satu fungsi komponen harus mengembalikan **satu** elemen paling luar. Kalau butuh beberapa elemen sejajar, bungkus dengan `<>...</>`.

## 5. Contekan pola yang sering dipakai

| Kebutuhan | Tulisan di JSX |
| --- | --- |
| Tampilkan variabel | `<p>{judul}</p>` |
| Atribut dari variabel | `<Link to={alamat}>` |
| Tampilkan kalau benar | `{pesanError && <p>{pesanError}</p>}` |
| Pilih salah satu | `{memuat ? <p>Memuat...</p> : <ul>...</ul>}` |
| Ulangi untuk tiap item | `{daftar.map((t) => <li key={t.id}>{t.judul}</li>)}` |
| Pindah halaman (link) | `<Link to="/tugas">Tugas</Link>` dari `react-router-dom` |
| Pindah halaman (dari kode) | `const navigate = useNavigate()` lalu `navigate('/')` |
| Baca `:id` di alamat | `const { id } = useParams()` |

`key` di `map` wajib ada dan unik (biasanya `id`), supaya React tahu item mana yang berubah.

## 6. State: data yang mengubah tampilan

Di JS biasa kamu mengubah elemen langsung (`el.textContent = ...`). Di React, kamu mengubah **data**, lalu tampilannya ikut berubah sendiri. Data seperti itu dibuat dengan `useState`:

```jsx
import { useState } from 'react'

function Penghitung() {
  const [jumlah, setJumlah] = useState(0)    // nilai awal 0

  return <button onClick={() => setJumlah(jumlah + 1)}>Diklik {jumlah} kali</button>
}
```

Aturannya: **jangan ubah variabelnya langsung** (`jumlah++` tidak akan memperbarui layar). Selalu lewat setter (`setJumlah(...)`). Untuk array dan objek, buat salinan baru:

```js
setDaftarTugas([...daftarTugas, tugasBaru])                        // tambah
setDaftarTugas(daftarTugas.filter((t) => t.id !== id))             // hapus
setDaftarTugas(daftarTugas.map((t) => (t.id === id ? hasil : t)))  // ubah
```

Input form disambungkan lewat `value` + `onChange` (contoh lengkap ada di `pages/auth/LoginPage.jsx` dan `RegisterPage.jsx`):

```jsx
const [judul, setJudul] = useState('')

<input value={judul} onChange={(e) => setJudul(e.target.value)} />
```

## 7. Props: mengirim data ke komponen

Props itu seperti parameter fungsi. Contoh `PageHeader`:

```jsx
// Memakai
<PageHeader judul="Catatan Saya" deskripsi="...">
  <button className="tombol">Tulis Catatan</button>
</PageHeader>

// Isinya (src/components/PageHeader.jsx)
function PageHeader({ judul, deskripsi, children }) { ... }
```

`children` = apa pun yang ditulis di antara tag pembuka dan penutup.

## 8. Dari mana datanya?

Setiap halaman sudah memakai `useMuatData`:

```jsx
import { useMuatData } from '@/hooks/useMuatData'
import { ambilDaftarTugas } from '@/api/tugas'

const { data: daftarTugas, memuat, error, setData } = useMuatData(() => ambilDaftarTugas(), [])
```

- `memuat` bernilai `true` selama data belum datang.
- `error` berisi `{ message }` kalau gagal (misal catatan tidak ditemukan).
- `setData` dipakai untuk mengubah data di layar setelah tambah/ubah/hapus.
- `[]` di akhir = daftar nilai yang kalau berubah, datanya dimuat ulang. Halaman detail memakai `[id]`.

Halaman **tidak pernah** menulis data sendiri dan tidak memanggil `fetch` langsung. Semua lewat fungsi di `src/api/`.

- **Data palsu (`VITE_API_URL` kosong):** fungsi di `src/api/` membaca `src/api/data-palsu.js`. Tambah/ubah/hapus juga jalan, tapi kembali seperti semula setelah refresh.
- **Backend (`VITE_API_URL` diisi):** fungsi yang sudah punya backend memanggil Laravel lewat `client.js`, dan datanya tersimpan di database. Nama fungsinya sama, jadi **halamanmu tidak perlu diubah**.

Yang sudah tersambung ke backend: `auth.js`, `jadwal.js`, dan `ambilDaftarMataKuliah()`. Contoh polanya ada di `src/api/jadwal.js`.

Fungsi apa saja yang tersedia untuk halamanmu ditulis di komentar bagian atas file halaman. Daftar lengkapnya ada di `docs/kontrak-data.md`.

Contoh memanggil fungsi yang mengubah data, sekaligus menangani error:

```jsx
import { tambahTugas } from '@/api/tugas'

const [pesanError, setPesanError] = useState('')

async function simpan() {
  try {
    const tugasBaru = await tambahTugas({ judul: 'Laporan', deadline: '2026-11-10T23:59:00', prioritas: 'tinggi' })
    setData([...daftarTugas, tugasBaru])
  } catch (error) {
    setPesanError(error.message)    // misal "Data belum lengkap"
  }
}
```

## 9. Keamanan: isi dari pengguna lain

React otomatis mengamankan teks yang ditampilkan lewat `{...}`, jadi isi catatan yang mengandung `<script>` tetap tampil sebagai teks biasa. **Jangan pakai `dangerouslySetInnerHTML`** untuk menampilkan isi dari pengguna. Kalau nanti isi catatan (Markdown) mau ditampilkan rapi, pakai library Markdown untuk React yang tidak menjalankan HTML mentah, dan diskusikan dulu di grup.

## 10. Styling

Proyek ini memakai **Tailwind CSS** dan beberapa class buatan sendiri di `src/index.css`:

- Class siap pakai: `kartu`, `tombol`, `tombol-garis`, `teks-redup`, `pesan-error`.
- Class Tailwind boleh dipakai langsung di elemen, misal `className="kartu mt-4 grid gap-2"`. Kalau bentrok dengan class buatan sendiri, class Tailwind yang menang.
- Jangan menambah style di `index.css` untuk keperluan satu halaman saja. Pakai class Tailwind di halaman itu.

## 11. Yang perlu dilakukan di halamanmu

1. Ganti bagian yang diberi komentar `Titik awal` dengan tampilan yang sebenarnya.
2. Kerjakan poin-poin di kotak "Rencana isi halaman ini".
3. Kalau sudah selesai, hapus `<RencanaIsi>` dan import-nya.

## 12. Aturan main

- **Satu orang, satu domain.** Jangan mengubah halaman atau file `api` domain lain tanpa ngomong dulu.
- **Bentuk data mengikuti `docs/kontrak-data.md`.** Butuh kolom baru? Ubah dokumennya dulu, kabari grup, baru tambahkan ke `data-palsu.js`.
- **File bersama** (`App.jsx`, `layouts/`, `index.css`, `data-palsu.js`): boleh diubah, tapi bilang di grup supaya tidak bentrok.
- **Git:** buat branch `fitur/<nama-fitur>` dari `dev`, lalu Pull Request ke `dev` (lihat README).

## 13. Kalau perlu halaman baru

1. Buat file, misal `src/pages/waktu/StatistikPage.jsx`.
2. Import dan daftarkan di `src/App.jsx`, di dalam blok halaman mahasiswa:
   ```jsx
   <Route path="/statistik" element={<StatistikPage />} />
   ```
3. Tambahkan ke array `menu` di `src/layouts/MahasiswaLayout.jsx`:
   ```js
   { to: '/statistik', teks: 'Statistik' },
   ```

## 14. Alur waktu membuka `/catatan`

`index.html` → `main.jsx` → `App.jsx` (React Router mencocokkan `/catatan`) → `MahasiswaLayout.jsx` (sidebar + `<Outlet />`) → `CatatanSayaPage.jsx` → `useMuatData` → `api/catatan.js`.
