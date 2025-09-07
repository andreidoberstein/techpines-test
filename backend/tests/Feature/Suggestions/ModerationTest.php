<?php

use App\Models\User;
use App\Models\Suggestion;
use App\Models\Song;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

it('lista sugestões pendentes com auth', function () {
  $admin = User::factory()->admin()->create();
  Sanctum::actingAs($admin);
  Suggestion::factory()->count(2)->create();

  $this->getJson('/api/suggestions')
    ->assertOk()
    ->assertJson(fn ($json) => $json
      -> each(fn ($json) => $json
        ->where('status','pending')
        ->etc()
      )
    );
});

it('aprova sugestão -> cria/atualiza Song e marca reviewed', function () {
  $admin = User::factory()->admin()->create();
  Sanctum::actingAs($admin);

  $suggestion = Suggestion::factory()->create([
    'title' => 'Sertanejo X',
    'youtube_url' => 'https://youtu.be/ZZZ12345678',
    'position' => 2,
  ]);

  $this->postJson("/api/suggestions/{$suggestion->id}/approve")
    ->assertOk()
    ->assertJsonPath('suggestion.status', 'approved');

  // espera: exista Song aprovada com mesma URL e position=2
  $this->assertDatabaseHas('songs', [
    'youtube_url' => 'https://youtu.be/ZZZ12345678',
    'position' => 2,
  ]);
});

it('rejeita sugestão', function () {
  $admin = User::factory()->admin()->create();
  Sanctum::actingAs($admin);

  $suggestion = Suggestion::factory()->create();

  $this->postJson("/api/suggestions/{$suggestion->id}/reject")
    ->assertOk()
    ->assertJsonPath('status', 'rejected');
});
