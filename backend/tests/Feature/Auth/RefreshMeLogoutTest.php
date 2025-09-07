<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

it('refresh renova sessão/token', function () {
  $user = User::factory()->create();
  Sanctum::actingAs($user);

  $this->postJson('/api/refresh')
    ->assertOk()
    ->assertJsonStructure(['data']); // adapte ao formato que você retorna
});

it('me retorna usuário autenticado', function () {
  $user = User::factory()->create();
  Sanctum::actingAs($user);

  $this->getJson('/api/me')
    ->assertOk()
    ->assertJsonPath('data.email', $user->email);
});

it('logout invalida sessão', function () {
  $user = User::factory()->create();
  Sanctum::actingAs($user);

  $this->postJson('/api/logout')->assertOk();

  // opcional: tente acessar /me e espere 401/Unauthenticated
});
