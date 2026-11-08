<?php

namespace Database\Seeders;

use App\Models\Catatan;
use App\Models\Jadwal;
use App\Models\KataTerlarang;
use App\Models\MataKuliah;
use App\Models\Tugas;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Isi data awal. Aman dijalankan berkali-kali: data yang sudah ada tidak digandakan.
     */
    public function run(): void
    {
        $mataKuliah = [
            ['kode' => 'TIW301', 'nama' => 'Pemrograman Web', 'semester' => 5],
            ['kode' => 'TIR302', 'nama' => 'Rekayasa Perangkat Lunak', 'semester' => 5],
            ['kode' => 'TIB201', 'nama' => 'Basis Data', 'semester' => 3],
            ['kode' => 'TIK303', 'nama' => 'Keamanan Siber', 'semester' => 5],
            ['kode' => 'TIP304', 'nama' => 'Pemrograman Berorientasi Objek', 'semester' => 5],
            ['kode' => 'TIJ305', 'nama' => 'Jaringan Nirkabel', 'semester' => 5],
            ['kode' => 'TIA101', 'nama' => 'Algoritma dan Pemrograman', 'semester' => 1],
        ];

        foreach ($mataKuliah as $mk) {
            MataKuliah::updateOrCreate(['kode' => $mk['kode']], $mk);
        }

        foreach (['contohkasar', 'jualjoki'] as $kata) {
            KataTerlarang::firstOrCreate(['kata' => $kata]);
        }

        // Akun contoh punya password yang diketahui semua orang, jadi tidak boleh ada di server online.
        if (app()->environment('production')) {
            return;
        }

        $mahasiswa = User::updateOrCreate(
            ['email' => 'mahasiswa@contoh.ac.id'],
            ['name' => 'Mahasiswa Contoh', 'nim' => '103032400001', 'semester' => 5, 'password' => 'password'],
        );
        $budi = User::updateOrCreate(
            ['email' => 'budi@contoh.ac.id'],
            ['name' => 'Budi Santoso', 'nim' => '103032400002', 'semester' => 5, 'password' => 'password'],
        );
        $siti = User::updateOrCreate(
            ['email' => 'siti@contoh.ac.id'],
            ['name' => 'Siti Aminah', 'nim' => '103032300003', 'semester' => 7, 'password' => 'password'],
        );

        $admin = User::updateOrCreate(
            ['email' => 'admin@contoh.ac.id'],
            ['name' => 'Admin Contoh', 'password' => 'password'],
        );
        $admin->role = 'admin';
        $admin->save();

        $idMataKuliah = fn (string $kode) => MataKuliah::where('kode', $kode)->value('id');

        // user_id tidak ada di $fillable model, jadi diisi lewat unguard di sini
        Model::unguarded(function () use ($mahasiswa, $budi, $siti, $idMataKuliah) {
            $jadwal = [
                ['kode' => 'TIR302', 'hari' => 1, 'jam_mulai' => '07:30', 'jam_selesai' => '10:30', 'ruangan' => 'KU3.04.12'],
                ['kode' => 'TIW301', 'hari' => 2, 'jam_mulai' => '10:30', 'jam_selesai' => '13:30', 'ruangan' => 'Lab Komputer 2'],
                ['kode' => 'TIK303', 'hari' => 3, 'jam_mulai' => '13:30', 'jam_selesai' => '16:30', 'ruangan' => 'KU3.02.05'],
            ];

            foreach ($jadwal as $j) {
                Jadwal::firstOrCreate(
                    ['user_id' => $mahasiswa->id, 'mata_kuliah_id' => $idMataKuliah($j['kode']), 'hari' => $j['hari']],
                    ['jam_mulai' => $j['jam_mulai'], 'jam_selesai' => $j['jam_selesai'], 'ruangan' => $j['ruangan']],
                );
            }

            $tugas = [
                ['judul' => 'Laporan SRS', 'kode' => 'TIR302', 'deskripsi' => 'Bab 1 sampai 3', 'hari' => 2, 'prioritas' => 'tinggi', 'status' => 'dikerjakan'],
                ['judul' => 'Kuis Jaringan Nirkabel', 'kode' => 'TIJ305', 'deskripsi' => null, 'hari' => 5, 'prioritas' => 'sedang', 'status' => 'belum'],
                ['judul' => 'Write-up CTF minggu 8', 'kode' => 'TIK303', 'deskripsi' => 'Minimal 3 soal', 'hari' => 9, 'prioritas' => 'rendah', 'status' => 'belum'],
                ['judul' => 'Latihan inheritance', 'kode' => 'TIP304', 'deskripsi' => null, 'hari' => -3, 'prioritas' => 'sedang', 'status' => 'selesai'],
            ];

            foreach ($tugas as $t) {
                Tugas::firstOrCreate(
                    ['user_id' => $mahasiswa->id, 'judul' => $t['judul']],
                    [
                        'mata_kuliah_id' => $idMataKuliah($t['kode']),
                        'deskripsi' => $t['deskripsi'],
                        'deadline' => now()->addDays($t['hari'])->setTime(23, 59),
                        'prioritas' => $t['prioritas'],
                        'status' => $t['status'],
                    ],
                );
            }

            $catatan = [
                [$mahasiswa, 'TIB201', 'Normalisasi 1NF sampai 3NF', "## 1NF\nSetiap kolom berisi nilai tunggal.\n\n## 2NF\nTidak ada ketergantungan parsial.", 'publik'],
                [$mahasiswa, 'TIW301', 'Catatan pribadi: setup Laravel', 'composer create-project laravel/laravel backend', 'pribadi'],
                [$budi, 'TIK303', 'Ringkasan OWASP Top 10', "1. Broken Access Control\n2. Cryptographic Failures\n3. Injection", 'publik'],
                [$siti, 'TIA101', 'Pola perulangan di Python', 'for, while, dan list comprehension.', 'publik'],
                [$budi, 'TIR302', 'Rangkuman Scrum', 'Isi catatan ini mengandung contohkasar.', 'menunggu'],
            ];

            foreach ($catatan as [$penulis, $kode, $judul, $isi, $status]) {
                Catatan::firstOrCreate(
                    ['user_id' => $penulis->id, 'judul' => $judul],
                    ['mata_kuliah_id' => $idMataKuliah($kode), 'isi' => $isi, 'status' => $status],
                );
            }
        });

        $owasp = Catatan::where('judul', 'Ringkasan OWASP Top 10')->first();
        $mahasiswa->catatanTersimpan()->syncWithoutDetaching([$owasp->id]);
    }
}
