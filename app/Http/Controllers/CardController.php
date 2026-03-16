<?php

namespace App\Http\Controllers; 

use App\Models\Card;
use App\Models\User; // <--- ¡NO OLVIDES ESTA LÍNEA!
use App\Models\Listing; // <--- ¡IMPORTANTE!
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; 
use Illuminate\Support\Facades\Log;


class CardController extends Controller
{
    public function show($id)
    {
        $card = Card::find($id);

        if (!$card) {
            return response()->json(['message' => 'Ez da aurkitu'], 404);
        }

        $card->psa_prices = [
            ['grade' => 'Sin Calificar', 'price' => $card->price, 'volume' => '2/week'],
            ['grade' => 'PSA 9', 'price' => $card->price * 4.5, 'volume' => '1/day'],
            ['grade' => 'PSA 10', 'price' => $card->price * 15.2, 'volume' => '1/month'],
        ];

        return response()->json($card);
    }

    // NUEVA FUNCIÓN: Pégala aquí debajo
    public function toggleCollection(Request $request, $id)
    {
        // Usamos Auth::user() para obtener el usuario de la sesión
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Saioa hasi behar duzu'], 401);
        }

        // Verifica que la relación 'cards' esté definida en el modelo User
        $result = $user->cards()->toggle([
            $id => ['quantity' => 1, 'is_for_sale' => false]
        ]);
        
        $attached = count($result['attached']) > 0;

        return response()->json([
            'message' => $attached ? 'Karta bildumara gehitu da' : 'Karta bildumatik kendu da'
        ]);
    }

    public function getUserCollection(Request $request)
    {
        $user = $request->user();
        
        // 1. Calcular dinero ganado (Suma de precios donde el usuario es el vendedor)
        $totalEarnings = \App\Models\Order::where('seller_id', $user->id)
                            ->sum('price');

        // 2. Obtener las cartas en propiedad
        $cards = $user->cards()->withPivot('quantity')->get();

        // 3. Obtener el historial de compras
        $boughtCards = \App\Models\Order::where('buyer_id', $user->id)
                            ->with(['card.cardSet'])
                            ->latest()
                            ->get();

        return response()->json([
            'cards' => $cards,
            'total_value' => $cards->sum(fn($c) => $c->price * $c->pivot->quantity),
            'active_listings' => \App\Models\Listing::where('user_id', $user->id)->where('is_sold', false)->count(),
            'bought_cards' => $boughtCards,
            'total_earnings' => $totalEarnings, // <--- Enviamos el nuevo dato
            'user' => $user
        ]);
    }

    public function removeFromCollection($id)
    {
        $user = auth()->user();
        // detach elimina la relación en la tabla pivot
        $user->cards()->detach($id);

        return response()->json([
            'message' => 'Karta bildumatik kendu da',
            'total' => $user->cards()->count()
        ]);
    }

    public function sellCard(Request $request, $cardId) 
    {
        try {
            $user = Auth::user();
            
            // 1. Verificar que tiene la carta en la tabla pivot 'collections'
            $collectionItem = $user->cards()->where('card_id', $cardId)->first();
            
            if (!$collectionItem) {
                return response()->json(['error' => 'Ez duzu karta hau zure bilduman'], 400);
            }

            // 2. Crear el anuncio
            Listing::create([
                'user_id'   => $user->id,
                'card_id'   => $cardId,
                'price'     => $request->price,
                'psa_grade' => $request->psa_grade,
                'is_sold'   => false
            ]);

            // 3. Lógica inteligente: Si tiene más de una, resta una. Si solo tiene una, elimina.
            if ($collectionItem->pivot->quantity > 1) {
                $user->cards()->updateExistingPivot($cardId, [
                    'quantity' => $collectionItem->pivot->quantity - 1
                ]);
            } else {
                $user->cards()->detach($cardId);
            }

            return response()->json(['message' => 'Karta salmentan jarri da!']);

        } catch (\Exception $e) {
            return response()->json(['error' => $e.getMessage()], 500);
        }
    }
}