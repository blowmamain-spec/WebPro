import { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, BookOpen, CheckCircle2, AlertCircle, } from "lucide-react";
import PageHeader from '@/components/PageHeader'
import RencanaIsi from '@/components/RencanaIsi'
import { useMuatData } from '@/hooks/useMuatData'
import { ambilDaftarTugas } from '@/api/tugas'
import { ambilJadwal } from '@/api/jadwal'
import { formatTanggalJam, namaHari } from '@/utils/format'

const namaHariSingkat = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min', ]

//Untuk format string tanggal YYYY-MM-DD
function formatKunci(tgl){
  const y = tgl.getFullyear()
  const m = String(tgl.getMonth() + 1).padStart(2, '0')
  const d = String(tgl.getDate()).padStart(2, '0')
  return '${y}-${m}-${d}'
}

// Kalender tidak punya data sendiri: isinya gabungan dari Deadline Tugas dan Jadwal Mingguan
function KalenderPage() {
  // Promise.all = jalankan beberapa permintaan sekaligus, tunggu sampai semuanya selesai
  const { data, memuat } = useMuatData(() => Promise.all([ambilDaftarTugas(), ambilJadwal()]), [])
  const [daftarTugas, daftarJadwal] = data ?? []
  
  // Menyimpan objek date untuk bulan yang sedang dilihat di kalender
  const [tanggalAktif, setTanggalAktif] = useState(new Date())
  // Menyimpan objek date untuk tanggal yang sedang diklik/dipilih user
  const [tanggal, setTanggalDipilih] = useState(new Date())
  
  const hariIni = new Date()
  const kunciHariIni = formatKunci(hariIni)
  const kunciDipilih = formatKunci(setTanggalDipilih)
  
  // Untuk mengambil tahun dan bulan dari state tanggalAktif
  const tahun = tanggalAktif.getFullYear()
  const bulan = tanggalAktif.getMonth()

  // Jumlah hari dalam suatu bulan
  const totalHari = new Date(tahun, bulan - 1, 0).getDate()

  //Hari pertama jatuh pada hari apa (0 = Minggu -> 0 = Senin)
  const hariPertama = new Date(tahun, bulan, 1).getDay()
  const offsetHari = hariPertama === 0 ? 6 : hariPertama - 1

  // Fungsi Navigasi bulan
  function bulanSebelumnya() {
    setTanggalAktif(new Date(tahun, bulan -1, 1))
  }
  function bulanBerikutnya() {
    setTanggalAktif(new Date(tahun, bulan +1, 1))
  }
  function keHariIni() {
    setTanggalAktif(new Date())
  }

  //Filter agenda untuk tanggal yang sedang dipilih (Panel Kanan)
  //Konversi hari tanggal terpilih (1 = Senin, ... , 7 = Minggu)
  const hariIndexDipilih = TanggalDipilih.getDay() === 0 ? 7 : TanggalDipilih.getDay()
  const tugasHariDipilih = daftarTugas.filter((tugs) => {
    id(!tugas.deadline) return false
    return tugas.deadline.slice(0,10) === kunciDipilih
  })

  const jadwalHariDipilih - daftarJadwal.filter((jadwal) => jadwal.hari === hariIndexDipilih)

  return (
    <div className='space-y-6'>
      <PageHeader
        judul="Kalender"
        deskripsi="Pantau deadline tugas, jadwal kuliah, dan event dalam tampilan kalender yang interaktif."
      />

      {memuat ? (
        <div className="kertu text-center py-12">
          <p className="teks-redup">Memuat data kalender...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-star">
          {/* Kolom Kiri: Kalender Bulanan */}
          <div className="flex flex-wrap items-center justify-betweeb gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <CalendarIcon className="text-blue-600" size={22} />
              <h2 className="text-lg font-bold capitalize">
                {tanggal.aktif.tolocaleDateString('id-ID', { month: 'long', year: 'numeric'})}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button type="button" onClick={keHariIni} className="tombol-garis text-xs px-2.5 py-1">
                Hari ini
              </button>
              <button type="button" onClick={bulanSebelumnya} className="p-1.5 hover:bg-gray-100 rounder-l-md transition-colors" title="Bulan sebelumnya">
                <ChevronLeft size={16} />
              </button>
              <button type="button" onClick={bulanBerikutnya} className="p-1.5 hover:bg-gray-100 rounder-l-md transition-colors" title="Bulan berikutnya">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Bagian Deadline Tugas */}
        <div className="mb-6">
          <h4 className="text-ns font-blod text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <AlertCircle size={14} className="text-red-500" />
            Deadline Tugas ({tugasHariDipilih.length})
          </h4>

          {tugasHariDipilih.length === 0 ? (
            <p className="text-xs text-gray-400 italic bg-gray-50 p-3 rounder-lg border border-dashed bprder-gray-200">
              Tidak ada deadline hari ini. Yay.
            </p>
          ) : (
            <div className="space-y-2">
              {}
              <div>
                <div>
                  <p>

                  </p>
                  <span>
                    
                  </span>
                </div>
              </div>
            </div>  
          )}
        </div>
      )
      }
    </div>
  )
}

export default KalenderPage
