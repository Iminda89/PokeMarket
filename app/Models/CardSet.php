<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CardSet extends Model
{
    // Esto permite que el Seeder guarde datos en estos campos
    protected $fillable = ['name', 'series', 'release_date', 'logo_url'];

    // Relación: Un Set tiene muchas cartas
    public function cards()
    {
        return $this->hasMany(Card::class);
    }
}