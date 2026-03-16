<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Registered;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        // 1. Intentar autenticar
        if (Auth::attempt($credentials)) {
            $user = Auth::user();

            // 2. EL BLOQUEO: ¿Ha verificado su email?
            if (!$user->hasVerifiedEmail()) {
                // Si no ha verificado, cerramos la sesión que acaba de abrir attempt
                Auth::logout(); 
                
                return response()->json([
                    'message' => 'Ezin duzu saioa hasi posta elektronikoa berretsi gabe. Begiratu zure sarrera-ontzia.'
                ], 403); // Error 403 = Prohibido
            }

            // 3. Si está verificado, regeneramos sesión y entramos
            $request->session()->regenerate();
            return response()->json([
                'message' => 'Saioa ongi hasi da',
                'user' => $user
            ], 200);
        }

        return response()->json([
            'message' => 'Kredentzialak ez dira zuzenak.'
        ], 401);
    }

    public function register(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
                'password' => ['required', 'string', 'min:8'], // He quitado 'confirmed' para probar
            ]);

            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
            ]);

            event(new Registered($user));

            return response()->json(['message' => 'Erregistroa ongi!'], 201);

        } catch (\Exception $e) {
            // Esto te dirá el error real en el navegador
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}