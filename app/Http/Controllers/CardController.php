<?php

namespace App\Http\Controllers; 

use App\Models\Card;
use App\Models\User;
use App\Models\Listing;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; 
use Illuminate\Support\Facades\DB;

class CardController extends Controller
{
    // Muestra la carta individual
    public function show($id)
    {
        $card = Card::find($id);
        if (!$card) return response()->json(['message' => 'Ez da aurkitu'], 404);

        $card->psa_prices = [
            ['grade' => 'Raw', 'price' => $card->price],
            ['grade' => 'PSA 9', 'price' => $card->price * 4],
            ['grade' => 'PSA 10', 'price' => $card->price * 12],
        ];

        return response()->json($card);
    }

    // Corresponde a: POST /api/cards/{id}/collection
    public function toggleCollection(Request $request, $id)
    {
        try {
            $user = Auth::user();
            if (!$user) return response()->json(['error' => 'Saioa hasi gabe'], 401);

            // Buscamos si el usuario ya tiene esta carta en la tabla 'collections'
            $existing = $user->cards()->where('card_id', $id)->first();

            if ($existing) {
                // SI YA EXISTE: Sumamos 1 a la cantidad actual
                $newQuantity = $existing->pivot->quantity + 1;
                
                $user->cards()->updateExistingPivot($id, [
                    'quantity' => $newQuantity
                ]);

                return response()->json([
                    'message' => 'Unitate bat gehiago gehitu da!',
                    'in_collection' => true,
                    'quantity' => $newQuantity
                ]);
            }

            // SI NO EXISTE: La creamos con cantidad 1
            // Laravel usará la tabla 'collections' porque así lo definiste en el modelo User
            $user->cards()->attach($id, ['quantity' => 1, 'is_for_sale' => false]);

            return response()->json([
                'message' => 'Karta bildumara gehitu da',
                'in_collection' => true,
                'quantity' => 1
            ]);
            
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Corresponde a: GET /api/user/collection
    public function getUserCollection(Request $request)
    {
        $user = Auth::user();
        
        $totalEarnings = Order::where('seller_id', $user->id)->sum('price');
        $cards = $user->cards()->withPivot('quantity')->get();
        $boughtCards = Order::where('buyer_id', $user->id)->with('card')->latest()->get();

        return response()->json([
            'cards' => $cards,
            'total_value' => $cards->sum(fn($c) => $c->price * $c->pivot->quantity),
            'active_listings' => Listing::where('user_id', $user->id)->where('is_sold', false)->count(),
            'bought_cards' => $boughtCards,
            'total_earnings' => $totalEarnings,
        ]);
    }

    // Corresponde a: POST /api/cards/{id}/sell
    public function sellCard(Request $request, $id) 
    {
        $user = Auth::user();
        $card = $user->cards()->where('card_id', $id)->first();
        
        if (!$card) {
            return response()->json(['error' => 'Ez duzu karta hau zure bilduman'], 400);
        }

        Listing::create([
            'user_id'   => $user->id,
            'card_id'   => $id,
            'price'     => $request->price,
            'psa_grade' => $request->psa_grade,
            'is_sold'   => false
        ]);

        // Si tiene varias unidades, restamos una. Si tiene una, la quitamos de la colección.
        if ($card->pivot->quantity > 1) {
            $user->cards()->updateExistingPivot($id, ['quantity' => $card->pivot->quantity - 1]);
        } else {
            $user->cards()->detach($id);
        }

        return response()->json(['message' => 'Karta salmentan jarri da!']);
    }

    // Corresponde a: POST /api/listings/{id}/buy
    // MUÉVELA AQUÍ si quieres centralizar todo en CardController


    // Corresponde a: DELETE /api/user/collection/{id}
    public function removeFromCollection($id)
    {
        Auth::user()->cards()->detach($id);
        return response()->json(['message' => 'Kendu da']);
    }
}