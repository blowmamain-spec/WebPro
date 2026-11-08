<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Kelompok;
use App\Models\Tugas;
use App\Models\User;
use App\Notifications\PesanAplikasi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class KelompokController extends Controller
{
    private const RELASI = ['mataKuliah:id,kode,nama', 'anggota:id,name'];

    // READ: kelompok yang anggotanya termasuk pengguna yang login
    public function index(Request $request): JsonResponse
    {
        return response()->json($request->user()->kelompok()->with(self::RELASI)->orderBy('kelompok.id')->get());
    }

    public function show(Request $request, int $id): JsonResponse
    {
        return response()->json($this->cariYangDiikuti($request, $id)->load(self::RELASI));
    }

    // CREATE: pembuat otomatis jadi anggota
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate($this->aturan(wajib: true) + [
            'anggota' => ['sometimes', 'array', 'max:50'],
            'anggota.*' => ['integer', 'exists:users,id'],
        ], $this->pesan());

        $kelompok = new Kelompok($data);
        $kelompok->dibuat_oleh = $request->user()->id;
        $kelompok->save();

        $anggotaLain = collect($data['anggota'] ?? [])->unique()->reject(fn ($id) => $id === $request->user()->id);
        $kelompok->anggota()->attach([$request->user()->id, ...$anggotaLain]);
        $this->kabariAnggotaBaru($kelompok, $anggotaLain->all(), $request->user());

        return response()->json($kelompok->load(self::RELASI), 201);
    }

    // UPDATE: hanya pembuat kelompok
    public function update(Request $request, int $id): JsonResponse
    {
        $kelompok = $this->cariMilikPembuat($request, $id);
        $kelompok->update($request->validate($this->aturan(wajib: false), $this->pesan()));

        return response()->json($kelompok->load(self::RELASI));
    }

    // DELETE: hanya pembuat kelompok. Tugas kelompoknya ikut terhapus.
    public function destroy(Request $request, int $id): Response
    {
        $this->cariMilikPembuat($request, $id)->delete();

        return response()->noContent();
    }

    // Menambah anggota lewat email akunnya. Hanya pembuat kelompok.
    public function tambahAnggota(Request $request, int $id): JsonResponse
    {
        $kelompok = $this->cariMilikPembuat($request, $id);

        $data = $request->validate(
            ['email' => ['required', 'email', 'exists:users,email']],
            [
                'email.required' => 'Email wajib diisi.',
                'email.email' => 'Format email tidak valid.',
                'email.exists' => 'Tidak ada akun dengan email itu.',
            ],
        );

        $anggota = User::where('email', $data['email'])->first();

        if ($kelompok->anggota()->whereKey($anggota->id)->exists()) {
            abort(422, 'Akun itu sudah menjadi anggota.');
        }

        $kelompok->anggota()->attach($anggota->id);
        $this->kabariAnggotaBaru($kelompok, [$anggota->id], $request->user());

        return response()->json($kelompok->load(self::RELASI));
    }

    // Pembuat boleh mengeluarkan anggota, anggota boleh keluar sendiri.
    public function hapusAnggota(Request $request, int $id, int $userId): JsonResponse
    {
        $kelompok = $this->cariYangDiikuti($request, $id);
        $sayaPembuat = $kelompok->dibuat_oleh === $request->user()->id;

        abort_unless($sayaPembuat || $userId === $request->user()->id, 403, 'Hanya pembuat kelompok yang boleh mengeluarkan anggota.');

        if ($userId === $kelompok->dibuat_oleh) {
            abort(422, 'Pembuat kelompok tidak bisa keluar. Hapus kelompoknya kalau sudah tidak dipakai.');
        }

        $kelompok->anggota()->detach($userId);
        // Tugas orang yang keluar kembali jadi belum dibagi
        $kelompok->tugas()->where('ditugaskan_ke', $userId)->update(['ditugaskan_ke' => null]);

        return response()->json($kelompok->load(self::RELASI));
    }

    public function daftarTugas(Request $request, int $id): JsonResponse
    {
        $tugas = $this->cariYangDiikuti($request, $id)->tugas()
            ->with(['mataKuliah:id,kode,nama', 'ditugaskanKe:id,name'])
            ->orderBy('deadline')
            ->get();

        return response()->json($tugas);
    }

    public function tambahTugas(Request $request, int $id): JsonResponse
    {
        $kelompok = $this->cariYangDiikuti($request, $id);

        $data = $request->validate(TugasController::aturan(wajib: true) + [
            'ditugaskan_ke' => ['sometimes', 'nullable', 'integer'],
        ], TugasController::pesan());

        $penanggungJawab = $data['ditugaskan_ke'] ?? null;
        if ($penanggungJawab && ! $kelompok->anggota()->whereKey($penanggungJawab)->exists()) {
            abort(422, 'Tugas hanya bisa diberikan ke anggota kelompok.');
        }

        $tugas = new Tugas(['mata_kuliah_id' => $kelompok->mata_kuliah_id, ...$data]);
        $tugas->user_id = $request->user()->id;
        $kelompok->tugas()->save($tugas);

        if ($penanggungJawab && $penanggungJawab !== $request->user()->id) {
            User::find($penanggungJawab)?->notify(new PesanAplikasi(
                'kelompok',
                "Kamu ditugaskan mengerjakan \"{$tugas->judul}\" di {$kelompok->nama}",
                "/kelompok/{$kelompok->id}",
            ));
        }

        return response()->json($tugas->load(['mataKuliah:id,kode,nama', 'ditugaskanKe:id,name']), 201);
    }

    private function kabariAnggotaBaru(Kelompok $kelompok, array $idAnggota, User $pengundang): void
    {
        foreach (User::whereKey($idAnggota)->get() as $anggota) {
            $anggota->notify(new PesanAplikasi(
                'kelompok',
                "{$pengundang->name} menambahkanmu ke {$kelompok->nama}",
                "/kelompok/{$kelompok->id}",
            ));
        }
    }

    // Kelompok yang tidak diikuti dianggap tidak ada (404).
    private function cariYangDiikuti(Request $request, int $id): Kelompok
    {
        return $request->user()->kelompok()->find($id) ?? abort(404, 'Kelompok tidak ditemukan.');
    }

    private function cariMilikPembuat(Request $request, int $id): Kelompok
    {
        $kelompok = $this->cariYangDiikuti($request, $id);
        abort_unless($kelompok->dibuat_oleh === $request->user()->id, 403, 'Hanya pembuat kelompok yang boleh melakukan ini.');

        return $kelompok;
    }

    private function aturan(bool $wajib): array
    {
        return [
            'nama' => [...($wajib ? ['required'] : ['sometimes', 'required']), 'string', 'max:255'],
            'mata_kuliah_id' => ['sometimes', 'nullable', 'integer', 'exists:mata_kuliah,id'],
        ];
    }

    private function pesan(): array
    {
        return [
            'nama.required' => 'Nama kelompok wajib diisi.',
            'nama.max' => 'Nama kelompok maksimal 255 karakter.',
            'mata_kuliah_id.exists' => 'Mata kuliah tidak ditemukan.',
            'anggota.*.exists' => 'Ada anggota yang akunnya tidak ditemukan.',
        ];
    }
}
