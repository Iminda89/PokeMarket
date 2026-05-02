<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\User;

class MessageController extends Controller
{
    /**
     * Usuario: Obtiene su propio historial de mensajes.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        $messages = Message::where('user_id', $user->id)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($messages->map(function ($msg) use ($user) {
            return [
                'id' => $msg->id,
                'message' => $msg->message,
                'is_from_admin' => $msg->is_from_admin,
                'sender_name' => $msg->is_from_admin ? 'Admin' : $user->name,
                'created_at' => $msg->created_at->format('Y-m-d H:i:s'),
            ];
        }));
    }

    /**
     * Usuario: Envía un nuevo mensaje / ticket.
     */
    public function store(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:1000',
        ]);

        Message::create([
            'user_id' => $request->user()->id,
            'message' => $request->message,
            'is_from_admin' => false,
        ]);

        return response()->json(['message' => 'Mezua ondo bidali da.']);
    }

    /**
     * Admin: Lista los usuarios que han enviado mensajes.
     */
    public function getUsersWithTickets()
    {
        // Obtiene usuarios que han enviado algún mensaje
        $users = User::whereHas('messages')
            ->withCount(['messages as unread_count' => function ($query) {
                $query->where('is_from_admin', false);
            }])
            ->get();

        return response()->json($users);
    }

    /**
     * Admin: Obtiene los mensajes de un usuario específico.
     */
    public function getUserMessages($id)
    {
        $user = User::findOrFail($id);
        
        $messages = Message::where('user_id', $id)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($messages->map(function ($msg) use ($user) {
            return [
                'id' => $msg->id,
                'message' => $msg->message,
                'is_from_admin' => $msg->is_from_admin,
                'sender_name' => $msg->is_from_admin ? 'Admin' : $user->name,
                'created_at' => $msg->created_at->format('Y-m-d H:i:s'),
            ];
        }));
    }

    /**
     * Admin: Envía una respuesta al usuario.
     */
    public function reply(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'message' => 'required|string|max:1000',
        ]);

        Message::create([
            'user_id' => $request->user_id,
            'message' => $request->message,
            'is_from_admin' => true,
        ]);

        return response()->json(['message' => 'Erantzuna ondo bidali da.']);
    }
}