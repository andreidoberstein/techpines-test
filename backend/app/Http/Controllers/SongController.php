<?php

namespace App\Http\Controllers;

use App\Http\Requests\SongStoreRequest;
use App\Http\Requests\SongUpdateRequest;
use App\Models\Song;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SongController extends Controller
{
  /** Top 5 (apenas aprovadas e com posição 1..5) */
  public function indexTop5()
  {
    $songs = Song::query()
      ->whereNotNull('approved_at')
      ->whereNotNull('position')
      ->orderBy('position')
      ->limit(5)
      ->get();

    return response()->json($songs);
  }

  /** A partir da 6ª (aprovadas sem position), com paginação */
  public function indexRest(Request $request)
  {
    $perPage = max(1, min(50, (int) $request->query('per_page', 10)));

    $songs = Song::query()
      ->whereNotNull('approved_at')
      ->whereNull('position')
      ->latest()
      ->paginate($perPage);

    return response()->json($songs);
  }

  /** Criar música aprovada (admin/autenticado) */
  public function store(SongStoreRequest $request)
  {
    $data = $request->validated();

    return DB::transaction(function () use ($data) {
      $song = Song::create([
        'title'       => $data['title'],
        'youtube_url' => $data['youtube_url'],
        'approved_at' => now(),
        'position'    => null, // define abaixo se precisar
      ]);

      if (!empty($data['position'])) {
        $this->occupyPosition((int) $data['position'], $song->id);
        $song->refresh();
      }

      return response()->json($song, 201);
    });
  }

  /** Atualizar música (inclusive posição) */
  public function update(SongUpdateRequest $request, Song $song)
  {
    $data = $request->validated();

    return DB::transaction(function () use ($song, $data) {
      // atualiza campos simples
      $song->fill(array_filter($data, fn($k) => in_array($k, ['title','youtube_url']), ARRAY_FILTER_USE_KEY));
      // garantir aprovado
      if (is_null($song->approved_at)) {
        $song->approved_at = now();
      }
      $song->save();

      // reposicionar se informado (pode ser null para tirar do Top 5)
      if (array_key_exists('position', $data)) {
        if ($data['position'] === null) {
          // tirar do top5
          $song->update(['position' => null]);
        } else {
          $this->occupyPosition((int) $data['position'], $song->id);
          $song->refresh();
        }
      }

      return response()->json($song);
    });
  }

  /** Remover música */
  public function destroy(Song $song)
  {
    $song->delete();
    return response()->noContent();
  }

  /** LÓGICA: ocupa uma posição do Top 5 deslocando as existentes */
  protected function occupyPosition(int $position, string $songId): void
  {
    // carrega as músicas com position >= desejada (1..5), ordenando DESC
    $toShift = Song::query()
      ->whereNotNull('position')
      ->where('position', '>=', $position)
      ->orderByDesc('position')
      ->get();

    foreach ($toShift as $s) {
      if ($s->id === $songId) continue; // se for a mesma, ignora
      if ($s->position < 5) {
        $s->update(['position' => $s->position + 1]);
      } else {
        // caiu pro "resto"
        $s->update(['position' => null]);
      }
    }

    // por fim, fixa a música alvo na posição desejada
    Song::whereKey($songId)->update([
      'position'    => $position,
      'approved_at' => now(),
    ]);
  }
}
