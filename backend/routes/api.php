<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/refresh', [AuthController::class, 'refresh']);

Route::middleware('auth:sanctum')->group(function () {
  Route::get('/me', [AuthController::class, 'me']);
  Route::post('/logout', [AuthController::class, 'logout']);

  Route::get('/users', [UserController::class, 'index']);
  Route::post('/users', [UserController::class, 'store']);
  Route::put('/users/{user}', [UserController::class, 'update']);
  Route::delete('/users/{user}', [UserController::class, 'destroy']);
});
