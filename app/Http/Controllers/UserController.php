<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function getUserData()
    {
        $user = Auth::user();
        
        return response()->json([
            'name' => $user->name,
            'email' => $user->email,
            'avatar_url' => $user->avatar ? \Storage::url($user->avatar) : '/images/default-avatar.png',
            // ESTADÍSTICAS REALES:
            'stats' => [
                'totalCards' => $user->cards()->sum('quantity'), // Suma todas las cantidades
                'forSale' => $user->cards()->where('is_for_sale', true)->count(), // Solo las que están a la venta
            ]
        ]);
    }

    public function updateAvatar(Request $request)
    {
        // 1. Validamos que sea una imagen válida
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // máx 2MB
        ]);

        $user = Auth::user();

        // 2. Si ya tenía una foto, borramos la antigua para no llenar el disco
        if ($user->avatar) {
            Storage::delete($user->avatar);
        }

        // 3. Guardamos la nueva imagen en la carpeta 'avatars' dentro de 'public'
        $path = $request->file('avatar')->store('avatars', 'public');

        // 4. Actualizamos la base de datos
        $user->update(['avatar' => $path]);

        return response()->json([
            'message' => 'Profile picture updated successfully!',
            'avatar_url' => Storage::url($path),
        ]);
    }
    public function getUserProfile(Request $request) {
        $user = $request->user();

        return response()->json([
            'user' => $user,
            'stats' => [
                'total_cards' => $user->cards()->sum('quantity'),
                // Contamos solo los anuncios del usuario que NO están vendidos
                'active_listings' => \App\Models\Listing::where('user_id', $user->id)
                                                    ->where('is_sold', false)
                                                    ->count(),
                'collection_value' => $user->cards->sum(fn($c) => $c->price * $c->pivot->quantity),
            ]
        ]);
    }
}