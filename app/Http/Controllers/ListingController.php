<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Listing;
use App\Models\Order;
use App\Models\Card;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ListingController extends Controller 
{
    /**
     * Muestra todas las cartas a la venta (El Mercado)
     */
    public function index()
    {
        try {
            return Listing::with(['card.cardSet', 'user'])
                ->where('is_sold', false)
                ->latest()
                ->get();
        } catch (\Exception $e) {
            return response()->json(['error' => 'Errorea merkatua kargatzean'], 500);
        }
    }

    /**
     * Poner una carta a la venta (Crear anuncio)
     */
    public function store(Request $request)
    {
        $request->validate([
            'card_id' => 'required|exists:cards,id',
            'price' => 'required|numeric|min:0.5',
            // Si envías "PSA 10" desde React, quita la validación 'integer' 
            // o limpia el string antes de validar.
            'psa_grade' => 'nullable' 
        ]);

        return DB::transaction(function () use ($request) {
            $user = Auth::user();
            
            // Buscamos la carta en la colección del usuario
            $hasCard = $user->cards()->where('card_id', $request->card_id)->first();
            
            if (!$hasCard) {
                return response()->json(['error' => 'Ez duzu karta hau zure bilduman'], 403);
            }

            // Creamos el anuncio
            $listing = Listing::create([
                'user_id'   => $user->id,
                'card_id'   => $request->card_id,
                'price'     => $request->price,
                'psa_grade' => $request->psa_grade,
                'is_sold'   => false,
            ]);

            // Restamos 1 de la colección
            $currentQty = $hasCard->pivot->quantity;
            if ($currentQty > 1) {
                $user->cards()->updateExistingPivot($request->card_id, [
                    'quantity' => $currentQty - 1
                ]);
            } else {
                $user->cards()->detach($request->card_id);
            }

            return response()->json([
                'message' => 'Karta merkatuan jarri da!', 
                'listing' => $listing
            ]);
        });
    }
    /**
     * Ejecutar la compra de una carta
     */
    public function buyCard(Request $request, $id)
    {
        return DB::transaction(function () use ($id) {
            $listing = Listing::findOrFail($id);
            $buyer = Auth::user(); 
            $seller = $listing->user; // Necesitamos al vendedor para darle su dinero

            if ($listing->is_sold) {
                return response()->json(['error' => 'Karta hau jada salduta dago'], 400);
            }

            if ($listing->user_id === $buyer->id) {
                return response()->json(['error' => 'Ezin duzu zure karta propioa erosi'], 400);
            }

            // --- NUEVA LÓGICA DE DINERO ---
            if ($buyer->balance < $listing->price) {
                return response()->json(['error' => 'Ez duzu nahiko diru erosketa hau egiteko'], 400);
            }

            // Restamos al comprador y sumamos al vendedor
            $buyer->balance -= $listing->price;
            $seller->balance += $listing->price;

            $buyer->save();
            $seller->save();
            // ------------------------------

            $gradeValue = (int) filter_var($listing->psa_grade, FILTER_SANITIZE_NUMBER_INT);
            $xpGained = ($gradeValue >= 9) ? 150 : (($gradeValue > 0) ? 50 : 10);

            // 2. Crear el registro de la orden
            $order = Order::create([
                'buyer_id'   => $buyer->id,
                'seller_id'  => $listing->user_id,
                'card_id'    => $listing->card_id,
                'price'      => $listing->price,
                'psa_grade'  => $listing->psa_grade,
                'xp_gained'  => $xpGained,
            ]);

            // 3. Entregar la carta al comprador
            $existingInCollection = $buyer->cards()->where('card_id', $listing->card_id)->first(); 
            if ($existingInCollection) {
                $buyer->cards()->updateExistingPivot($listing->card_id, [
                    'quantity' => $existingInCollection->pivot->quantity + 1
                ]);
            } else {
                $buyer->cards()->attach($listing->card_id, [
                    'quantity' => 1,
                    'is_for_sale' => false 
                ]);
            }

            // 4. Actualizar XP
            $buyer->addXp($xpGained);

            $buyer->refresh(); 
            $listing->update(['is_sold' => true]);

            return response()->json([
                'message' => 'Erosketa ondo burutu da!',
                'xp_gained' => $xpGained,
                'order' => $order->load('card'),
                'user' => $buyer 
            ]);
        });
    }
}