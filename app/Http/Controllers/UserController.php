<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\Listing;

class UserController extends Controller
{
    /**
     * Devuelve los datos básicos del usuario y estadísticas rápidas.
     */
    public function getUserData()
    {
        $user = Auth::user();
        
        return response()->json([
            'name' => $user->name,
            'email' => $user->email,
            'balance' => $user->balance,
            // Usamos el atributo del modelo que ya gestiona la lógica del default
            'avatar_url' => $user->avatar_url, 
            'level' => $user->level,
            'xp' => $user->xp,
            'xp_next_level' => $user->xp_next_level,
            'stats' => [
                'totalCards' => (int) $user->cards()->sum('quantity'),
                'activeListings' => Listing::where('user_id', $user->id)->where('is_sold', false)->count(),
            ]
        ]);
    }

    /**
     * Procesa la subida del avatar.
     */
    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = Auth::user();

        // Borrar avatar antiguo si existe (usando el valor crudo de la DB)
        if ($user->getRawOriginal('avatar_url')) {
            Storage::disk('public')->delete($user->getRawOriginal('avatar_url'));
        }

        // Guardar el nuevo
        $path = $request->file('avatar')->store('avatars', 'public');

        // Actualizar con el nombre de columna correcto
        $user->update(['avatar_url' => $path]);

        return response()->json([
            'message' => 'Profila ongi eguneratu da!',
            'avatar_url' => Storage::url($path),
        ]);
    }

    /**
     * Devuelve el perfil completo y las estadísticas.
     * Este será el endpoint principal para React.
     */
    public function getUserProfile(Request $request) {
        $user = $request->user(); // Sanctum ya pilla al usuario aquí si el middleware está puesto

        if (!$user) {
            return response()->json(['message' => 'Saioa hasi gabe'], 401);
        }

        // Estadísticas optimizadas
        $totalCards = (int) \DB::table('collections')->where('user_id', $user->id)->sum('quantity');
        $activeListings = \App\Models\Listing::where('user_id', $user->id)
                                            ->where('is_sold', false)
                                            ->count();

        // Devolvemos el usuario en la raíz para que React lo asimile directamente
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'balance' => (float) $user->balance, // Forzamos float para evitar strings
            'avatar_url' => $user->avatar_url,
            'level' => $user->level,
            'xp' => $user->xp,
            'xp_next_level' => $user->xp_next_level,
            'total_cards' => $totalCards,
            'active_listings' => $activeListings,
        ]);
    }

    /**
     * Eguneratu erabiltzailearen izena eta posta elektronikoa.
     */
    public function update(Request $request)
    {
        $user = $request->user();
        
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        return response()->json([
            'message' => 'Datuak ondo gorde dira.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'balance' => (float) $user->balance,
                'avatar_url' => $user->avatar_url,
                'level' => $user->level,
                'xp' => $user->xp,
                'xp_next_level' => $user->xp_next_level,
            ]
        ]);
    }
}