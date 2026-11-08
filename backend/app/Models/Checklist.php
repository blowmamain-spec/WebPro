<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Checklist extends Model
{
    protected $table = 'checklist';

    // user_id sengaja tidak ada di sini: pemilik selalu diambil dari token, bukan dari isi form.
    protected $fillable = ['mata_kuliah_id', 'judul'];

    public function mataKuliah(): BelongsTo
    {
        return $this->belongsTo(MataKuliah::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(ChecklistItem::class)->orderBy('urutan')->orderBy('id');
    }
}
