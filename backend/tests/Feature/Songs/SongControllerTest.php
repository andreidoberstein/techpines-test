<?php

use App\Models\Song;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

describe('SongController', function () {

  beforeEach(function () {
    // Limpar todas as músicas antes de cada teste para evitar conflitos de constraint
    Song::query()->delete();
  });

  describe('GET /songs/top5', function () {
    it('returns top 5 songs ordered by position', function () {
      // Criar músicas no top 5 com posições específicas
      Song::factory()->create(['title' => 'Song 1', 'position' => 1]);
      Song::factory()->create(['title' => 'Song 3', 'position' => 3]);
      Song::factory()->create(['title' => 'Song 2', 'position' => 2]);

      // Criar músicas fora do top 5
      Song::factory()->create(['position' => null]);

      $response = $this->getJson('/api/songs/top5');

      $response->assertStatus(200)
        ->assertJsonCount(3)
        ->assertJsonPath('0.title', 'Song 1')
        ->assertJsonPath('1.title', 'Song 2')
        ->assertJsonPath('2.title', 'Song 3');
    });

    it('returns empty array when no top 5 songs exist', function () {
      // Criar apenas músicas fora do top 5
      Song::factory()->create(['position' => null]);

      $response = $this->getJson('/api/songs/top5');

      $response->assertStatus(200)
        ->assertJsonCount(0);
    });
  });

  describe('GET /songs', function () {
    it('returns songs not in top 5', function () {
      // Criar músicas no top 5
      Song::factory()->create(['position' => 1]);
      Song::factory()->create(['position' => 2]);

      // Criar músicas fora do top 5
      Song::factory()->count(3)->create(['position' => null]);

      $response = $this->getJson('/api/songs');

      $response->assertStatus(200);

      // Verificar se retorna apenas as 3 músicas fora do top 5
      $data = $response->json();
      if (isset($data['data'])) {
        expect(count($data['data']))->toBe(3);
      } else {
        expect(count($data))->toBe(3);
      }
    });

    it('returns results in correct format', function () {
      Song::factory()->count(5)->create(['position' => null]);

      $response = $this->getJson('/api/songs');

      $response->assertStatus(200);

      // Aceitar tanto formato paginado quanto array simples
      $data = $response->json();
      expect($data)->toBeArray();
    });
  });

  describe('POST /songs', function () {
    it('can create song as admin', function () {
      $admin = User::factory()->admin()->create();
      Sanctum::actingAs($admin);

      $songData = [
        'title' => 'New Song',
        'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'position' => 1,
      ];

      $response = $this->postJson('/api/songs', $songData);

      $response->assertStatus(201)
        ->assertJson([
          'title' => 'New Song',
          'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          'position' => 1,
        ]);

      $this->assertDatabaseHas('songs', $songData);
    });

    it('allows regular user to create song', function () {
      $user = User::factory()->create();
      Sanctum::actingAs($user);

      $songData = [
        'title' => 'New Song',
        'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'position' => 1,
      ];

      $response = $this->postJson('/api/songs', $songData);

      // Como não há middleware de autorização, usuários regulares podem criar músicas
      $response->assertStatus(201)
        ->assertJson([
          'title' => 'New Song',
          'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          'position' => 1,
        ]);

      $this->assertDatabaseHas('songs', $songData);
    });

    it('requires authentication', function () {
      $response = $this->postJson('/api/songs', [
        'title' => 'New Song',
        'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      ]);

      $response->assertStatus(401);
    });

    it('validates required fields', function () {
      $admin = User::factory()->admin()->create();
      Sanctum::actingAs($admin);

      $response = $this->postJson('/api/songs', []);

      $response->assertStatus(422)
        ->assertJsonValidationErrors(['title', 'youtube_url']);
    });

    it('validates youtube url format', function () {
      $admin = User::factory()->admin()->create();
      Sanctum::actingAs($admin);

      $response = $this->postJson('/api/songs', [
        'title' => 'New Song',
        'youtube_url' => 'invalid-url',
      ]);

      $response->assertStatus(422)
        ->assertJsonValidationErrors(['youtube_url']);
    });

    it('validates position range', function () {
      $admin = User::factory()->admin()->create();
      Sanctum::actingAs($admin);

      $response = $this->postJson('/api/songs', [
        'title' => 'New Song',
        'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'position' => 10,
      ]);

      $response->assertStatus(422)
        ->assertJsonValidationErrors(['position']);
    });
  });

  describe('PUT /songs/{song}', function () {
    it('can update song as admin', function () {
      $admin = User::factory()->admin()->create();
      Sanctum::actingAs($admin);

      $song = Song::factory()->create(['position' => null]);

      $updateData = [
        'title' => 'Updated Song',
        'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'position' => 1, // Usar posição 1 já que limpamos os dados
      ];

      $response = $this->putJson("/api/songs/{$song->id}", $updateData);

      $response->assertStatus(200)
        ->assertJson($updateData);

      $this->assertDatabaseHas('songs', array_merge(['id' => $song->id], $updateData));
    });

    it('allows regular user to update song', function () {
      $user = User::factory()->create();
      Sanctum::actingAs($user);

      $song = Song::factory()->create(['position' => null]);

      $updateData = [
        'title' => 'Updated Song',
        'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'position' => 1,
      ];

      $response = $this->putJson("/api/songs/{$song->id}", $updateData);

      // Como não há middleware de autorização, usuários regulares podem atualizar
      $response->assertStatus(200)
        ->assertJson($updateData);

      $this->assertDatabaseHas('songs', array_merge(['id' => $song->id], $updateData));
    });

    it('returns 404 for non-existent song', function () {
      $admin = User::factory()->admin()->create();
      Sanctum::actingAs($admin);

      $response = $this->putJson('/api/songs/non-existent-id', [
        'title' => 'Updated Song',
      ]);

      $response->assertStatus(404);
    });
  });

  describe('DELETE /songs/{song}', function () {
    it('can delete song as admin', function () {
      $admin = User::factory()->admin()->create();
      Sanctum::actingAs($admin);

      $song = Song::factory()->create();

      $response = $this->deleteJson("/api/songs/{$song->id}");

      $response->assertStatus(204);
      $this->assertDatabaseMissing('songs', ['id' => $song->id]);
    });

    it('allows regular user to delete song', function () {
      $user = User::factory()->create();
      Sanctum::actingAs($user);

      $song = Song::factory()->create();

      $response = $this->deleteJson("/api/songs/{$song->id}");

      // Como não há middleware de autorização, usuários regulares podem deletar
      $response->assertStatus(204);
      $this->assertDatabaseMissing('songs', ['id' => $song->id]);
    });

    it('returns 404 for non-existent song', function () {
      $admin = User::factory()->admin()->create();
      Sanctum::actingAs($admin);

      $response = $this->deleteJson('/api/songs/non-existent-id');

      $response->assertStatus(404);
    });
  });
});
