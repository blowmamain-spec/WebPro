<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Checklist;
use App\Models\ChecklistItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ChecklistController extends Controller
{
    // READ: setiap checklist sudah membawa items-nya
    public function index(Request $request): JsonResponse
    {
        $checklist = $request->user()->checklist()
            ->with(['items', 'mataKuliah:id,kode,nama'])
            ->orderBy('id')
            ->get();

        return response()->json($checklist);
    }

    // CREATE
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'judul' => ['required', 'string', 'max:255'],
            'mata_kuliah_id' => ['sometimes', 'nullable', 'integer', 'exists:mata_kuliah,id'],
        ], [
            'judul.required' => 'Judul wajib diisi.',
            'judul.max' => 'Judul maksimal 255 karakter.',
            'mata_kuliah_id.exists' => 'Mata kuliah tidak ditemukan.',
        ]);

        $checklist = $request->user()->checklist()->create($data);

        return response()->json($checklist->load(['items', 'mataKuliah:id,kode,nama']), 201);
    }

    // DELETE: item di dalamnya ikut terhapus
    public function destroy(Request $request, int $id): Response
    {
        $this->cariChecklist($request, $id)->delete();

        return response()->noContent();
    }

    public function tambahItem(Request $request, int $id): JsonResponse
    {
        $checklist = $this->cariChecklist($request, $id);

        $data = $request->validate(
            ['isi' => ['required', 'string', 'max:255']],
            ['isi.required' => 'Isi item wajib diisi.', 'isi.max' => 'Isi item maksimal 255 karakter.'],
        );

        $item = $checklist->items()->create([
            'isi' => $data['isi'],
            'urutan' => ($checklist->items()->max('urutan') ?? 0) + 1,
        ]);

        return response()->json($item, 201);
    }

    // UPDATE item: misal { "selesai": true } atau { "isi": "..." }
    public function ubahItem(Request $request, int $id): JsonResponse
    {
        $item = $this->cariItem($request, $id);

        $item->update($request->validate([
            'isi' => ['sometimes', 'required', 'string', 'max:255'],
            'selesai' => ['sometimes', 'required', 'boolean'],
        ], [
            'isi.required' => 'Isi item wajib diisi.',
            'isi.max' => 'Isi item maksimal 255 karakter.',
        ]));

        return response()->json($item);
    }

    public function hapusItem(Request $request, int $id): Response
    {
        $this->cariItem($request, $id)->delete();

        return response()->noContent();
    }

    // Dicari lewat relasi pengguna, jadi checklist milik orang lain dianggap tidak ada (404).
    private function cariChecklist(Request $request, int $id): Checklist
    {
        return $request->user()->checklist()->find($id) ?? abort(404, 'Checklist tidak ditemukan.');
    }

    private function cariItem(Request $request, int $id): ChecklistItem
    {
        return ChecklistItem::whereRelation('checklist', 'user_id', $request->user()->id)->find($id)
            ?? abort(404, 'Item tidak ditemukan.');
    }
}
