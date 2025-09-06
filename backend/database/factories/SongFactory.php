<?php

namespace Database\Factories;

use App\Models\Song;
use Illuminate\Database\Eloquent\Factories\Factory;

class SongFactory extends Factory
{
  protected $model = Song::class;

  public function definition(): array
  {
    return [
      'title'       => fake()->sentence(3),
      'youtube_url' => 'https://youtu.be/'.fake()->regexify('[A-Za-z0-9_-]{11}'),
      'position'    => null, // por padrão fora do top 5
      'approved_at' => now(),
    ];
  }

  public function top(int $pos): self
  {
    return $this->state(fn () => [
      'position'    => $pos,
      'approved_at' => now(),
    ]);
  }
}
