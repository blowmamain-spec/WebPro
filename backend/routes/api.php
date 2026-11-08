<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\JadwalController;
use App\Http\Controllers\Api\MataKuliahController;
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
        ->parameters(['jadwal' => 'id']);
});
