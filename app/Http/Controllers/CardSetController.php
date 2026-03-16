<?php

namespace App\Http\Controllers;

use App\Models\CardSet;
use Illuminate\Http\Request;

class CardSetController extends Controller
{
    // Listar todos los sets (para la pantalla principal de Colecciones)
    public function index()
    {
        return response()->json(CardSet::all());
    }

    // Listar las cartas de un set específico
    public function show($id)
    {
        $set = CardSet::with('cards')->findOrFail($id);
        return response()->json($set);
    }
}