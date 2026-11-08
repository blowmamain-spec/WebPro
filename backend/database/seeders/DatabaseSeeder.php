<?php

namespace Database\Seeders;

use App\Models\Jadwal;
use App\Models\MataKuliah;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Isi data awal. Aman dijalankan berkali-kali karena memakai updateOrCreate.
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

        // Akun contoh punya password yang diketahui semua orang, jadi tidak boleh ada di server online.
        if (app()->environment('production')) {
            return;
        }

        $mahasiswa = User::updateOrCreate(
            ['email' => 'mahasiswa@contoh.ac.id'],
            ['name' => 'Mahasiswa Contoh', 'nim' => '103032400001', 'semester' => 5, 'password' => 'password'],
        );

        $admin = User::updateOrCreate(
            ['email' => 'admin@contoh.ac.id'],
            ['name' => 'Admin Contoh', 'password' => 'password'],
        );
        $admin->role = 'admin';
        $admin->save();

        $jadwal = [
            ['kode' => 'TIR302', 'hari' => 1, 'jam_mulai' => '07:30', 'jam_selesai' => '10:30', 'ruangan' => 'KU3.04.12'],
            ['kode' => 'TIW301', 'hari' => 2, 'jam_mulai' => '10:30', 'jam_selesai' => '13:30', 'ruangan' => 'Lab Komputer 2'],
            ['kode' => 'TIK303', 'hari' => 3, 'jam_mulai' => '13:30', 'jam_selesai' => '16:30', 'ruangan' => 'KU3.02.05'],
        ];

        foreach ($jadwal as $j) {
            Jadwal::unguarded(fn () => Jadwal::updateOrCreate(
                [
                    'user_id' => $mahasiswa->id,
                    'mata_kuliah_id' => MataKuliah::where('kode', $j['kode'])->value('id'),
                    'hari' => $j['hari'],
                ],
                ['jam_mulai' => $j['jam_mulai'], 'jam_selesai' => $j['jam_selesai'], 'ruangan' => $j['ruangan']],
            ));
        }
    }
}
