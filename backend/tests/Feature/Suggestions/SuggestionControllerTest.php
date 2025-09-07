<?php


use App\Models\Suggestion;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

describe('SuggestionController', function () {

  describe('POST /suggestions', function () {
    it('can create suggestion without authentication', function () {
      $suggestionData = [
        'title' => 'New Song Suggestion',
        'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      ];

      $response = $this->postJson('/api/suggestions', $suggestionData);

      $response->assertStatus(201)
        ->assertJson([
          'title' => 'New Song Suggestion',
          'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          'status' => 'pending',
        ]);

      $this->assertDatabaseHas('suggestions', array_merge($suggestionData, [
        'status' => 'pending',
        'user_id' => null,
      ]));
    });

    it('can create suggestion with authentication', function () {
      $user = User::factory()->create();
      Sanctum::actingAs($user);

      $suggestionData = [
        'title' => 'New Song Suggestion',
        'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      ];

      $response = $this->postJson('/api/suggestions', $suggestionData);

      $response->assertStatus(201)
        ->assertJson([
          'title' => 'New Song Suggestion',
          'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          'status' => 'pending',
          'user_id' => $user->id,
        ]);
    });

    it('validates required fields', function () {
      $response = $this->postJson('/api/suggestions', []);

      $response->assertStatus(422)
        ->assertJsonValidationErrors(['title', 'youtube_url']);
    });

    it('validates youtube url format', function () {
      $response = $this->postJson('/api/suggestions', [
        'title' => 'New Song',
        'youtube_url' => 'invalid-url',
      ]);

      $response->assertStatus(422)
        ->assertJsonValidationErrors(['youtube_url']);
    });

    it('validates position range when provided', function () {
      $response = $this->postJson('/api/suggestions', [
        'title' => 'New Song',
        'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'position' => 10,
      ]);

      $response->assertStatus(422)
        ->assertJsonValidationErrors(['position']);
    });
  });

  describe('GET /suggestions', function () {
    it('returns suggestions for admin', function () {
      $admin = User::factory()->admin()->create();
      Sanctum::actingAs($admin);

      Suggestion::factory()->count(5)->create();

      $response = $this->getJson('/api/suggestions');

      $response->assertStatus(200)
        ->assertJsonCount(5);
    });

    it('cannot access suggestions as regular user', function () {
      $user = User::factory()->create();
      Sanctum::actingAs($user);

      $response = $this->getJson('/api/suggestions');

      $response->assertStatus(403);
    });

    it('requires authentication', function () {
      $response = $this->getJson('/api/suggestions');

      $response->assertStatus(401);
    });

    it('returns paginated results', function () {
      $admin = User::factory()->admin()->create();
      Sanctum::actingAs($admin);

      Suggestion::factory()->count(20)->create();

      $response = $this->getJson('/api/suggestions');

      $response->assertStatus(200)
        ->assertJsonStructure([
          'data',
          'links',
          'meta',
        ]);
    });
  });

  describe('POST /suggestions/{id}/approve', function () {
    it('can approve suggestion as admin', function () {
      $admin = User::factory()->admin()->create();
      Sanctum::actingAs($admin);

      $suggestion = Suggestion::factory()->create([
        'status' => 'pending',
      ]);

      $response = $this->postJson("/api/suggestions/{$suggestion->id}/approve", [
        'position' => 3,
      ]);

      $response->assertStatus(200)
        ->assertJson([
          'status' => 'approved',
          'position' => 3,
          'reviewed_by' => $admin->id,
        ]);

      $this->assertDatabaseHas('suggestions', [
        'id' => $suggestion->id,
        'status' => 'approved',
        'position' => 3,
        'reviewed_by' => $admin->id,
      ]);
    });

    it('cannot approve suggestion as regular user', function () {
      $user = User::factory()->create();
      Sanctum::actingAs($user);

      $suggestion = Suggestion::factory()->create();

      $response = $this->postJson("/api/suggestions/{$suggestion->id}/approve");

      $response->assertStatus(403);
    });

    it('validates position when provided', function () {
      $admin = User::factory()->admin()->create();
      Sanctum::actingAs($admin);

      $suggestion = Suggestion::factory()->create();

      $response = $this->postJson("/api/suggestions/{$suggestion->id}/approve", [
        'position' => 10,
      ]);

      $response->assertStatus(422)
        ->assertJsonValidationErrors(['position']);
    });

    it('returns 404 for non-existent suggestion', function () {
      $admin = User::factory()->admin()->create();
      Sanctum::actingAs($admin);

      $response = $this->postJson('/api/suggestions/non-existent-id/approve');

      $response->assertStatus(404);
    });
  });

  describe('POST /suggestions/{id}/reject', function () {
    it('can reject suggestion as admin', function () {
      $admin = User::factory()->admin()->create();
      Sanctum::actingAs($admin);

      $suggestion = Suggestion::factory()->create([
        'status' => 'pending',
      ]);

      $response = $this->postJson("/api/suggestions/{$suggestion->id}/reject");

      $response->assertStatus(200)
        ->assertJson([
          'status' => 'rejected',
          'reviewed_by' => $admin->id,
        ]);

      $this->assertDatabaseHas('suggestions', [
        'id' => $suggestion->id,
        'status' => 'rejected',
        'reviewed_by' => $admin->id,
      ]);
    });

    it('cannot reject suggestion as regular user', function () {
      $user = User::factory()->create();
      Sanctum::actingAs($user);

      $suggestion = Suggestion::factory()->create();

      $response = $this->postJson("/api/suggestions/{$suggestion->id}/reject");

      $response->assertStatus(403);
    });

    it('returns 404 for non-existent suggestion', function () {
      $admin = User::factory()->admin()->create();
      Sanctum::actingAs($admin);

      $response = $this->postJson('/api/suggestions/non-existent-id/reject');

      $response->assertStatus(404);
    });
  });
});
