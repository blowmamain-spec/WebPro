<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MataKuliah;
use Illuminate\Http\JsonResponse;

class MataKuliahController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(MataKuliah::orderBy('semester')->orderBy('nama')->get());
    }
}
