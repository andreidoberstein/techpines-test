<?php

namespace Database\Seeders;

use App\Models\Song;
use Illuminate\Database\Seeder;

class SongSeeder extends Seeder
{
  public function run(): void
  {
    $top5 = [
      // Exemplo (use os IDs reais das 5 mais tocadas)
      ['title'=>'Pagode em Brasília', 'video_id'=>'ABCDEFGHIJK', 'is_top5'=>true],
      ['title'=>'Boi Soberano',       'video_id'=>'BCDEFGHIJKL', 'is_top5'=>true],
      ['title'=>'Chico Mineiro',      'video_id'=>'CDEFGHIJKLM', 'is_top5'=>true],
      ['title'=>'Rei do Gado',        'video_id'=>'DEFGHIJKLMN', 'is_top5'=>true],
      ['title'=>'Rio de Lágrimas',    'video_id'=>'EFGHIJKLMNO', 'is_top5'=>true],
    ];

    foreach ($top5 as $row) {
      Song::updateOrCreate(
        ['video_id' => $row['video_id']],
        [
          'title' => $row['title'],
          'artist' => 'Tião Carreiro e Pardinho',
          'youtube_url' => "https://youtu.be/{$row['video_id']}",
          'is_top5' => $row['is_top5'],
          'play_count' => rand(1000, 100000),
        ]
      );
    }

    // 6ª em diante
    for ($i=0; $i<25; $i++) {
      $vid = substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'), 0, 11);
      Song::updateOrCreate(
        ['video_id'=>$vid],
        [
          'title'=>"Outra Moda {$i}",
          'artist'=>'Tião Carreiro e Pardinho',
          'youtube_url'=>"https://youtu.be/{$vid}",
          'is_top5'=>false,
          'play_count'=>rand(10, 500),
        ]
      );
    }
  }
}
