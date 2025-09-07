<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

it('lista usuários com auth', function () {
  $admin = User::factory()->admin()->create();
  Sanctum::actingAs($admin);

  User::factory()->count(2)->create();

  $this->getJson('/api/users')
    ->assertOk()
    ->assertJson(fn ($json) => $json->has('data'));
});

it('cria usuário com auth', function () {
  $admin = User::factory()->admin()->create();
  Sanctum::actingAs($admin);

  $payload = [
    'name' => 'Novo',
    'email' => 'novo@example.com',
    'password' => 'secret123',
    'role' => 'user',
  ];

  $this->postJson('/api/users', $payload)
    ->assertCreated()
    ->assertJsonPath('data.email', 'novo@example.com');

  $this->assertDatabaseHas('users', ['email' => 'novo@example.com']);
});

it('atualiza usuário', function () {
  $admin = User::factory()->admin()->create();
  Sanctum::actingAs($admin);

  $u = User::factory()->create(['name' => 'Old']);

  $this->putJson("/api/users/{$u->id}", ['name' => 'New'])
    ->assertOk()
    ->assertJsonPath('data.name', 'New');
});

it('deleta usuário', function () {
  $admin = User::factory()->admin()->create();
  Sanctum::actingAs($admin);

  $u = User::factory()->create();

  $this->deleteJson("/api/users/{$u->id}")
    ->assertNoContent();

  $this->assertDatabaseMissing('users', ['id' => $u->id]);
});
