<?php


use App\Models\User;
use Laravel\Sanctum\Sanctum;

describe('UserController', function () {

  describe('GET /users', function () {
    it('returns users list for admin', function () {
      $admin = User::factory()->admin()->create();
      Sanctum::actingAs($admin);

      User::factory()->count(5)->create();

      $response = $this->getJson('/api/users');

      $response->assertStatus(200)
        ->assertJsonCount(6); // 5 created + 1 admin
    });

    it('cannot access users as regular user', function () {
      $user = User::factory()->create();
      Sanctum::actingAs($user);

      $response = $this->getJson('/api/users');

      $response->assertStatus(403);
    });

    it('requires authentication', function () {
      $response = $this->getJson('/api/users');

      $response->assertStatus(401);
    });

    it('returns paginated results', function () {
      $admin = User::factory()->admin()->create();
      Sanctum::actingAs($admin);

      User::factory()->count(20)->create();

      $response = $this->getJson('/api/users');

      $response->assertStatus(200)
        ->assertJsonStructure([
          'data',
          'links',
          'meta',
        ]);
    });
  });

  describe('POST /users', function () {
    it('can create user as admin', function () {
      $admin = User::factory()->admin()->create();
      Sanctum::actingAs($admin);

      $userData = [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'password123',
        'role' => 'user',
      ];

      $response = $this->postJson('/api/users', $userData);

      $response->assertStatus(201)
        ->assertJson([
          'name' => 'John Doe',
          'email' => 'john@example.com',
          'role' => 'user',
        ])
        ->assertJsonMissing(['password']);

      $this->assertDatabaseHas('users', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'role' => 'user',
      ]);
    });

    it('cannot create user as regular user', function () {
      $user = User::factory()->create();
      Sanctum::actingAs($user);

      $response = $this->postJson('/api/users', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'password123',
      ]);

      $response->assertStatus(403);
    });

    it('requires authentication', function () {
      $response = $this->postJson('/api/users', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'password123',
      ]);

      $response->assertStatus(401);
    });

    it('validates required fields', function () {
      $admin = User::factory()->admin()->create();
      Sanctum::actingAs($admin);

      $response = $this->postJson('/api/users', []);

      $response->assertStatus(422)
        ->assertJsonValidationErrors(['name', 'email', 'password']);
    });

    it('validates email format', function () {
      $admin = User::factory()->admin()->create();
      Sanctum::actingAs($admin);

      $response = $this->postJson('/api/users', [
        'name' => 'John Doe',
        'email' => 'invalid-email',
        'password' => 'password123',
      ]);

      $response->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
    });

    it('validates unique email', function () {
      $admin = User::factory()->admin()->create();
      $existingUser = User::factory()->create(['email' => 'existing@example.com']);
      Sanctum::actingAs($admin);

      $response = $this->postJson('/api/users', [
        'name' => 'John Doe',
        'email' => 'existing@example.com',
        'password' => 'password123',
      ]);

      $response->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
    });

    it('validates password minimum length', function () {
      $admin = User::factory()->admin()->create();
      Sanctum::actingAs($admin);

      $response = $this->postJson('/api/users', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => '123',
      ]);

      $response->assertStatus(422)
        ->assertJsonValidationErrors(['password']);
    });
  });

  describe('PUT /users/{user}', function () {
    it('can update user as admin', function () {
      $admin = User::factory()->admin()->create();
      $user = User::factory()->create();
      Sanctum::actingAs($admin);

      $updateData = [
        'name' => 'Updated Name',
        'email' => 'updated@example.com',
        'role' => 'admin',
      ];

      $response = $this->putJson("/api/users/{$user->id}", $updateData);

      $response->assertStatus(200)
        ->assertJson($updateData);

      $this->assertDatabaseHas('users', array_merge(['id' => $user->id], $updateData));
    });

    it('can update user password', function () {
      $admin = User::factory()->admin()->create();
      $user = User::factory()->create();
      Sanctum::actingAs($admin);

      $response = $this->putJson("/api/users/{$user->id}", [
        'name' => $user->name,
        'email' => $user->email,
        'password' => 'newpassword123',
      ]);

      $response->assertStatus(200);

      // Verify password was updated by checking if we can login with new password
      $loginResponse = $this->postJson('/api/login', [
        'email' => $user->email,
        'password' => 'newpassword123',
      ]);

      $loginResponse->assertStatus(200);
    });

    it('cannot update user as regular user', function () {
      $user = User::factory()->create();
      $otherUser = User::factory()->create();
      Sanctum::actingAs($user);

      $response = $this->putJson("/api/users/{$otherUser->id}", [
        'name' => 'Updated Name',
      ]);

      $response->assertStatus(403);
    });

    it('returns 404 for non-existent user', function () {
      $admin = User::factory()->admin()->create();
      Sanctum::actingAs($admin);

      $response = $this->putJson('/api/users/non-existent-id', [
        'name' => 'Updated Name',
      ]);

      $response->assertStatus(404);
    });

    it('validates email uniqueness on update', function () {
      $admin = User::factory()->admin()->create();
      $user1 = User::factory()->create(['email' => 'user1@example.com']);
      $user2 = User::factory()->create(['email' => 'user2@example.com']);
      Sanctum::actingAs($admin);

      $response = $this->putJson("/api/users/{$user1->id}", [
        'name' => $user1->name,
        'email' => 'user2@example.com', // Try to use existing email
      ]);

      $response->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
    });
  });

  describe('DELETE /users/{user}', function () {
    it('can delete user as admin', function () {
      $admin = User::factory()->admin()->create();
      $user = User::factory()->create();
      Sanctum::actingAs($admin);

      $response = $this->deleteJson("/api/users/{$user->id}");

      $response->assertStatus(204);
      $this->assertDatabaseMissing('users', ['id' => $user->id]);
    });

    it('cannot delete user as regular user', function () {
      $user = User::factory()->create();
      $otherUser = User::factory()->create();
      Sanctum::actingAs($user);

      $response = $this->deleteJson("/api/users/{$otherUser->id}");

      $response->assertStatus(403);
      $this->assertDatabaseHas('users', ['id' => $otherUser->id]);
    });

    it('returns 404 for non-existent user', function () {
      $admin = User::factory()->admin()->create();
      Sanctum::actingAs($admin);

      $response = $this->deleteJson('/api/users/non-existent-id');

      $response->assertStatus(404);
    });

    it('cannot delete self', function () {
      $admin = User::factory()->admin()->create();
      Sanctum::actingAs($admin);

      $response = $this->deleteJson("/api/users/{$admin->id}");

      $response->assertStatus(422)
        ->assertJson([
          'message' => 'You cannot delete yourself',
        ]);

      $this->assertDatabaseHas('users', ['id' => $admin->id]);
    });
  });
});
