<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChecklistItem extends Model
{
    protected $table = 'checklist_item';

    protected $fillable = ['isi', 'selesai', 'urutan'];

    protected $attributes = ['selesai' => false];

    protected function casts(): array
    {
        return ['selesai' => 'boolean'];
    }

    public function checklist(): BelongsTo
    {
        return $this->belongsTo(Checklist::class);
    }
}
