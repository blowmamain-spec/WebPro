<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Jadwal;
use App\Models\MataKuliah;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\Rule;

class MataKuliahController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(MataKuliah::orderBy('semester')->orderBy('nama')->get());
    }

    // Tiga fungsi di bawah hanya untuk admin, dibatasi di routes/api.php
    public function store(Request $request): JsonResponse
    {
        return response()->json(MataKuliah::create($this->validasi($request)), 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $mataKuliah = $this->cari($id);
        $mataKuliah->update($this->validasi($request, $mataKuliah));

        return response()->json($mataKuliah);
    }

    public function destroy(int $id): Response
    {
        $mataKuliah = $this->cari($id);

        // Jadwal wajib punya mata kuliah, jadi tidak boleh terhapus diam-diam.
        // Tugas, catatan, dan kelompok tetap ada, hanya mata kuliahnya jadi kosong.
        if (Jadwal::where('mata_kuliah_id', $id)->exists()) {
            abort(422, 'Mata kuliah ini masih dipakai di jadwal mahasiswa.');
        }

        $mataKuliah->delete();

        return response()->noContent();
    }

    private function cari(int $id): MataKuliah
    {
        return MataKuliah::find($id) ?? abort(404, 'Mata kuliah tidak ditemukan.');
    }

    private function validasi(Request $request, ?MataKuliah $mataKuliah = null): array
    {
        return $request->validate([
            'kode' => ['required', 'string', 'max:20', Rule::unique('mata_kuliah', 'kode')->ignore($mataKuliah)],
            'nama' => ['required', 'string', 'max:255'],
            'semester' => ['required', 'integer', 'between:1,14'],
            'sks' => ['required', 'integer', 'between:1,8'],
            'kategori' => ['required', 'in:wajib,agama,peminatan_cyber_security,peminatan_digital_innovation,pilihan_bebas'],
        ], [
            'kode.required' => 'Kode wajib diisi.',
            'kode.unique' => 'Kode itu sudah dipakai.',
            'kode.max' => 'Kode maksimal 20 karakter.',
            'nama.required' => 'Nama wajib diisi.',
            'semester.required' => 'Semester wajib diisi.',
            'semester.between' => 'Semester harus antara 1 sampai 14.',
            'sks.required' => 'SKS wajib diisi.',
            'sks.between' => 'SKS harus antara 1 sampai 8.',
            'kategori.required' => 'Kategori wajib dipilih.',
            'kategori.in' => 'Kategori tidak dikenal.',
        ]);
    }
}
