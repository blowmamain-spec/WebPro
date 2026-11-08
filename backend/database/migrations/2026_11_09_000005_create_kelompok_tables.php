<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kelompok', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->foreignId('mata_kuliah_id')->nullable()->constrained('mata_kuliah')->nullOnDelete();
            $table->foreignId('dibuat_oleh')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('anggota_kelompok', function (Blueprint $table) {
            $table->foreignId('kelompok_id')->constrained('kelompok')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();

            $table->primary(['kelompok_id', 'user_id']);
        });

        Schema::table('tugas', function (Blueprint $table) {
            $table->foreignId('kelompok_id')->nullable()->constrained('kelompok')->cascadeOnDelete();
            $table->foreignId('ditugaskan_ke')->nullable()->constrained('users')->nullOnDelete();
            // Supaya pengingat deadline untuk satu tugas tidak dikirim berkali-kali
            $table->dateTime('pengingat_dikirim_pada')->nullable();

            $table->index('kelompok_id');
        });
    }

    public function down(): void
    {
        Schema::table('tugas', function (Blueprint $table) {
            $table->dropConstrainedForeignId('kelompok_id');
            $table->dropConstrainedForeignId('ditugaskan_ke');
            $table->dropColumn('pengingat_dikirim_pada');
        });

        Schema::dropIfExists('anggota_kelompok');
        Schema::dropIfExists('kelompok');
    }
};
