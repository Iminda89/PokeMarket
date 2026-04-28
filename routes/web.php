<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\AuthController;

// 1. Autenticación (Mantenemos aquí para las cookies de sesión)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// 2. Logout
Route::middleware(['auth:sanctum'])->post('/logout', function (Request $request) {
    Auth::guard('web')->logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return response()->json(['message' => 'Saioa ongi itxi da.']);
});

// 3. El Fallback para React (SIN el name 'login' para evitar bucles)
Route::get('/{any?}', function () {
    return view('welcome');
})->where('any', '^(?!api|sanctum).*$');