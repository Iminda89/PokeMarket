<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CardSetController;
// Importante añadir este para la verificación
use Illuminate\Foundation\Auth\EmailVerificationRequest; 

/*
|--------------------------------------------------------------------------
| API & Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/api/sets', [CardSetController::class, 'index']);
Route::get('/api/sets/{id}', [CardSetController::class, 'show']);

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::get('/user-data', function () {
    if (Auth::check()) {
        return response()->json(Auth::user()); 
    }
    return response()->json(['message' => 'Not logged in'], 401);
});

/*
|--------------------------------------------------------------------------
| Email Verification Routes (Sprint 3 Requisite)
|--------------------------------------------------------------------------
*/

// 1. Aviso de que debe verificar (esto evita el error 500)
Route::get('/email/verify', function () {
    return response()->json(['message' => 'Egiaztatu zure posta elektronikoa.'], 403);
})->name('verification.notice');

// 2. La ruta mejorada (Sin middleware restrictivo para que funcione siempre)
Route::get('/email/verify/{id}/{hash}', function (Request $request, $id, $hash) {
    $user = \App\Models\User::findOrFail($id);

    // Verificamos que el hash sea correcto por seguridad
    if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
        return response()->json(['message' => 'Esteka ez da baliozkoa.'], 403);
    }

    // Si no está verificado, lo verificamos ahora
    if (!$user->hasVerifiedEmail()) {
        $user->markEmailAsVerified();
        event(new \Illuminate\Auth\Events\Verified($user));
    }

    // Redirigimos a tu Dashboard de React
    return redirect('http://localhost:8000/dashboard?verified=1'); 
})->name('verification.verify');

// 3. Reenviar email (mantenemos auth porque aquí ya está dentro de la app)
Route::post('/email/verification-notification', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();
    return response()->json(['message' => 'Emaila berriro bidali da!']);
})->middleware(['auth', 'throttle:6,1'])->name('verification.send');


/*
|--------------------------------------------------------------------------
| Protected Routes (Solo usuarios logueados y VERIFICADOS)
|--------------------------------------------------------------------------
*/

// Hemos añadido 'verified' a la lista de middleware
Route::middleware(['auth', 'verified'])->group(function () {
    
    // Aquí dentro solo entra gente que ha confirmado su email
    Route::post('/user/avatar', [UserController::class, 'updateAvatar']);

    // Si quieres proteger también el acceso al Dashboard desde Laravel:
    Route::get('/dashboard', function () {
        return view('welcome');
    });

    Route::post('/logout', function (Request $request) {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json(['message' => 'Saioa ongi itxi da']);
    });
});

/*
|--------------------------------------------------------------------------
| React Router & Fallback
|--------------------------------------------------------------------------
*/

// Esta ruta debe ser la última para no pisar a las demás
Route::get('/{any?}', function () {
    return view('welcome');
})->where('any', '.*')->name('login');