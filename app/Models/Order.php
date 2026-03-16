<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = ['buyer_id', 'seller_id', 'card_id', 'price', 'psa_grade', 'xp_gained'];

    public function card() {
        return $this->belongsTo(Card::class);
    }

    public function buyer() {
        return $this->belongsTo(User::class, 'buyer_id');
    }
}
