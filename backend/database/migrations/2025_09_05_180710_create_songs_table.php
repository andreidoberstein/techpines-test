<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('songs', function (Blueprint $table) {
      $table->uuid('id')->primary();
      $table->string('title');
      $table->string('youtube_url');
      // 1..5 quando está no Top 5; null para as demais
      $table->unsignedTinyInteger('position')->nullable();
      // null = ainda não aprovada (para o caso de adicionar sem passar por suggestion)
      $table->timestampTz('approved_at')->nullable();

      $table->timestamps();

      // Índice para buscas típicas
      $table->index('approved_at');
      $table->index('position');
    });

    if (DB::connection()->getDriverName() === 'pgsql') {
      DB::statement('CREATE UNIQUE INDEX songs_position_unique_when_set ON songs (position) WHERE position IS NOT NULL;');
      DB::statement('CREATE UNIQUE INDEX songs_youtube_unique_when_approved ON songs (youtube_url) WHERE approved_at IS NOT NULL;');
    }
  }

  public function down(): void
  {
    // Remover índices parciais explícitos
    DB::statement('DROP INDEX IF EXISTS songs_position_unique_when_set;');
    DB::statement('DROP INDEX IF EXISTS songs_youtube_unique_when_approved;');

    Schema::dropIfExists('songs');
  }
};
