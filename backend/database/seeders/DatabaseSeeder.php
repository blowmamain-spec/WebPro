<?php

namespace Database\Seeders;

use App\Models\Catatan;
use App\Models\Jadwal;
use App\Models\KataTerlarang;
use App\Models\Kelompok;
use App\Models\Laporan;
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
        $this->call(MataKuliahSeeder::class);

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
                ['kode' => 'CBK3FAB3', 'hari' => 1, 'jam_mulai' => '07:30', 'jam_selesai' => '10:30', 'ruangan' => 'KU3.04.12'],
                ['kode' => 'CBK3DAB3', 'hari' => 2, 'jam_mulai' => '10:30', 'jam_selesai' => '13:30', 'ruangan' => 'Lab Komputer 2'],
                ['kode' => 'CBK3AAB3', 'hari' => 3, 'jam_mulai' => '13:30', 'jam_selesai' => '16:30', 'ruangan' => 'KU3.02.05'],
            ];

            foreach ($jadwal as $j) {
                Jadwal::firstOrCreate(
                    ['user_id' => $mahasiswa->id, 'mata_kuliah_id' => $idMataKuliah($j['kode']), 'hari' => $j['hari']],
                    ['jam_mulai' => $j['jam_mulai'], 'jam_selesai' => $j['jam_selesai'], 'ruangan' => $j['ruangan']],
                );
            }

            $tugas = [
                ['judul' => 'Laporan SRS', 'kode' => 'CBK3FAB3', 'deskripsi' => 'Bab 1 sampai 3', 'hari' => 2, 'prioritas' => 'tinggi', 'status' => 'dikerjakan'],
                ['judul' => 'Kuis Jaringan Nirkabel', 'kode' => 'CBK4SBB3', 'deskripsi' => null, 'hari' => 5, 'prioritas' => 'sedang', 'status' => 'belum'],
                ['judul' => 'Write-up CTF minggu 8', 'kode' => 'CBK3AAB3', 'deskripsi' => 'Minimal 3 soal', 'hari' => 9, 'prioritas' => 'rendah', 'status' => 'belum'],
                ['judul' => 'Latihan inheritance', 'kode' => 'CBK3CAB4', 'deskripsi' => null, 'hari' => -3, 'prioritas' => 'sedang', 'status' => 'selesai'],
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
                [$mahasiswa, 'CBK2LAB4', 'Normalisasi 1NF sampai 3NF', "## 1NF\nSetiap kolom berisi nilai tunggal.\n\n## 2NF\nTidak ada ketergantungan parsial.", 'publik'],
                [$mahasiswa, 'CBK3DAB3', 'Catatan pribadi: setup Laravel', 'composer create-project laravel/laravel backend', 'pribadi'],
                [$budi, 'CBK3AAB3', 'Ringkasan OWASP Top 10', "1. Broken Access Control\n2. Cryptographic Failures\n3. Injection", 'publik'],
                [$siti, 'CBK1HAB4', 'Pola perulangan di Python', 'for, while, dan list comprehension.', 'publik'],
                [$budi, 'CBK3FAB3', 'Rangkuman Scrum', 'Isi catatan ini mengandung contohkasar.', 'menunggu'],
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

        // Contoh laporan untuk halaman Moderasi admin
        $python = Catatan::where('judul', 'Pola perulangan di Python')->first();
        Laporan::firstOrCreate(
            ['catatan_id' => $python->id, 'pelapor_id' => $budi->id],
            ['alasan' => 'Isinya terlalu singkat, bukan catatan kuliah'],
        );

        $checklistContoh = [
            ['Persiapan UTS Basis Data', 'CBK2LAB4', [['Rangkum materi ERD', true], ['Latihan soal normalisasi', false], ['Coba query JOIN', false]]],
            ['Belajar React', 'CBK3DAB3', [['Pahami useState dan props', true], ['Coba React Router', false]]],
        ];

        foreach ($checklistContoh as [$judul, $kode, $daftarItem]) {
            $checklist = $mahasiswa->checklist()->firstOrCreate(
                ['judul' => $judul],
                ['mata_kuliah_id' => $idMataKuliah($kode)],
            );

            foreach ($daftarItem as $urutan => [$isi, $selesai]) {
                $checklist->items()->firstOrCreate(['isi' => $isi], ['selesai' => $selesai, 'urutan' => $urutan + 1]);
            }
        }

        $kelompok = Kelompok::firstOrNew(['nama' => 'Kelompok 6 RPL']);
        $kelompok->mata_kuliah_id = $idMataKuliah('CBK3FAB3');
        $kelompok->dibuat_oleh = $mahasiswa->id;
        $kelompok->save();
        $kelompok->anggota()->syncWithoutDetaching([$mahasiswa->id, $budi->id, $siti->id]);

        $tugasKelompok = [
            ['judul' => 'Use case diagram', 'deskripsi' => 'Pakai draw.io', 'hari' => 3, 'prioritas' => 'tinggi', 'status' => 'dikerjakan', 'ditugaskan_ke' => $budi->id],
            ['judul' => 'Slide presentasi', 'deskripsi' => null, 'hari' => 7, 'prioritas' => 'sedang', 'status' => 'belum', 'ditugaskan_ke' => null],
        ];

        foreach ($tugasKelompok as $t) {
            if ($kelompok->tugas()->where('judul', $t['judul'])->exists()) {
                continue;
            }

            $tugas = new Tugas([
                'mata_kuliah_id' => $kelompok->mata_kuliah_id,
                'judul' => $t['judul'],
                'deskripsi' => $t['deskripsi'],
                'deadline' => now()->addDays($t['hari'])->setTime(23, 59),
                'prioritas' => $t['prioritas'],
                'status' => $t['status'],
                'ditugaskan_ke' => $t['ditugaskan_ke'],
            ]);
            $tugas->user_id = $mahasiswa->id;
            $kelompok->tugas()->save($tugas);
        }
    }
}
