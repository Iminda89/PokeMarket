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
     * Modificar un set existente.
     */
    public function updateSet(Request $request, $id)
    {
        $set = CardSet::findOrFail($id);
        
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'sometimes|boolean'
        ]);

        $set->update($request->only(['name', 'description', 'is_active']));

        return response()->json([
            'message' => 'Bilduma ondo eguneratu da.',
            'set' => $set
        ]);
    }

    /**
     * Eliminar un set existente.
     */
    public function destroySet($id)
    {
        $set = CardSet::findOrFail($id);
        
        if ($set->cards()->count() > 0) {
            return response()->json(['message' => 'Ezin da bilduma hau ezabatu, karta batzuk baditu.'], 400);
        }

        $set->delete();
        return response()->json(['message' => 'Bilduma ondo ezabatu da.']);
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

   /**
     * Actualizar una carta existente.
     */
    public function updateCard(Request $request, $id)
    {
        $card = Card::findOrFail($id);

        $request->validate([
            'card_set_id' => 'sometimes|exists:card_sets,id',
            'name' => 'sometimes|string|max:255',
            'number' => 'sometimes|string|max:50',
            'type' => 'nullable|string|max:50',
            'rarity' => 'nullable|string|max:50',
            'price' => 'sometimes|numeric|min:0',
            'image_url' => 'nullable|string',
        ]);

        $data = $request->only([
            'card_set_id', 'name', 'number', 'type', 'rarity', 'price', 'image_url'
        ]);

        // Si el valor de image_url es nulo, lo reemplazamos por un string vacío
        // para evitar el error de restricción de la base de datos.
        if (is_null($data['image_url'])) {
            $data['image_url'] = '';
        }

        $card->update($data);

        return response()->json([
            'message' => 'Karta ondo eguneratu da.',
            'card' => $card
        ]);
    }
    /**
     * Eliminar una carta.
     */
    public function destroyCard($id)
    {
        $card = Card::findOrFail($id);
        $card->delete();

        return response()->json([
            'message' => 'Karta ondo ezabatu da.'
        ]);
    }
}