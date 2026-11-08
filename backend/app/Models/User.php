<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

// `role` sengaja tidak ada di Fillable, supaya orang tidak bisa mendaftar sebagai admin lewat isi form.
#[Fillable(['name', 'nim', 'email', 'password', 'semester'])]
#[Hidden(['password', 'remember_token', 'pivot'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected $attributes = ['role' => 'mahasiswa'];

    public function jadwal(): HasMany
    {
        return $this->hasMany(Jadwal::class);
    }

    public function tugas(): HasMany
    {
        return $this->hasMany(Tugas::class);
    }

    public function catatan(): HasMany
    {
        return $this->hasMany(Catatan::class);
    }

    public function checklist(): HasMany
    {
        return $this->hasMany(Checklist::class);
    }

    // Kelompok yang diikuti pengguna ini
    public function kelompok(): BelongsToMany
    {
        return $this->belongsToMany(Kelompok::class, 'anggota_kelompok', 'user_id', 'kelompok_id');
    }

    public function catatanTersimpan(): BelongsToMany
    {
        return $this->belongsToMany(Catatan::class, 'catatan_tersimpan', 'user_id', 'catatan_id');
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
