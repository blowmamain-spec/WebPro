<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kata_terlarang', function (Blueprint $table) {
            $table->id();
            $table->string('kata')->unique();
            $table->timestamps();
        });

        Schema::create('catatan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('mata_kuliah_id')->nullable()->constrained('mata_kuliah')->nullOnDelete();
            $table->string('judul');
            $table->text('isi');
            $table->string('status', 15)->default('pribadi');
            $table->timestamps();

            $table->index(['status', 'created_at']);
            $table->index('user_id');
        });

        Schema::create('catatan_tersimpan', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('catatan_id')->constrained('catatan')->cascadeOnDelete();

            $table->primary(['user_id', 'catatan_id']);
        });

        Schema::create('laporan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('catatan_id')->constrained('catatan')->cascadeOnDelete();
            $table->foreignId('pelapor_id')->constrained('users')->cascadeOnDelete();
            $table->text('alasan');
            $table->string('status', 20)->default('baru');
            $table->timestamps();

            $table->unique(['catatan_id', 'pelapor_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('laporan');
        Schema::dropIfExists('catatan_tersimpan');
        Schema::dropIfExists('catatan');
        Schema::dropIfExists('kata_terlarang');
    }
};
