<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Tugas extends Model
{
    protected $table = 'tugas';

    // user_id sengaja tidak ada di sini: pemilik tugas selalu diambil dari token, bukan dari isi form.
    protected $fillable = ['mata_kuliah_id', 'judul', 'deskripsi', 'deadline', 'prioritas', 'status'];

    protected $attributes = ['prioritas' => 'sedang', 'status' => 'belum'];

    protected function casts(): array
    {
        return ['deadline' => 'datetime:Y-m-d\TH:i:s'];
    }

    public function mataKuliah(): BelongsTo
    {
        return $this->belongsTo(MataKuliah::class);
    }
}
