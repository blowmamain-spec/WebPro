<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('mata_kuliah', function (Blueprint $table) {
            $table->unsignedTinyInteger('sks')->default(3);
            $table->string('kategori', 40)->default('wajib');
        });

        // Kode contoh diganti kode asli kurikulum. Barisnya tetap sama,
        // jadi tugas, jadwal, dan catatan yang sudah ada tetap tersambung.
        $kodeBaru = [
            'TIW301' => 'CBK3DAB3',
            'TIR302' => 'CBK3FAB3',
            'TIB201' => 'CBK2LAB4',
            'TIK303' => 'CBK3AAB3',
            'TIP304' => 'CBK3CAB4',
            'TIJ305' => 'CBK4SBB3',
            'TIA101' => 'CBK1HAB4',
        ];

        foreach ($kodeBaru as $lama => $baru) {
            DB::table('mata_kuliah')->where('kode', $lama)->update(['kode' => $baru]);
        }
    }

    public function down(): void
    {
        Schema::table('mata_kuliah', function (Blueprint $table) {
            $table->dropColumn(['sks', 'kategori']);
        });
    }
};
