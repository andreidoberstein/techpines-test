<?php

namespace App\Http\Controllers;

use App\Http\Requests\SuggestionApproveRequest;
use App\Http\Requests\SuggestionStoreRequest;
use App\Models\Song;
use App\Models\Suggestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SuggestionController extends Controller
{
  /** Criar sugestão (público ou autenticado) */
  public function store(SuggestionStoreRequest $request)
  {
    $data = $request->validated();

    $suggestion = Suggestion::create([
      'user_id'     => auth()->id(),
      'title'       => $data['title'],
      'youtube_url' => $data['youtube_url'],
      'status'      => 'pending',
      'position'    => $data['position'] ?? null,
    ]);

    return response()->json($suggestion, 201);
  }

  /** Aprovar sugestão e (opcionalmente) colocá-la no Top 5 */
  public function approve(SuggestionApproveRequest $request, string $id)
  {
    $suggestion = Suggestion::whereKey($id)->firstOrFail();

    if ($suggestion->status !== 'pending') {
      return response()->json(['message' => 'Sugestão já revisada.'], 422);
    }

    $position = $request->validated()['position'] ?? $suggestion->position;

    return DB::transaction(function () use ($suggestion, $position) {
      // cria a música aprovada
      $song = Song::create([
        'title'       => $suggestion->title,
        'youtube_url' => $suggestion->youtube_url,
        'approved_at' => now(),
        'position'    => null,
      ]);

      // posiciona se necessário
      if (!empty($position)) {
        $this->occupyPosition((int) $position, $song->id);
        $song->refresh();
      }

      // marca a sugestão como aprovada
      $suggestion->update([
        'status'      => 'approved',
        'reviewed_by' => auth()->id(),
        'reviewed_at' => now(),
        'position'    => $song->position,
      ]);

      return response()->json([
        'suggestion' => $suggestion,
        'song'       => $song,
      ]);
    });
  }

  /** Rejeitar sugestão */
  public function reject(string $id)
  {
    $suggestion = Suggestion::whereKey($id)->firstOrFail();

    if ($suggestion->status !== 'pending') {
      return response()->json(['message' => 'Sugestão já revisada.'], 422);
    }

    $suggestion->update([
      'status'      => 'rejected',
      'reviewed_by' => auth()->id(),
      'reviewed_at' => now(),
    ]);

    return response()->json($suggestion);
  }

  /** reutiliza a mesma regra do SongController */
  protected function occupyPosition(int $position, string $songId): void
  {
    $toShift = Song::query()
      ->whereNotNull('position')
      ->where('position', '>=', $position)
      ->orderByDesc('position')
      ->get();

    foreach ($toShift as $s) {
      if ($s->id === $songId) continue;
      if ($s->position < 5) {
        $s->update(['position' => $s->position + 1]);
      } else {
        $s->update(['position' => null]);
      }
    }

    Song::whereKey($songId)->update([
      'position'    => $position,
      'approved_at' => now(),
    ]);
  }
}
