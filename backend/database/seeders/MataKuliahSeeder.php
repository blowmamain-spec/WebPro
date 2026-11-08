<?php

namespace Database\Seeders;

use App\Models\MataKuliah;
use Illuminate\Database\Seeder;

/**
 * Kurikulum reguler S1 Teknologi Informasi Telkom University.
 * Sumber: https://bit.telkomuniversity.ac.id/regular-curriculum-2/
 *
 * Baris "Agama", "Pilihan Peminatan", dan "Pilihan Bebas" di tabel per semester hanya tempat kosong,
 * jadi yang disimpan adalah mata kuliah pilihannya. Mata kuliah peminatan dan pilihan bebas
 * diambil mulai semester 7, jadi semester-nya ditulis 7.
 */
class MataKuliahSeeder extends Seeder
{
    public function run(): void
    {
        // kode, nama, semester, sks, kategori
        $daftar = [
            ['CBK1AAB3', 'Logika Matematika', 1, 3, 'wajib'],
            ['CBK1BAB4', 'Berpikir Komputasional & Pengenalan Pemrograman', 1, 4, 'wajib'],
            ['CBK1CAB3', 'Kalkulus', 1, 3, 'wajib'],
            ['CBK1DAB2', 'Pengantar Teknologi Informasi', 1, 2, 'wajib'],
            ['UBKXBCB2', 'Pancasila', 1, 2, 'wajib'],
            ['UBKXCCB2', 'Bahasa Indonesia', 1, 2, 'wajib'],
            ['CBK1EAB3', 'Pendidikan Karakter', 1, 3, 'wajib'],
            ['CBK1FAB3', 'Statistika dan Analitik Data', 2, 3, 'wajib'],
            ['CBK1GAB3', 'Aljabar Linear dan Matriks', 2, 3, 'wajib'],
            ['CBK1HAB4', 'Algoritma Pemrograman', 2, 4, 'wajib'],
            ['CBK1IAB3', 'Matematika Diskrit', 2, 3, 'wajib'],
            ['UCKXADB2', 'Bahasa Inggris', 2, 2, 'wajib'],
            ['CBK1JAB2', 'Pemeliharaan dan Administrasi Teknologi Informasi', 2, 2, 'wajib'],
            ['CBK2AAB2', 'Teori Peluang', 3, 2, 'wajib'],
            ['CBK2BAB4', 'Struktur Data', 3, 4, 'wajib'],
            ['CBK2CAB3', 'Sistem Multimedia', 3, 3, 'wajib'],
            ['CBK2DAB3', 'Manajemen Layanan Teknologi Informasi', 3, 3, 'wajib'],
            ['CBK2EAB3', 'Organisasi dan Arsitektur Komputer', 3, 3, 'wajib'],
            ['CBK2FAB3', 'Keterampilan dan Profesionalisme Teknologi Informasi', 3, 3, 'wajib'],
            ['CBK2GAB2', 'Wawasan Global TIK', 3, 2, 'wajib'],
            ['CBK2HAB4', 'Jaringan Komputer', 4, 4, 'wajib'],
            ['CBK2IAB3', 'Interaksi Manusia Komputer', 4, 3, 'wajib'],
            ['UCKXBDB2', 'Kewirausahaan', 4, 2, 'wajib'],
            ['CBK2JAB3', 'Sistem Operasi', 4, 3, 'wajib'],
            ['CBK2KAB3', 'Sistem Cerdas', 4, 3, 'wajib'],
            ['CBK2LAB4', 'Sistem Manajemen Basis Data', 4, 4, 'wajib'],
            ['CBK2MAB1', 'Teknologi Informasi Untuk Masyarakat', 4, 1, 'wajib'],
            ['CBK3AAB3', 'Keamanan Siber', 5, 3, 'wajib'],
            ['CBK3BAB3', 'Pengalaman Pengguna', 5, 3, 'wajib'],
            ['CBK3CAB4', 'Pemrograman Berorientasi Obyek', 5, 4, 'wajib'],
            ['CBK3DAB3', 'Pemrograman Web', 5, 3, 'wajib'],
            ['CBK3EAB3', 'Pemrograman Platform & IOT', 5, 3, 'wajib'],
            ['CBK3FAB3', 'Rekayasa Perangkat Lunak', 5, 3, 'wajib'],
            ['CBK3GAB3', 'Aplikasi Perangkat Bergerak', 6, 3, 'wajib'],
            ['CBK3HAB3', 'Komputasi Awan dan Virtualisasi', 6, 3, 'wajib'],
            ['CBK3IAB3', 'Arsitektur Integrasi Sistem', 6, 3, 'wajib'],
            ['UBKXACB2', 'Kewarganegaraan', 6, 2, 'wajib'],
            ['CBK3KAB3', 'Manajemen Proyek', 6, 3, 'wajib'],
            ['CBK3LAB3', 'Pengujian Penetrasi dan Etika Peretasan', 6, 3, 'wajib'],
            ['CBK3MAB2', 'Metodologi Penelitian dan Tata Tulis Ilmiah', 6, 2, 'wajib'],
            ['CBK4AAA2', 'Penulisan Proposal', 7, 2, 'wajib'],
            ['CBK4BAB3', 'Kerja Praktik', 7, 3, 'wajib'],
            ['CBK4AAC3', 'Proyek Teknologi Informasi', 7, 3, 'wajib'],
            ['CBK4CAB2', 'Bahasa Inggris II', 7, 2, 'wajib'],
            ['CBK4BAA4', 'Tugas Akhir', 8, 4, 'wajib'],
            ['UAKXACB2', 'Agama Islam', 2, 2, 'agama'],
            ['UAKXBCB2', 'Agama Kristen', 2, 2, 'agama'],
            ['UAKXCCB2', 'Agama Katolik', 2, 2, 'agama'],
            ['UAKXDCB2', 'Agama Hindu', 2, 2, 'agama'],
            ['UAKXECB2', 'Agama Budha', 2, 2, 'agama'],
            ['UAKXFCB2', 'Agama Kong Hu Cu', 2, 2, 'agama'],
            ['UAKXGCB2', 'Penghayat Kepercayaan Terhadap Tuhan YME', 2, 2, 'agama'],
            ['CBK4GBB3', 'Jaminan dan Keamanan Informasi', 7, 3, 'peminatan_cyber_security'],
            ['CBK4HBB3', 'Manajemen Risiko Teknologi Informasi', 7, 3, 'peminatan_cyber_security'],
            ['CBK4IBB3', 'Forensik Komputer dan Jaringan', 7, 3, 'peminatan_cyber_security'],
            ['CBK4JBB3', 'Keamanan Web dan Aplikasi', 7, 3, 'peminatan_cyber_security'],
            ['CBK4KBB3', 'Keamanan Jaringan', 7, 3, 'peminatan_cyber_security'],
            ['CBK4LBB3', 'Perangkat Berbahaya dan Intelijen Ancaman Siber', 7, 3, 'peminatan_cyber_security'],
            ['CBK4ABB3', 'Sistem Cerdas Internet of Things', 7, 3, 'peminatan_digital_innovation'],
            ['CBK4BBB3', 'Jaringan Sensor Nirkabel', 7, 3, 'peminatan_digital_innovation'],
            ['CBK4CBB3', 'Pengembangan Aplikasi Rantai Blok', 7, 3, 'peminatan_digital_innovation'],
            ['CBK4DBB3', 'Layanan Mikro dan Arsitektur Berorientasi Layanan', 7, 3, 'peminatan_digital_innovation'],
            ['CBK4EBB3', 'Pengembangan Gim dan Simulasi', 7, 3, 'peminatan_digital_innovation'],
            ['CBK4FBB3', 'Teknologi Realitas Maya dan Realitas Berimbuh', 7, 3, 'peminatan_digital_innovation'],
            ['CBK4MBB3', 'Analisis Adopsi Inovasi Teknologi', 7, 3, 'pilihan_bebas'],
            ['CBK4NBB3', 'Tata Kelola Teknologi Informasi', 7, 3, 'pilihan_bebas'],
            ['CBK4OBB3', 'Sistem Informasi', 7, 3, 'pilihan_bebas'],
            ['CBK4PBB3', 'Pengujian Perangkat Lunak', 7, 3, 'pilihan_bebas'],
            ['CBK4QBB3', 'Kualitas Informasi', 7, 3, 'pilihan_bebas'],
            ['CBK4RBB3', 'Kompetisi TIK', 7, 3, 'pilihan_bebas'],
            ['CBK4SBB3', 'Jaringan Nirkabel', 7, 3, 'pilihan_bebas'],
            ['CBK4TBB3', 'Kesehatan-El Berbasis Internet of Things', 7, 3, 'pilihan_bebas'],
            ['CBK4UBB3', 'Teknik Antarmuka Perangkat Keras', 7, 3, 'pilihan_bebas'],
            ['CBK4VBB3', 'Sistem Waktu Nyata', 7, 3, 'pilihan_bebas'],
            ['CBK4WBB3', 'Jaringan Terdefinisi Perangkat Lunak & Virtualisasi Fungsi Jaringan', 7, 3, 'pilihan_bebas'],
            ['CBK4XBB3', 'Komputer Kuantum dan Internet', 7, 3, 'pilihan_bebas'],
            ['CBK4YBB3', 'Simulasi Jaringan', 7, 3, 'pilihan_bebas'],
            ['CBK4ZBB3', 'Sistem Kendali Internet of Things', 7, 3, 'pilihan_bebas'],
            ['CBK41BB3', 'Arsitektur Pusat Data', 7, 3, 'pilihan_bebas'],
            ['CBK42BB3', 'Rekayasa Instruksi', 7, 3, 'pilihan_bebas'],
            ['CBK43BB3', 'Komputasi Bioinformatika', 7, 3, 'pilihan_bebas'],
            ['CBK44BB3', 'Forensik Multimedia', 7, 3, 'pilihan_bebas'],
            ['CBK45BB3', 'Internet of Things untuk Edukasi', 7, 3, 'pilihan_bebas'],
            ['CBK46BB3', 'Pengembangan Aplikasi Cepat', 7, 3, 'pilihan_bebas'],
        ];

        foreach ($daftar as [$kode, $nama, $semester, $sks, $kategori]) {
            MataKuliah::updateOrCreate(
                ['kode' => $kode],
                ['nama' => $nama, 'semester' => $semester, 'sks' => $sks, 'kategori' => $kategori],
            );
        }
    }
}
