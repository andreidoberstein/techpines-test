<?php

namespace Database\Factories;

use App\Models\Suggestion;
use Illuminate\Database\Eloquent\Factories\Factory;

class SuggestionFactory extends Factory
{
  protected $model = Suggestion::class;

  public function definition(): array
  {
    return [
      'user_id'     => null,
      'title'       => fake()->sentence(3),
      'youtube_url' => 'https://www.youtube.com/watch?v='.fake()->regexify('[A-Za-z0-9_-]{11}'),
      'status'      => 'pending',
      'position'    => null,
    ];
  }

  public function approved(): self
  {
    return $this->state(fn () => ['status' => 'approved', 'reviewed_at' => now()]);
  }

  public function rejected(): self
  {
    return $this->state(fn () => ['status' => 'rejected', 'reviewed_at' => now()]);
  }
}
