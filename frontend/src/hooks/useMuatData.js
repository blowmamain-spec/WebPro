import { useEffect, useState } from 'react'

// Memuat data dari fungsi di src/api waktu halaman dibuka,
// dan memuat ulang kalau isi `deps` berubah (misal id di alamat /kelompok/:id).
//
// Contoh:
//   const { data: daftarTugas, memuat, error } = useMuatData(() => ambilDaftarTugas(), [])
//   const { data: kelompok } = useMuatData(() => ambilKelompok(id), [id])
//
// `setData` dipakai untuk mengubah data di layar setelah tambah/ubah/hapus.
export function useMuatData(ambilData, deps) {
  const kunci = JSON.stringify(deps)
  const [hasil, setHasil] = useState({ kunci: null, data: null, error: null })

  useEffect(() => {
    // Kalau pengguna sudah pindah halaman sebelum data datang, hasilnya diabaikan
    let dibatalkan = false

    ambilData()
      .then((data) => {
        if (!dibatalkan) setHasil({ kunci, data, error: null })
      })
      .catch((error) => {
        if (!dibatalkan) setHasil({ kunci, data: null, error })
      })

    return () => {
      dibatalkan = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kunci])

  function setData(dataBaru) {
    setHasil((sebelumnya) => ({
      ...sebelumnya,
      data: typeof dataBaru === 'function' ? dataBaru(sebelumnya.data) : dataBaru,
    }))
  }

  return {
    data: hasil.data,
    error: hasil.error,
    // Masih memuat selama hasil yang ada belum sesuai dengan deps yang sekarang
    memuat: hasil.kunci !== kunci,
    setData,
  }
}
