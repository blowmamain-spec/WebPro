<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Laporan extends Model
{
    protected $table = 'laporan';

    protected $fillable = ['catatan_id', 'pelapor_id', 'alasan'];

    protected $attributes = ['status' => 'baru'];
}
