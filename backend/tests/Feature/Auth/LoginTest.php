<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('permite login e retorna token/usuário', function () {
  $user = User::factory()->create(['password' => bcrypt('secret')]);

  $res = $this->postJson('/api/login', [
    'email' => $user->email,
    'password' => 'secret',
  ]);

  $res->assertOk()
    ->assertJsonStructure([
      'data' => [
        'user' => ['id','name','email','role'],
        // dependendo da sua implementação, pode ser 'token', 'access_token', etc.
      ]
    ]);
});

it('falha login com credenciais inválidas', function () {
  $res = $this->postJson('/api/login', [
    'email' => 'x@y.com',
    'password' => 'nope',
  ]);

  $res->assertUnauthorized();
});
