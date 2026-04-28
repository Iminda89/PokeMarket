<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@admin.com'], // Si ya existe, lo actualiza
            [
                'name' => 'Administratzailea',
                'password' => Hash::make('administratzailea'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );
    }
}