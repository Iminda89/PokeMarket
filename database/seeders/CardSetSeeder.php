<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CardSetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sets = [
            ['name' => 'Prismatic Evolution'],
            ['name' => 'Black Bolt'],
            ['name' => 'Team Rocket'],
            ['name' => 'Evolving Skies'],
            ['name' => 'White Flare'],
            ['name' => 'Base Set'],
        ];

        foreach ($sets as $set) {
            \App\Models\CardSet::create($set);
        }
    }
}
