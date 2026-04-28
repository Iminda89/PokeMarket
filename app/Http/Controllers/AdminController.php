<?php
namespace App\Http\Controllers;

use App\Models\User;
use App\Models\CardSet;
use App\Models\Card;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Listar todos los usuarios menos el admin actual.
     */
    public function index()
    {
        $users = User::where('id', '!=', auth()->id())
                     ->orderBy('created_at', 'desc')
                     ->get();
                     
        return response()->json($users);
    }

    /**
     * Eliminar un usuario.
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        if ($user->role === 'admin') {
            return response()->json(['message' => 'Ezin duzu beste administratzaile bat ezabatu.'], 403);
        }

        $user->delete();
        return response()->json(['message' => 'Erabiltzailea ondo ezabatu da.']);
    }

    /**
     * Listar los sets con conteo de cartas.
     */
    public function listSets()
    {
        $sets = CardSet::withCount('cards')->get();
        return response()->json($sets);
    }

    /**
     * Alternar visibilidad de un set.
     */
    public function toggleSetStatus($id) 
    {
        $set = CardSet::findOrFail($id);
        $set->is_active = !$set->is_active;
        $set->save();
        
        return response()->json([
            'message' => 'Set-aren egoera aldatu da.',
            'id' => $set->id,
            'is_active' => $set->is_active
        ]);
    }

    /**
     * Crear un nuevo set.
     */
    public function storeSet(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $set = CardSet::create([
            'name' => $request->name,
            'description' => $request->description ?? '',
            'is_active' => true,
        ]);

        return response()->json([
            'message' => 'Bilduma sortu da.',
            'set' => $set
        ], 201);
    }

    /**
     * Crear una nueva carta.
     */
    public function storeCard(Request $request)
    {
        $request->validate([
            'card_set_id' => 'required|exists:card_sets,id',
            'name' => 'required|string|max:255',
            'number' => 'required|string|max:50',
            'type' => 'nullable|string|max:50',
            'rarity' => 'nullable|string|max:50',
            'price' => 'required|numeric|min:0',
            'image_url' => 'nullable|string',
        ]);

        $card = Card::create([
            'card_set_id' => $request->card_set_id,
            'name' => $request->name,
            'number' => $request->number,
            'type' => $request->type,
            'rarity' => $request->rarity,
            'price' => $request->price,
            'image_url' => $request->image_url ?? '',
        ]);

        return response()->json([
            'message' => 'Karta sortu da.',
            'card' => $card
        ], 201);
    }
}