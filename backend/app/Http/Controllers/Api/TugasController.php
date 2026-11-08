<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tugas;
use App\Models\User;
use App\Notifications\PesanAplikasi;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TugasController extends Controller
{
    private const RELASI = ['mataKuliah:id,kode,nama', 'ditugaskanKe:id,name'];

    // READ: hanya tugas pribadi, yang deadline-nya paling dekat di atas.
    // Tugas kelompok diambil lewat GET /kelompok/{id}/tugas.
    public function index(Request $request): JsonResponse
    {
        $tugas = $request->user()->tugas()
            ->whereNull('kelompok_id')
            ->with(self::RELASI)
            ->orderBy('deadline')
            ->get();

        return response()->json($tugas);
    }

    // CREATE
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate(self::aturan(wajib: true), self::pesan());
        $tugas = $request->user()->tugas()->create($data);

        return response()->json($tugas->load(self::RELASI), 201);
    }

    // UPDATE: boleh mengirim sebagian kolom saja, misal { "status": "selesai" }. Berlaku juga untuk tugas kelompok.
    public function update(Request $request, int $id): JsonResponse
    {
        $tugas = $this->cariYangBolehDiubah($request, $id);

        $aturan = self::aturan(wajib: false);
        if ($tugas->kelompok_id) {
            $aturan['ditugaskan_ke'] = ['sometimes', 'nullable', 'integer'];
        }
        $data = $request->validate($aturan, self::pesan());

        $penanggungJawabBaru = $data['ditugaskan_ke'] ?? null;
        if ($tugas->kelompok_id && $penanggungJawabBaru
            && ! $tugas->kelompok->anggota()->whereKey($penanggungJawabBaru)->exists()) {
            abort(422, 'Tugas hanya bisa diberikan ke anggota kelompok.');
        }

        $sebelumnya = $tugas->ditugaskan_ke;
        $tugas->fill($data);

        // Deadline berubah: pengingat boleh dikirim lagi untuk deadline yang baru
        if ($tugas->isDirty('deadline')) {
            $tugas->pengingat_dikirim_pada = null;
        }
        $tugas->save();

        if ($penanggungJawabBaru && $penanggungJawabBaru !== $sebelumnya && $penanggungJawabBaru !== $request->user()->id) {
            User::find($penanggungJawabBaru)?->notify(new PesanAplikasi(
                'kelompok',
                "Kamu ditugaskan mengerjakan \"{$tugas->judul}\"",
                "/kelompok/{$tugas->kelompok_id}",
            ));
        }

        return response()->json($tugas->load(self::RELASI));
    }

    // DELETE
    public function destroy(Request $request, int $id): Response
    {
        $this->cariYangBolehDiubah($request, $id)->delete();

        return response()->noContent();
    }

    // Tugas pribadi milik sendiri, atau tugas di kelompok yang diikuti.
    // Selain itu dianggap tidak ada (404).
    private function cariYangBolehDiubah(Request $request, int $id): Tugas
    {
        $user = $request->user();

        return Tugas::where(fn (Builder $q) => $q
            ->where(fn (Builder $pribadi) => $pribadi->whereNull('kelompok_id')->where('user_id', $user->id))
            ->orWhereIn('kelompok_id', $user->kelompok()->select('kelompok.id')))
            ->find($id) ?? abort(404, 'Tugas tidak ditemukan.');
    }

    public static function aturan(bool $wajib): array
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

    public static function pesan(): array
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
