<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Tugas extends Model
{
    protected $table = 'tugas';

    // user_id dan kelompok_id sengaja tidak ada di sini: keduanya ditentukan server, bukan dari isi form.
    protected $fillable = ['mata_kuliah_id', 'judul', 'deskripsi', 'deadline', 'prioritas', 'status', 'ditugaskan_ke'];

    protected $attributes = ['prioritas' => 'sedang', 'status' => 'belum'];

    protected $hidden = ['pengingat_dikirim_pada'];

    protected function casts(): array
    {
        return ['deadline' => 'datetime:Y-m-d\TH:i:s', 'pengingat_dikirim_pada' => 'datetime'];
    }

    public function mataKuliah(): BelongsTo
    {
        return $this->belongsTo(MataKuliah::class);
    }

    public function kelompok(): BelongsTo
    {
        return $this->belongsTo(Kelompok::class);
    }

    // Saat dikirim ke frontend, relasi ini menggantikan kolom ditugaskan_ke menjadi { id, name }
    public function ditugaskanKe(): BelongsTo
    {
        return $this->belongsTo(User::class, 'ditugaskan_ke');
    }
}
