<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tugas;
use App\Notifications\PesanAplikasi;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Notifications\DatabaseNotification;

class NotifikasiController extends Controller
{
    // READ: terbaru di atas
    public function index(Request $request): JsonResponse
    {
        $this->kirimPengingatDeadline($request);

        $notifikasi = $request->user()->notifications()
            ->latest()
            ->limit(100)
            ->get()
            ->map(fn (DatabaseNotification $notif) => [
                'id' => $notif->id,
                'jenis' => $notif->data['jenis'] ?? null,
                'pesan' => $notif->data['pesan'] ?? '',
                'tautan' => $notif->data['tautan'] ?? null,
                'dibaca_pada' => $notif->read_at,
                'created_at' => $notif->created_at,
            ]);

        return response()->json($notifikasi);
    }

    public function baca(Request $request, string $id): Response
    {
        $notif = $request->user()->notifications()->find($id) ?? abort(404, 'Notifikasi tidak ditemukan.');
        $notif->markAsRead();

        return response()->noContent();
    }

    public function bacaSemua(Request $request): Response
    {
        $request->user()->unreadNotifications()->update(['read_at' => now()]);

        return response()->noContent();
    }

    // Hosting gratis tidak punya penjadwal yang selalu jalan, jadi pengingat dibuat saat notifikasi dibuka:
    // tugas belum selesai yang deadline-nya kurang dari 24 jam lagi, masing-masing sekali saja.
    private function kirimPengingatDeadline(Request $request): void
    {
        $user = $request->user();
        // Deadline disimpan apa adanya sesuai jam yang diisi pengguna, yaitu WIB
        $sekarang = now('Asia/Jakarta');

        $tugasDekat = Tugas::query()
            ->whereNull('pengingat_dikirim_pada')
            ->where('status', '!=', 'selesai')
            ->whereBetween('deadline', [$sekarang->toDateTimeString(), $sekarang->copy()->addDay()->toDateTimeString()])
            ->where(fn (Builder $q) => $q
                ->where(fn (Builder $pribadi) => $pribadi->whereNull('kelompok_id')->where('user_id', $user->id))
                ->orWhere('ditugaskan_ke', $user->id))
            ->get();

        foreach ($tugasDekat as $tugas) {
            $user->notify(new PesanAplikasi(
                'deadline',
                "\"{$tugas->judul}\" deadline-nya kurang dari 24 jam lagi",
                $tugas->kelompok_id ? "/kelompok/{$tugas->kelompok_id}" : '/tugas',
            ));

            $tugas->pengingat_dikirim_pada = now();
            $tugas->save();
        }
    }
}
