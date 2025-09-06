<?php

namespace Database\Seeders;

use App\Models\Song;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
//      // Top 5
//      for ($i=1; $i<=5; $i++) {
//        Song::factory()->top($i)->create([
//          'title' => "TOP {$i} - Tião Carreiro & Pardinho",
//        ]);
//      }
//      // Resto
//      Song::factory(12)->create(); // approved_at set por default

      User::query()->firstOrCreate(
        ['email' => 'admin@example.com'],
        [
          'name' => 'Admin',
          'password' => 'secret',
          'role' => 'admin',
        ]
      );
    }
}
