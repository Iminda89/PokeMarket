<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\Card;
use Illuminate\Contracts\Auth\MustVerifyEmail;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar_url',
        'xp',    // Asegúrate de que esté aquí
        'level', // Asegúrate de que esté aquí
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Erabiltzailearen karta bilduma.
     */
    public function cards()
    {
        // Asegúrate de que la clase Card existe en App\Models\Card
        return $this->belongsToMany(Card::class, 'collections')
                    ->withPivot('quantity', 'is_for_sale')
                    ->withTimestamps();
    }

  
    public function getXpNextLevelAttribute() {
        // Fórmula: el nivel 1 pide 100, el 2 pide 200, el 3 pide 300... (puedes hacerla más difícil)
        return $this->level * 100; 
    }

    public function addXp($amount) {
        $this->xp += $amount;
        
        // Usamos un bucle por si gana tanta XP que sube varios niveles de golpe
        // Nivel 1: pide 100xp, Nivel 2: pide 200xp, etc.
        while ($this->xp >= ($this->level * 100)) {
            $this->xp -= ($this->level * 100);
            $this->level += 1;
        }

        return $this->save(); // Importante: devolvemos el resultado del guardado
    }

    // Relación para que el perfil pueda leer las compras
    public function orders() {
        return $this->hasMany(Order::class, 'buyer_id');
    }
    public function getAvatarUrlAttribute($value)
    {
        if (!$value) {
            return '/default-avatar.png'; // Ruta a tu imagen por defecto
        }

        // Si la URL ya empieza por http (ej. gravatar o imagen externa), la dejamos así
        if (str_starts_with($value, 'http')) {
            return $value;
        }

        // Si es una ruta local de storage, generamos la URL pública
        return asset('storage/' . $value);
    }
}
