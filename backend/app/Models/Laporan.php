<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Laporan extends Model
{
    protected $table = 'laporan';

    protected $fillable = ['catatan_id', 'pelapor_id', 'alasan'];

    protected $attributes = ['status' => 'baru'];

    public function catatan(): BelongsTo
    {
        return $this->belongsTo(Catatan::class);
    }

    public function pelapor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'pelapor_id');
    }
}
