<?php
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\CardController;
use App\Http\Controllers\ListingController;
use App\Http\Controllers\CardSetController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;

/*
|--------------------------------------------------------------------------
| API Routes - PokeMarket
|--------------------------------------------------------------------------
*/


// --- 1. RUTA DE VERIFICACIÓN (Protegida) ---
// Es mejor que esté aquí para que Sanctum intente leer la cookie.
Route::middleware('auth:sanctum')->get('/user-check', [UserController::class, 'getUserProfile']);

// --- 2. RUTAS PÚBLICAS (Catálogo) ---
Route::get('/cards', [CardController::class, 'index']);
Route::get('/cards/{id}', [CardController::class, 'show']);
Route::get('/listings', [ListingController::class, 'index']);
Route::get('/sets', [CardSetController::class, 'index']);
Route::get('/sets/{id}', [CardSetController::class, 'show']);

// --- 3. RUTAS PROTEGIDAS (Usuario Normal) ---
Route::middleware(['auth:sanctum'])->group(function () {
    
    // Perfil y Datos
    Route::get('/user/profile', [UserController::class, 'getUserProfile']);
    Route::post('/user/avatar', [UserController::class, 'updateAvatar']);

    // Mercado
    Route::post('/listings/{id}/buy', [ListingController::class, 'buyCard']);
    Route::post('/listings', [ListingController::class, 'store']);

    // Inventario
    Route::get('/user/collection', [CardController::class, 'getUserCollection']);
    Route::post('/cards/{id}/collection', [CardController::class, 'toggleCollection']);
    Route::delete('/user/collection/{id}', [CardController::class, 'removeFromCollection']);
});

// --- 4. RUTAS DE ADMINISTRACIÓN ---
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    
    // Gestión de Usuarios
    Route::get('/users', [AdminController::class, 'index']);
    Route::delete('/users/{id}', [AdminController::class, 'destroy']);

    // Gestión de Sets
    Route::get('/sets', [AdminController::class, 'listSets']);
    Route::post('/sets', [App\Http\Controllers\AdminController::class, 'storeSet']); // <-- NUEVO: Crear Set
    Route::patch('/sets/{id}/toggle', [AdminController::class, 'toggleSetStatus']);
    
    // Gestión de Cartas
    Route::post('/cards', [App\Http\Controllers\AdminController::class, 'storeCard']); // <-- NUEVO: Crear Carta
    
}); // <-- Asegúrate de que este punto y coma final esté ahí
