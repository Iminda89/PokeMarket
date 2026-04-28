<?php

namespace App\Models;

// Ya no necesitamos MustVerifyEmail ni las clases de Mail
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\Card;
use App\Models\Order;

class User extends Authenticatable 
{
    use HasFactory, Notifiable;

        protected $fillable = [
        'name',
        'email',
        'password',
        'level',   // Añadir esto
        'xp',      // Añadir esto
        'balance', // Añadir esto
        'role',
        'avatar_url',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            // Mantenemos el cast por si la base de datos tiene la columna, pero no se usará obligatoriamente
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Relación con la colección de cartas.
     */
    public function cards()
    {
        return $this->belongsToMany(Card::class, 'collections')
                    ->withPivot('quantity', 'is_for_sale')
                    ->withTimestamps();
    }

    /**
     * Atributo dinámico para saber cuánto falta para el siguiente nivel.
     */
    public function getXpNextLevelAttribute() {
        return $this->level * 100; 
    }

    /**
     * Lógica para añadir experiencia y subir de nivel.
     */
    public function addXp($amount) {
        $this->xp += $amount;
        
        while ($this->xp >= ($this->level * 100)) {
            $this->xp -= ($this->level * 100);
            $this->level += 1;
        }

        return $this->update([
            'xp' => $this->xp,
            'level' => $this->level
        ]);
    }

    /**
     * Relación con los pedidos (como comprador).
     */
    public function orders() {
        return $this->hasMany(Order::class, 'buyer_id');
    }

    /**
     * Accesor para la URL del avatar.
     */
    public function getAvatarUrlAttribute($value)
    {
        if (!$value) {
            return asset('images/default-avatar.png'); // Asegúrate de tener esta imagen
        }
        if (str_starts_with($value, 'http')) {
            return $value;
        }
        return asset('storage/' . $value);
    }

    // Hemos eliminado el método sendEmailVerificationNotification()
}