<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('checklist', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('mata_kuliah_id')->nullable()->constrained('mata_kuliah')->nullOnDelete();
            $table->string('judul');
            $table->timestamps();

            $table->index('user_id');
        });

        Schema::create('checklist_item', function (Blueprint $table) {
            $table->id();
            $table->foreignId('checklist_id')->constrained('checklist')->cascadeOnDelete();
            $table->string('isi');
            $table->boolean('selesai')->default(false);
            $table->unsignedInteger('urutan')->default(1);
            $table->timestamps();

            $table->index(['checklist_id', 'urutan']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('checklist_item');
        Schema::dropIfExists('checklist');
    }
};
