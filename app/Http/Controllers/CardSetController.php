<?php

namespace App\Http\Controllers;

use App\Models\CardSet;
use Illuminate\Http\Request;

class CardSetController extends Controller
{
    // Listar solo los sets activos (para la pantalla principal de Colecciones)
    public function index()
    {
        // Filtramos para que solo devuelva los sets que estén activos
        $sets = CardSet::where('is_active', true)->get();

        return response()->json($sets);
    }

    // Listar las cartas de un set específico
    public function show($id)
    {
        $set = CardSet::with('cards')->findOrFail($id);
        return response()->json($set);
    }
}