<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Catatan;
use App\Models\KataTerlarang;
use App\Models\Laporan;
use App\Models\User;
use App\Notifications\PesanAplikasi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

// Semua fungsi di sini hanya untuk admin, dibatasi di routes/api.php
class AdminController extends Controller
{
    private const RELASI_CATATAN = ['penulis:id,name', 'mataKuliah:id,kode,nama,semester'];

    public function ringkasan(): JsonResponse
    {
        return response()->json([
            'menunggu_moderasi' => Catatan::where('status', 'menunggu')->count(),
            'laporan_baru' => Laporan::where('status', 'baru')->count(),
            'jumlah_pengguna' => User::where('role', 'mahasiswa')->count(),
            'catatan_publik' => Catatan::where('status', 'publik')->count(),
        ]);
    }

    // Catatan yang menunggu keputusan admin
    public function moderasi(): JsonResponse
    {
        return response()->json(
            Catatan::with(self::RELASI_CATATAN)->where('status', 'menunggu')->oldest('updated_at')->get()
        );
    }

    public function setujui(int $id): JsonResponse
    {
        $catatan = $this->cariCatatan($id);

        if ($catatan->status !== 'menunggu') {
            abort(422, 'Hanya catatan yang menunggu moderasi yang bisa disetujui.');
        }

        $catatan->update(['status' => 'publik']);
        $catatan->penulis->notify(new PesanAplikasi('moderasi', "Catatan \"{$catatan->judul}\" sudah tayang", "/jelajah/{$catatan->id}"));

        return response()->json($catatan->load(self::RELASI_CATATAN));
    }

    public function tolak(int $id): JsonResponse
    {
        $catatan = $this->cariCatatan($id);

        if (! in_array($catatan->status, ['menunggu', 'publik'], true)) {
            abort(422, 'Hanya catatan yang menunggu moderasi atau sudah tayang yang bisa ditolak.');
        }

        $this->tolakCatatan($catatan);

        return response()->json($catatan->load(self::RELASI_CATATAN));
    }

    public function daftarLaporan(): JsonResponse
    {
        $laporan = Laporan::with(['catatan:id,judul,user_id', 'pelapor:id,name'])->latest()->get();

        return response()->json($laporan->map(fn (Laporan $l) => [
            'id' => $l->id,
            'catatan_id' => $l->catatan_id,
            'catatan' => $l->catatan ? ['id' => $l->catatan->id, 'judul' => $l->catatan->judul] : null,
            'pelapor' => $l->pelapor,
            'alasan' => $l->alasan,
            'status' => $l->status,
            'created_at' => $l->created_at,
        ]));
    }

    // status: ditindaklanjuti (catatan ikut ditolak) atau diabaikan
    public function tindakLanjutiLaporan(Request $request, int $id): Response
    {
        $laporan = Laporan::find($id) ?? abort(404, 'Laporan tidak ditemukan.');

        $data = $request->validate(
            ['status' => ['required', 'in:ditindaklanjuti,diabaikan']],
            ['status.required' => 'Status wajib diisi.', 'status.in' => 'Status harus ditindaklanjuti atau diabaikan.'],
        );

        // status tidak ada di $fillable, supaya tidak bisa diisi pelapor saat membuat laporan
        $laporan->status = $data['status'];
        $laporan->save();

        // Kalau penulis sudah menjadikannya pribadi, catatannya memang sudah tidak tampil
        if ($data['status'] === 'ditindaklanjuti' && in_array($laporan->catatan->status, ['menunggu', 'publik'], true)) {
            $this->tolakCatatan($laporan->catatan);
        }

        return response()->noContent();
    }

    public function daftarKata(): JsonResponse
    {
        return response()->json(KataTerlarang::orderBy('kata')->get());
    }

    public function tambahKata(Request $request): JsonResponse
    {
        $request->merge(['kata' => mb_strtolower(trim((string) $request->input('kata')))]);

        $data = $request->validate(
            ['kata' => ['required', 'string', 'max:100', 'unique:kata_terlarang,kata']],
            ['kata.required' => 'Kata wajib diisi.', 'kata.max' => 'Kata maksimal 100 karakter.', 'kata.unique' => 'Kata itu sudah ada.'],
        );

        return response()->json(KataTerlarang::create($data), 201);
    }

    public function hapusKata(int $id): Response
    {
        (KataTerlarang::find($id) ?? abort(404, 'Kata tidak ditemukan.'))->delete();

        return response()->noContent();
    }

    // Laporan lain untuk catatan yang sama ikut selesai
    private function tolakCatatan(Catatan $catatan): void
    {
        $catatan->update(['status' => 'ditolak']);
        Laporan::where('catatan_id', $catatan->id)->where('status', 'baru')->update(['status' => 'ditindaklanjuti']);
        $catatan->penulis->notify(new PesanAplikasi('moderasi', "Catatan \"{$catatan->judul}\" ditolak admin", '/catatan'));
    }

    private function cariCatatan(int $id): Catatan
    {
        return Catatan::find($id) ?? abort(404, 'Catatan tidak ditemukan.');
    }
}
