<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Card extends Model
{
    // Añadimos card_set_id para que Laravel permita guardarlo
   protected $fillable = [
        'card_set_id', 
        'number', // <--- Añade esto aquí
        'name', 
        'type', 
        'rarity', 
        'price', 
        'image_url', 
        'collection'
    ];

    // Relación: Una carta pertenece a un Set
    public function cardSet()
    {
        return $this->belongsTo(CardSet::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'collections');
    }
}