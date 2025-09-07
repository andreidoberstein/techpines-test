<?php

namespace Database\Seeders;

use App\Models\Song;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class SongSeeder extends Seeder
{
  public function run(): void
  {
    $top5 = [
      [
        'title'       =>  'Herói sem medalha',
        'youtube_url' =>  'https://www.youtube.com/watch?v=-A2RG0dNC68&list=PLdqdRjPNmhNAumj8At-Fn-CGY9hreuKwN&index=20',
        'position'    =>  1
      ],
      [
        'title'       =>  'Boi Soberano',
        'youtube_url' =>  'https://www.youtube.com/watch?v=3ZFO_0PFuHI&list=PLdqdRjPNmhNAumj8At-Fn-CGY9hreuKwN&index=3',
        'position'    =>  2
      ],
      [
        'title'       =>  'Oi paixão',
        'youtube_url' =>  'https://www.youtube.com/watch?v=lKcmac_ee3c&list=PLdqdRjPNmhNAumj8At-Fn-CGY9hreuKwN&index=21',
        'position'    =>  3
      ],
      [
        'title'       =>  'Rei do Gado',
        'youtube_url' =>  'https://www.youtube.com/watch?v=YQHcAQaC6EU&list=PLdqdRjPNmhNAumj8At-Fn-CGY9hreuKwN&index=1',
        'position'     =>  4
      ],
      [
        'title'       =>  'Amor e saudade',
        'youtube_url' =>  'https://www.youtube.com/watch?v=SjLcheCqfwc&list=PLdqdRjPNmhNAumj8At-Fn-CGY9hreuKwN&index=29',
        'position'    =>  5
      ],
    ];

    foreach ($top5 as $row) {
      Song::query()->updateOrCreate(
        [
          'title'       =>  $row['title'],
          'youtube_url' =>  $row['youtube_url'],
          'position'    =>  $row['position'],
          'approved_at' =>  Carbon::now()
        ]
      );
    }

    Song::factory(12)->create();

    // Top 5
//    for ($i=1; $i<=5; $i++) {
//      Song::factory()->top($i)->create([
//        'title' => "TOP {$i} - Tião Carreiro & Pardinho",
//      ]);
//    }
//    // Resto
//    Song::factory(12)->create(); // approved_at set por default

    // 6ª em diante
//    for ($i=0; $i<25; $i++) {
//      $vid = substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'), 0, 11);
//      Song::updateOrCreate(
//        ['video_id'=>$vid],
//        [
//          'title'=>"Outra Moda {$i}",
//          'artist'=>'Tião Carreiro e Pardinho',
//          'youtube_url'=>"https://youtu.be/{$vid}",
//          'is_top5'=>false,
//          'play_count'=>rand(10, 500),
//        ]
//      );
//    }
  }
}
