<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Suggestion>
 */
class SuggestionFactory extends Factory
{
  /**
   * Define the model's default state.
   *
   * @return array<string, mixed>
   */
  public function definition(): array
  {
    return [
      'user_id' => null,
      'title' => fake()->sentence(3),
      'youtube_url' => 'https://www.youtube.com/watch?v='.fake()->regexify('[A-Za-z0-9_-]{11}'),
      'status' => 'pending',
      'position' => null,
    ];
  }

  /**
   * Indicate that the suggestion has a user.
   */
  public function withUser(): static
  {
    return $this->state(fn (array $attributes) => [
      'user_id' => User::factory(),
    ]);
  }

  /**
   * Indicate that the suggestion is approved.
   */
  public function approved(): static
  {
    return $this->state(fn (array $attributes) => [
      'status' => 'approved',
      'reviewed_by' => User::factory()->admin(),
      'reviewed_at' => now(),
    ]);
  }

  /**
   * Indicate that the suggestion is rejected.
   */
  public function rejected(): static
  {
    return $this->state(fn (array $attributes) => [
      'status' => 'rejected',
      'reviewed_by' => User::factory()->admin(),
      'reviewed_at' => now(),
    ]);
  }

  /**
   * Indicate that the suggestion has a position.
   */
  public function withPosition(int $position = null): static
  {
    return $this->state(fn (array $attributes) => [
      'position' => $position ?? fake()->numberBetween(1, 5),
    ]);
  }
}
