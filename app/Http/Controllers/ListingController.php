<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Listing;
use App\Models\Order;
use App\Models\Card;
use Illuminate\Support\Facades\Auth;

class ListingController extends Controller 
{
    // Esta es la función que te faltaba para que la tienda cargue las cartas
    public function index()
    {
        try {
            // Cargamos: Anuncio -> Carta -> Su Set
            // También el usuario que la vende
            return Listing::with(['card.cardSet', 'user'])
                ->where('is_sold', false)
                ->get();
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $user = Auth::user();
            
            $listing = Listing::create([
                'user_id'   => $user->id,
                'card_id'   => $request->card_id,
                'price'     => $request->price,
                'psa_grade' => $request->psa_grade,
                'is_sold'   => false,
            ]);

            // Quitamos la carta de la colección del usuario
            $user->cards()->detach($request->card_id);

            return response()->json(['message' => 'Gorde da!']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function buyCard(Request $request, $id)
    {
        $listing = Listing::findOrFail($id);
        $buyer = auth()->user(); 

        // 1. Calculamos la XP primero para usarla en ambos sitios
        $xpGained = ($listing->psa_grade >= 9) ? 150 : 50; 
        if (!$listing->psa_grade) $xpGained = 10;

        // 2. CREAR EL REGISTRO DE LA COMPRA (Añadiendo xp_gained)
        $order = Order::create([
            'buyer_id'   => $buyer->id,
            'seller_id'  => $listing->user_id,
            'card_id'    => $listing->card_id,
            'price'      => $listing->price,
            'psa_grade'  => $listing->psa_grade,
            'xp_gained'  => $xpGained, // <--- ESTO ES LO QUE FALTA
        ]);

        // 3. ACTUALIZACIÓN DE XP EN EL USUARIO
        $buyer->addXp($xpGained);

        // 4. MARCAR COMO VENDIDO
        $listing->update(['is_sold' => true]);

        $order->load('card');

        return response()->json([
            'message' => 'Erosketa ondo burutu da!',
            'xp_gained' => $xpGained,
            'order' => $order,
            'user' => $buyer
        ]);
    }
    
}