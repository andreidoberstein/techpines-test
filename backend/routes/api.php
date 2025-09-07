<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\SongController;
use App\Http\Controllers\SuggestionController;
use App\Http\Controllers\UserController;

Route::get('/health', function () {
  return response()->json(['message' => 'API Laravel funcionando!']);
});
Route::post('/login', [AuthController::class, 'login']);
Route::post('/refresh', [AuthController::class, 'refresh']);
Route::get('/songs/top5', [SongController::class, 'indexTop5']);
Route::get('/songs',      [SongController::class, 'indexRest']);
Route::post('/suggestions', [SuggestionController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
  Route::get('/me', [AuthController::class, 'me']);
  Route::post('/logout', [AuthController::class, 'logout']);

  Route::get('/users', [UserController::class, 'index']);
  Route::post('/users', [UserController::class, 'store']);
  Route::put('/users/{user}', [UserController::class, 'update']);
  Route::delete('/users/{user}', [UserController::class, 'destroy']);

  Route::get('/suggestions/', [SuggestionController::class, 'indexRest']);
  Route::post('/suggestions/{id}/approve', [SuggestionController::class, 'approve']);
  Route::post('/suggestions/{id}/reject',  [SuggestionController::class, 'reject']);

  Route::post('/songs',        [SongController::class, 'store']);
  Route::put('/songs/{song}',  [SongController::class, 'update']);
  Route::delete('/songs/{song}',[SongController::class, 'destroy']);
});
