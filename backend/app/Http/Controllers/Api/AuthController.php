<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'nim' => ['required', 'string', 'max:20', 'unique:users,nim'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'max:72'],
            'semester' => ['required', 'integer', 'between:1,14'],
        ], [
            'name.required' => 'Nama wajib diisi.',
            'nim.required' => 'NIM wajib diisi.',
            'nim.unique' => 'NIM sudah terdaftar.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah dipakai.',
            'password.required' => 'Password wajib diisi.',
            'password.min' => 'Password minimal 8 karakter.',
            'semester.required' => 'Semester wajib diisi.',
            'semester.between' => 'Semester harus antara 1 sampai 14.',
        ]);

        $user = User::create($data);

        return response()->json(['token' => $this->buatToken($user), 'user' => $user], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ], [
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'password.required' => 'Password wajib diisi.',
        ]);

        $user = User::where('email', $data['email'])->first();

        // Pesannya sama untuk email dan password, supaya orang tidak bisa menebak email mana yang terdaftar.
        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages(['email' => 'Email atau password salah.']);
        }

        return response()->json(['token' => $this->buatToken($user), 'user' => $user]);
    }

    public function logout(Request $request): Response
    {
        $request->user()->currentAccessToken()->delete();

        return response()->noContent();
    }

    public function profil(Request $request): JsonResponse
    {
        return response()->json($request->user());
    }

    public function ubahProfil(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'nim' => ['sometimes', 'required', 'string', 'max:20', 'unique:users,nim,'.$user->id],
            'semester' => ['sometimes', 'required', 'integer', 'between:1,14'],
        ], [
            'name.required' => 'Nama wajib diisi.',
            'nim.required' => 'NIM wajib diisi.',
            'nim.unique' => 'NIM sudah terdaftar.',
            'semester.between' => 'Semester harus antara 1 sampai 14.',
        ]);

        $user->update($data);

        return response()->json($user);
    }

    private function buatToken(User $user): string
    {
        return $user->createToken('web', ['*'], now()->addDays(7))->plainTextToken;
    }
}
