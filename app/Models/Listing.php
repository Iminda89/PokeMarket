<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Listing extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'card_id', 'price', 'psa_grade', 'is_sold'];

    public function card() {
        return $this->belongsTo(Card::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
}