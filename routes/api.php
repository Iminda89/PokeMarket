<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CardController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ListingController; // <--- Asegúrate de que esta línea esté arriba

// Rutas públicas
Route::get('/cards', [CardController::class, 'index']);
Route::get('/cards/{id}', [CardController::class, 'show']);
Route::get('/listings', [ListingController::class, 'index']);



// Rutas protegidas (Requieren login)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/listings', [ListingController::class, 'store']);

    Route::post('/cards/{id}/collection', [CardController::class, 'toggleCollection']);
    Route::get('/user/collection', [CardController::class, 'getUserCollection']);

    Route::delete('/user/collection/{id}', [CardController::class, 'removeFromCollection']);
    Route::post('/listings/{id}/buy', [ListingController::class, 'buyCard']);
    // Aquí puedes añadir más rutas protegidas como /user/profile, etc.
});
