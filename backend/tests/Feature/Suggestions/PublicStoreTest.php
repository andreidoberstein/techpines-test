<?php

use App\Models\Suggestion;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('permite enviar sugestão pública sem auth', function () {
  $payload = [
    'title' => 'Minha Sugestão',
    'youtube_url' => 'https://www.youtube.com/watch?v=AbcDefGh12_',
    'position' => null,
  ];

  $this->postJson('/api/suggestions', $payload)
    ->assertCreated()
    ->assertJsonPath('status', 'pending');

  $this->assertDatabaseHas('suggestions', [
    'title' => 'Minha Sugestão',
    'status' => 'pending',
  ]);
});
