<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Auth;

class Catatan extends Model
{
    protected $table = 'catatan';

    // user_id sengaja tidak ada di sini: penulis selalu diambil dari token, bukan dari isi form.
    protected $fillable = ['mata_kuliah_id', 'judul', 'isi', 'status'];

    protected $attributes = ['status' => 'pribadi'];

    // Ikut dikirim ke frontend, walaupun bukan kolom tabel
    protected $appends = ['milik_saya'];

    protected function casts(): array
    {
        return ['tersimpan' => 'boolean'];
    }

    public function getMilikSayaAttribute(): bool
    {
        return $this->user_id === Auth::id();
    }

    public function penulis(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function mataKuliah(): BelongsTo
    {
        return $this->belongsTo(MataKuliah::class);
    }

    public function penyimpan(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'catatan_tersimpan', 'catatan_id', 'user_id');
    }
}
