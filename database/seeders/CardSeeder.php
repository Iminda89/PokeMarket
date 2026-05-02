<?php

namespace Database\Seeders;

    use Illuminate\Database\Seeder;
    use App\Models\Card;
    use App\Models\CardSet;

    class CardSeeder extends Seeder
    {
        public function run(): void
        {
            $setMapping = [
                'Base Set'            => ['code' => 'base1',  'total' => 102],
                'Team Rocket'         => ['code' => 'base5',  'total' => 82],
                'Evolving Skies'      => ['code' => 'swsh7',  'total' => 203],
                'Prismatic Evolution' => ['code' => 'sv8pt5', 'total' => 100],
                'Black Bolt'          => ['code' => 'sv4',    'total' => 182], 
                'White Flare'         => ['code' => 'sv4',    'total' => 182], 
            ];

            $exactNames = [
                'Base Set' => [
                    1=>'Alakazam', 2=>'Blastoise', 3=>'Chansey', 4=>'Charizard', 5=>'Clefairy', 6=>'Gyarados',
                    7=>'Hitmonchan', 8=>'Machamp', 9=>'Magneton', 10=>'Mewtwo', 11=>'Nidoking', 12=>'Ninetales',
                    13=>'Poliwrath', 14=>'Raichu', 15=>'Venusaur', 16=>'Zapdos', 17=>'Beedrill', 18=>'Dragonair'
                ],
                'Team Rocket' => [
                    1=>'Dark Alakazam', 2=>'Dark Arbok', 3=>'Dark Blastoise', 4=>'Dark Charizard', 5=>'Dark Dragonite', 6=>'Dark Dugtrio',
                    7=>'Dark Golbat', 8=>'Dark Gyarados', 9=>'Dark Hypno', 10=>'Dark Machamp', 11=>'Dark Magneton', 12=>'Dark Slowbro',
                    13=>'Dark Vileplume', 14=>'Dark Weezing', 15=>'Here Comes Team Rocket!', 16=>'Rocket\'s Sneak Attack', 17=>'Rainbow Energy', 18=>'Dark Alakazam'
                ],
                'Evolving Skies' => [
                    1=>'Pinsir', 2=>'Hoppin', 3=>'Skiploom', 4=>'Jumpluff', 5=>'Seedot', 6=>'Trupius',
                    7=>'Leafeon V', 8=>'Leafeon VMAX', 9=>'Petitli', 10=>'Liligant', 11=>'Dewebble', 12=>'Crustle',
                    13=>'Trevenant V', 14=>'Trevenant VMAX', 15=>'Gossifleur', 16=>'Eidegoss', 17=>'Applin', 18=>'Flareon VMAX'
                ],
                'Prismatic Evolution' => [
                    1=>'Exeggcute', 2=>'Exeggutor', 3=>'Pinsir', 4=>'Budew', 5=>'Leafeon', 6=>'Leafeon EX',
                    7=>'Cottonee', 8=>'Whimsicott', 9=>'Applin', 10=>'Dipplin', 11=>'Hydrapple EX', 12=>'Ogerpho EX',
                    13=>'Flareon', 14=>'Flareon ex', 15=>'Litleo', 16=>'Pyroar', 17=>'Ogerpho EX', 18=>'Slowpoke'
                ],
                'Black Bolt' => [
                    1=>'Surskit', 2=>'Masquerain', 3=>'Frosslass EX', 4=>'Pansago', 5=>'Simisage', 6=>'Dwebble',
                    7=>'Crustle', 8=>'Bounsweet', 9=>'Steenee', 10=>'Blipbug', 11=>'Dottler', 12=>'Orbeetle',
                    13=>'Nymble', 14=>'Nymble', 15=>'Toedscool', 16=>'Toedscool', 17=>'Toedscruel', 18=>'Wo-Chien'
                ],
                'White Flare' => [
                    1=>'Surskit', 2=>'Masquerain', 3=>'Frosslass EX', 4=>'Pansago', 5=>'Simisage', 6=>'Dwebble',
                    7=>'Crustle', 8=>'Bounsweet', 9=>'Steenee', 10=>'Blipbug', 11=>'Dottler', 12=>'Orbeetle',
                    13=>'Nymble', 14=>'Nymble', 15=>'Toedscool', 16=>'Toedscool', 17=>'Toedscruel', 18=>'Wo-Chien'
                ]
            ];

            foreach ($setMapping as $setName => $info) {
                $dbSet = CardSet::where('name', $setName)->first();
                if ($dbSet) {
                    for ($i = 1; $i <= 18; $i++) {
                        Card::create([
                            'card_set_id' => $dbSet->id,
                            'number'      => "{$i}/{$info['total']}",
                            'name'        => $exactNames[$setName][$i] ?? "Card #{$i}",
                            'type'        => 'Pokémon',
                            'rarity'      => ($i <= 10) ? 'Rare Holo' : 'Common',
                            'price'       => rand(10, 200),
                            'image_url'   => "https://images.pokemontcg.io/{$info['code']}/{$i}_hires.png",
                            'collection'  => $setName,
                        ]);
                    }
                }
            }
        }
    }
