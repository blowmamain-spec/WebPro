<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Jadwal;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class JadwalController extends Controller
{
    // READ: hanya jadwal milik pengguna yang login, urut dari Senin pagi sampai Minggu malam
    public function index(Request $request): JsonResponse
    {
        $jadwal = $request->user()->jadwal()
            ->with('mataKuliah:id,kode,nama')
            ->orderBy('hari')
            ->orderBy('jam_mulai')
            ->get();

        return response()->json($jadwal);
    }

    // CREATE
    public function store(Request $request): JsonResponse
    {
        $jadwal = $request->user()->jadwal()->create($this->validasi($request));

        return response()->json($jadwal->load('mataKuliah:id,kode,nama'), 201);
    }

    // UPDATE
    public function update(Request $request, int $id): JsonResponse
    {
        $jadwal = $this->cariMilikSendiri($request, $id);
        $jadwal->update($this->validasi($request));

        return response()->json($jadwal->load('mataKuliah:id,kode,nama'));
    }

    // DELETE
    public function destroy(Request $request, int $id): Response
    {
        $this->cariMilikSendiri($request, $id)->delete();

        return response()->noContent();
    }

    // Dicari lewat relasi pengguna, jadi jadwal milik orang lain dianggap tidak ada (404).
    private function cariMilikSendiri(Request $request, int $id): Jadwal
    {
        return $request->user()->jadwal()->find($id) ?? abort(404, 'Jadwal tidak ditemukan.');
    }

    private function validasi(Request $request): array
    {
        return $request->validate([
            'mata_kuliah_id' => ['required', 'integer', 'exists:mata_kuliah,id'],
            'hari' => ['required', 'integer', 'between:1,7'],
            'jam_mulai' => ['required', 'date_format:H:i'],
            'jam_selesai' => ['required', 'date_format:H:i', 'after:jam_mulai'],
            'ruangan' => ['nullable', 'string', 'max:100'],
        ], [
            'mata_kuliah_id.required' => 'Mata kuliah wajib dipilih.',
            'mata_kuliah_id.exists' => 'Mata kuliah tidak ditemukan.',
            'hari.required' => 'Hari wajib dipilih.',
            'hari.between' => 'Hari harus antara 1 (Senin) sampai 7 (Minggu).',
            'jam_mulai.required' => 'Jam mulai wajib diisi.',
            'jam_mulai.date_format' => 'Format jam mulai harus JJ:MM.',
            'jam_selesai.required' => 'Jam selesai wajib diisi.',
            'jam_selesai.date_format' => 'Format jam selesai harus JJ:MM.',
            'jam_selesai.after' => 'Jam selesai harus setelah jam mulai.',
            'ruangan.max' => 'Nama ruangan maksimal 100 karakter.',
        ]);
    }
}
