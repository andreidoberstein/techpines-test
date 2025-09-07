<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Song>
 */
class SongFactory extends Factory
{
  /**
   * Define the model's default state.
   *
   * @return array<string, mixed>
   */
  public function definition(): array
  {
    return [
      'title' => fake()->sentence(3),
      'youtube_url' => 'https://youtu.be/'.fake()->regexify('[A-Za-z0-9_-]{11}'),
      'position' => null, // por padrão fora do top 5
      'approved_at' => now(),
    ];
  }

  /**
   * Indicate that the song is in top 5.
   * Use with caution - ensure position is unique
   */
  public function top5(int $position = null): static
  {
    return $this->state(fn (array $attributes) => [
      'position' => $position,
    ]);
  }

  /**
   * Indicate that the song is not approved yet.
   */
  public function notApproved(): static
  {
    return $this->state(fn (array $attributes) => [
      'approved_at' => null,
    ]);
  }
}
