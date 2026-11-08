<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Auth;

class Kelompok extends Model
{
    protected $table = 'kelompok';

    // dibuat_oleh sengaja tidak ada di sini: pembuat selalu diambil dari token, bukan dari isi form.
    protected $fillable = ['nama', 'mata_kuliah_id'];

    // Ikut dikirim ke frontend, walaupun bukan kolom tabel
    protected $appends = ['milik_saya'];

    public function getMilikSayaAttribute(): bool
    {
        return $this->dibuat_oleh === Auth::id();
    }

    public function mataKuliah(): BelongsTo
    {
        return $this->belongsTo(MataKuliah::class);
    }

    public function anggota(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'anggota_kelompok', 'kelompok_id', 'user_id')->orderBy('name');
    }

    public function tugas(): HasMany
    {
        return $this->hasMany(Tugas::class);
    }
}
