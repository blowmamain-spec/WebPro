<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tugas;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TugasController extends Controller
{
    // READ: hanya tugas milik pengguna yang login, yang deadline-nya paling dekat di atas
    public function index(Request $request): JsonResponse
    {
        $tugas = $request->user()->tugas()
            ->with('mataKuliah:id,kode,nama')
            ->orderBy('deadline')
            ->get();

        return response()->json($tugas);
    }

    // CREATE
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate($this->aturan(wajib: true), $this->pesan());
        $tugas = $request->user()->tugas()->create($data);

        return response()->json($tugas->load('mataKuliah:id,kode,nama'), 201);
    }

    // UPDATE: boleh mengirim sebagian kolom saja, misal { "status": "selesai" }
    public function update(Request $request, int $id): JsonResponse
    {
        $tugas = $this->cariMilikSendiri($request, $id);
        $tugas->update($request->validate($this->aturan(wajib: false), $this->pesan()));

        return response()->json($tugas->load('mataKuliah:id,kode,nama'));
    }

    // DELETE
    public function destroy(Request $request, int $id): Response
    {
        $this->cariMilikSendiri($request, $id)->delete();

        return response()->noContent();
    }

    // Dicari lewat relasi pengguna, jadi tugas milik orang lain dianggap tidak ada (404).
    private function cariMilikSendiri(Request $request, int $id): Tugas
    {
        return $request->user()->tugas()->find($id) ?? abort(404, 'Tugas tidak ditemukan.');
    }

    private function aturan(bool $wajib): array
    {
        $kolomWajib = $wajib ? ['required'] : ['sometimes', 'required'];

        return [
            'judul' => [...$kolomWajib, 'string', 'max:255'],
            'deadline' => [...$kolomWajib, 'date'],
            'deskripsi' => ['sometimes', 'nullable', 'string', 'max:5000'],
            'mata_kuliah_id' => ['sometimes', 'nullable', 'integer', 'exists:mata_kuliah,id'],
            'prioritas' => ['sometimes', 'required', 'in:rendah,sedang,tinggi'],
            'status' => ['sometimes', 'required', 'in:belum,dikerjakan,selesai'],
        ];
    }

    private function pesan(): array
    {
        return [
            'judul.required' => 'Judul wajib diisi.',
            'judul.max' => 'Judul maksimal 255 karakter.',
            'deadline.required' => 'Deadline wajib diisi.',
            'deadline.date' => 'Format deadline tidak valid.',
            'deskripsi.max' => 'Deskripsi maksimal 5000 karakter.',
            'mata_kuliah_id.exists' => 'Mata kuliah tidak ditemukan.',
            'prioritas.in' => 'Prioritas harus rendah, sedang, atau tinggi.',
            'status.in' => 'Status harus belum, dikerjakan, atau selesai.',
        ];
    }
}
