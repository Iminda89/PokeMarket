<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            // El que compra
            $table->foreignId('buyer_id')->constrained('users')->onDelete('cascade');
            // El que vende
            $table->foreignId('seller_id')->constrained('users')->onDelete('cascade');
            // La carta comprada
            $table->foreignId('card_id')->constrained('cards');
            
            $table->decimal('price', 10, 2);
            $table->integer('psa_grade')->nullable();
            $table->integer('xp_gained'); // Guardamos cuánta XP dio esta compra
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
