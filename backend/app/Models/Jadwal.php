<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Jadwal extends Model
{
    protected $table = 'jadwal';

    // user_id sengaja tidak ada di sini: pemilik jadwal selalu diambil dari token, bukan dari isi form.
    protected $fillable = ['mata_kuliah_id', 'hari', 'jam_mulai', 'jam_selesai', 'ruangan'];

    public function mataKuliah(): BelongsTo
    {
        return $this->belongsTo(MataKuliah::class);
    }

    // PostgreSQL menyimpan jam sebagai "07:30:00", sedangkan frontend memakai "07:30".
    protected function jamMulai(): Attribute
    {
        return Attribute::get(fn (string $nilai) => substr($nilai, 0, 5));
    }

    protected function jamSelesai(): Attribute
    {
        return Attribute::get(fn (string $nilai) => substr($nilai, 0, 5));
    }
}
