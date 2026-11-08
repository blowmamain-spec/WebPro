<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Catatan;
use App\Models\KataTerlarang;
use App\Models\Laporan;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Str;

class CatatanController extends Controller
{
    // READ: semua catatan milik sendiri, apa pun statusnya
    public function index(Request $request): JsonResponse
    {
        $catatan = $this->query($request)
            ->where('user_id', $request->user()->id)
            ->latest('updated_at')
            ->get();

        return response()->json($catatan);
    }

    // READ satu catatan: milik sendiri, atau milik orang lain yang sudah publik
    public function show(Request $request, int $id): JsonResponse
    {
        $catatan = $this->query($request)
            ->where(fn (Builder $q) => $q->where('user_id', $request->user()->id)->orWhere('status', 'publik'))
            ->find($id);

        return response()->json($catatan ?? abort(404, 'Catatan tidak ditemukan.'));
    }

    // CREATE
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate($this->aturan(wajib: true), $this->pesan());
        $data['isi'] = $data['isi'] ?? '';
        $data['status'] = $this->statusSetelahModerasi(null, $data['status'] ?? 'pribadi', $data['judul'], $data['isi']);

        $catatan = $request->user()->catatan()->create($data);

        return response()->json($this->query($request)->find($catatan->id), 201);
    }

    // UPDATE: boleh mengirim sebagian kolom saja, misal { "status": "publik" } untuk membagikan
    public function update(Request $request, int $id): JsonResponse
    {
        $catatan = $this->cariMilikSendiri($request, $id);

        $data = $request->validate($this->aturan(wajib: false), $this->pesan());
        if (array_key_exists('isi', $data)) {
            $data['isi'] = $data['isi'] ?? '';
        }

        $statusDiminta = $data['status'] ?? ($catatan->status === 'pribadi' ? 'pribadi' : 'publik');
        $data['status'] = $this->statusSetelahModerasi(
            $catatan->status,
            $statusDiminta,
            $data['judul'] ?? $catatan->judul,
            $data['isi'] ?? $catatan->isi,
        );

        $catatan->update($data);

        return response()->json($this->query($request)->find($catatan->id));
    }

    // DELETE
    public function destroy(Request $request, int $id): Response
    {
        $this->cariMilikSendiri($request, $id)->delete();

        return response()->noContent();
    }

    // Catatan publik, bisa disaring dengan ?mata_kuliah_id=&semester=&kategori=&cari=
    public function jelajah(Request $request): JsonResponse
    {
        $filter = $request->validate([
            'mata_kuliah_id' => ['nullable', 'integer'],
            'semester' => ['nullable', 'integer', 'between:1,14'],
            'kategori' => ['nullable', 'string', 'max:40'],
            'cari' => ['nullable', 'string', 'max:100'],
        ]);

        $catatan = $this->query($request)
            ->where('status', 'publik')
            ->when($filter['mata_kuliah_id'] ?? null, fn (Builder $q, $id) => $q->where('mata_kuliah_id', $id))
            ->when($filter['semester'] ?? null, fn (Builder $q, $semester) => $q->whereRelation('mataKuliah', 'semester', $semester))
            ->when($filter['kategori'] ?? null, fn (Builder $q, $kategori) => $q->whereRelation('mataKuliah', 'kategori', $kategori))
            ->when($filter['cari'] ?? null, function (Builder $q, string $cari) {
                // % dan _ punya arti khusus di LIKE, jadi diperlakukan sebagai teks biasa
                $pola = '%'.addcslashes($cari, '\\%_').'%';
                $q->where(fn (Builder $q2) => $q2->whereLike('judul', $pola)->orWhereLike('isi', $pola));
            })
            ->latest()
            ->limit(100)
            ->get();

        return response()->json($catatan);
    }

    // Daftar catatan yang disimpan. Yang sudah tidak publik lagi tidak ikut tampil.
    public function tersimpan(Request $request): JsonResponse
    {
        $catatan = $this->query($request)
            ->where('status', 'publik')
            ->whereRelation('penyimpan', 'users.id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json($catatan);
    }

    public function simpan(Request $request, int $id): Response
    {
        $catatan = $this->cariPublikOrangLain($request, $id);
        $request->user()->catatanTersimpan()->syncWithoutDetaching([$catatan->id]);

        return response()->noContent();
    }

    public function batalSimpan(Request $request, int $id): Response
    {
        $request->user()->catatanTersimpan()->detach($id);

        return response()->noContent();
    }

    public function laporkan(Request $request, int $id): Response
    {
        $catatan = $this->cariPublikOrangLain($request, $id);

        $data = $request->validate(
            ['alasan' => ['required', 'string', 'max:1000']],
            ['alasan.required' => 'Alasan wajib diisi.', 'alasan.max' => 'Alasan maksimal 1000 karakter.'],
        );

        // Satu orang cukup melapor satu kali untuk catatan yang sama
        Laporan::firstOrCreate(
            ['catatan_id' => $catatan->id, 'pelapor_id' => $request->user()->id],
            ['alasan' => $data['alasan']],
        );

        return response()->noContent();
    }

    // Alur status ada di docs/kontrak-data.md
    private function statusSetelahModerasi(?string $statusLama, string $statusDiminta, string $judul, string $isi): string
    {
        // Catatan yang pernah ditolak atau masih diantre harus diputuskan admin dulu.
        // Keduanya tidak tampil ke orang lain, jadi tidak perlu berubah ke `pribadi`.
        // Tanpa aturan ini, penolakan admin bisa dilewati: pribadi dulu, lalu dibagikan ulang.
        if (in_array($statusLama, ['menunggu', 'ditolak'], true)) {
            return $statusDiminta === 'pribadi' ? $statusLama : 'menunggu';
        }

        if ($statusDiminta === 'pribadi') {
            return 'pribadi';
        }

        $kataTerlarang = KataTerlarang::pluck('kata')->all();

        return Str::contains($judul.' '.$isi, $kataTerlarang, ignoreCase: true) ? 'menunggu' : 'publik';
    }

    // Query dasar: relasi yang dikirim ke frontend dan kolom `tersimpan`
    private function query(Request $request): Builder
    {
        return Catatan::query()
            ->with(['penulis:id,name', 'mataKuliah:id,kode,nama,semester'])
            ->withExists(['penyimpan as tersimpan' => fn (Builder $q) => $q->where('users.id', $request->user()->id)]);
    }

    // Dicari lewat relasi pengguna, jadi catatan milik orang lain dianggap tidak ada (404).
    private function cariMilikSendiri(Request $request, int $id): Catatan
    {
        return $request->user()->catatan()->find($id) ?? abort(404, 'Catatan tidak ditemukan.');
    }

    private function cariPublikOrangLain(Request $request, int $id): Catatan
    {
        return Catatan::where('status', 'publik')
            ->where('user_id', '!=', $request->user()->id)
            ->find($id) ?? abort(404, 'Catatan tidak ditemukan.');
    }

    private function aturan(bool $wajib): array
    {
        return [
            'judul' => [...($wajib ? ['required'] : ['sometimes', 'required']), 'string', 'max:255'],
            'isi' => ['sometimes', 'nullable', 'string', 'max:50000'],
            'mata_kuliah_id' => ['sometimes', 'nullable', 'integer', 'exists:mata_kuliah,id'],
            // Hanya dua ini yang boleh diminta. Status lain ditentukan oleh moderasi.
            'status' => ['sometimes', 'required', 'in:pribadi,publik'],
        ];
    }

    private function pesan(): array
    {
        return [
            'judul.required' => 'Judul wajib diisi.',
            'judul.max' => 'Judul maksimal 255 karakter.',
            'isi.max' => 'Isi catatan maksimal 50000 karakter.',
            'mata_kuliah_id.exists' => 'Mata kuliah tidak ditemukan.',
            'status.in' => 'Status harus pribadi atau publik.',
        ];
    }
}
