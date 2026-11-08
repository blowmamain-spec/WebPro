<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CatatanController;
use App\Http\Controllers\Api\ChecklistController;
use App\Http\Controllers\Api\JadwalController;
use App\Http\Controllers\Api\KelompokController;
use App\Http\Controllers\Api\MataKuliahController;
use App\Http\Controllers\Api\NotifikasiController;
use App\Http\Controllers\Api\TugasController;
use Illuminate\Support\Facades\Route;

// Dibatasi 10 percobaan per menit supaya password tidak bisa ditebak terus-menerus
Route::middleware('throttle:10,1')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Semua di dalam grup ini butuh header Authorization: Bearer <token>
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'profil']);
    Route::put('/user', [AuthController::class, 'ubahProfil']);

    Route::get('/mata-kuliah', [MataKuliahController::class, 'index']);

    Route::apiResource('jadwal', JadwalController::class)
        ->only(['index', 'store', 'update', 'destroy'])
        ->parameters(['jadwal' => 'id'])
        ->whereNumber('id');

    Route::apiResource('tugas', TugasController::class)
        ->only(['index', 'store', 'update', 'destroy'])
        ->parameters(['tugas' => 'id'])
        ->whereNumber('id');

    Route::apiResource('catatan', CatatanController::class)
        ->parameters(['catatan' => 'id'])
        ->whereNumber('id');

    Route::get('/jelajah', [CatatanController::class, 'jelajah']);
    Route::get('/tersimpan', [CatatanController::class, 'tersimpan']);

    Route::apiResource('checklist', ChecklistController::class)
        ->only(['index', 'store', 'destroy'])
        ->parameters(['checklist' => 'id'])
        ->whereNumber('id');

    Route::apiResource('kelompok', KelompokController::class)
        ->parameters(['kelompok' => 'id'])
        ->whereNumber('id');

    Route::get('/notifikasi', [NotifikasiController::class, 'index']);
    Route::post('/notifikasi/baca-semua', [NotifikasiController::class, 'bacaSemua']);
    Route::post('/notifikasi/{id}/baca', [NotifikasiController::class, 'baca'])->whereUuid('id');

    Route::whereNumber('id')->group(function () {
        Route::post('/catatan/{id}/simpan', [CatatanController::class, 'simpan']);
        Route::delete('/catatan/{id}/simpan', [CatatanController::class, 'batalSimpan']);
        Route::post('/catatan/{id}/laporan', [CatatanController::class, 'laporkan']);

        Route::post('/checklist/{id}/item', [ChecklistController::class, 'tambahItem']);
        Route::put('/checklist-item/{id}', [ChecklistController::class, 'ubahItem']);
        Route::delete('/checklist-item/{id}', [ChecklistController::class, 'hapusItem']);

        Route::post('/kelompok/{id}/anggota', [KelompokController::class, 'tambahAnggota']);
        Route::delete('/kelompok/{id}/anggota/{userId}', [KelompokController::class, 'hapusAnggota'])->whereNumber('userId');
        Route::get('/kelompok/{id}/tugas', [KelompokController::class, 'daftarTugas']);
        Route::post('/kelompok/{id}/tugas', [KelompokController::class, 'tambahTugas']);
    });

    // Hanya admin
    Route::middleware('admin')->group(function () {
        Route::post('/mata-kuliah', [MataKuliahController::class, 'store']);
        Route::put('/mata-kuliah/{id}', [MataKuliahController::class, 'update'])->whereNumber('id');
        Route::delete('/mata-kuliah/{id}', [MataKuliahController::class, 'destroy'])->whereNumber('id');

        Route::prefix('admin')->whereNumber('id')->group(function () {
            Route::get('/ringkasan', [AdminController::class, 'ringkasan']);
            Route::get('/moderasi', [AdminController::class, 'moderasi']);
            Route::post('/catatan/{id}/setujui', [AdminController::class, 'setujui']);
            Route::post('/catatan/{id}/tolak', [AdminController::class, 'tolak']);
            Route::get('/laporan', [AdminController::class, 'daftarLaporan']);
            Route::put('/laporan/{id}', [AdminController::class, 'tindakLanjutiLaporan']);
            Route::get('/kata-terlarang', [AdminController::class, 'daftarKata']);
            Route::post('/kata-terlarang', [AdminController::class, 'tambahKata']);
            Route::delete('/kata-terlarang/{id}', [AdminController::class, 'hapusKata']);
        });
    });
});
