<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;

// Notifikasi di dalam aplikasi, disimpan di tabel notifications
class PesanAplikasi extends Notification
{
    // jenis: deadline | moderasi | kelompok
    public function __construct(
        private string $jenis,
        private string $pesan,
        private string $tautan,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return ['jenis' => $this->jenis, 'pesan' => $this->pesan, 'tautan' => $this->tautan];
    }
}
