<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('suggestions', function (Blueprint $table) {
      $table->uuid('id')->primary();

      // quem sugeriu (opcional: público não logado)
      $table->uuid('user_id')->nullable();
      $table->string('title');
      $table->string('youtube_url');

      // pending | approved | rejected
      $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');

      // quem revisou (admin), quando
      $table->uuid('reviewed_by')->nullable();
      $table->timestampTz('reviewed_at')->nullable();

      // se na aprovação já entrar no Top 5, a posição desejada
      $table->unsignedTinyInteger('position')->nullable();

      $table->timestamps();

      $table->index(['status', 'created_at']);
      $table->index('position');

      // FKs (uuid)
      $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
      $table->foreign('reviewed_by')->references('id')->on('users')->nullOnDelete();
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('suggestions');
  }
};
