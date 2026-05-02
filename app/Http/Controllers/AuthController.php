<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log; // Para depurar si algo falla

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();

            // SEGURIDAD: Solo regenera sesión si la petición permite sesiones (evita el Error 500)
            if ($request->hasSession()) {
                $request->session()->regenerate();
            }
            
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
            // Añadida validación de password_confirmation para que el front no falle
            $data = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
                'password' => ['required', 'string', 'min:8', 'confirmed'], 
            ]);

            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'avatar_url' => null,
                'xp' => 0,
                'level' => 1,
                'role' => 'user',
                'balance' => 5000.00, // Dinero inicial asegurado
            ]);

            return response()->json([
                'message' => 'Erregistroa ongi burutu da!',
                'user' => $user
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error("Error en registro: " . $e->getMessage());
            return response()->json(['error' => 'Errorea erregistratzerakoan.'], 500);
        }
    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        
        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }
        
        return response()->json(['message' => 'Saioa itxi da']);
    }
}