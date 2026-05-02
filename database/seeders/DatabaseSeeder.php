<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Card;
use App\Models\Listing;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. LLAMAMOS A LOS SEEDERS DE ESTRUCTURA Y ADMIN
        $this->call([
            AdminUserSeeder::class, // Tu nuevo seeder de admin
            CardSetSeeder::class,   // Los sets de cartas
            CardSeeder::class,      // Las cartas individuales
        ]);

        // 2. CREAR UN VENDEDOR PARA LA TIENDA
        $vendedor = User::factory()->create([
            'name' => 'PokeSeller',
            'email' => 'vendedor@test.com',
            'role' => 'user',
            'email_verified_at' => now(),
        ]);

        // 3. PONER CARTAS A LA VENTA (SHOP)
        $cartas = Card::all();
        if ($cartas->count() > 0) {
            $cantidad = min(15, $cartas->count());
            foreach ($cartas->random($cantidad) as $carta) {
                Listing::create([
                    'user_id'   => $vendedor->id,
                    'card_id'   => $carta->id,
                    'price'     => $carta->price + rand(5, 50),
                    'psa_grade' => rand(7, 10),
                    'is_sold'   => false,
                ]);
            }
        }
    }
}