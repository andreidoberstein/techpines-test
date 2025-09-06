<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
  public function login(Request $request)
  {
    $credentials = $request->validate([
      'email' => ['required','email'],
      'password' => ['required','string'],
    ]);

    if (!Auth::attempt($credentials)) {
      return response()->json(['message' => 'Credenciais inválidas'], 401);
    }

    $user = Auth::user();

    // Access token (15min)
    $accessToken = $user->createToken('access-token', ['*'], now()->addMinutes(60))->plainTextToken;

    // Refresh token (30d)
    $refreshToken = $user->createToken('refresh-token', ['*'], now()->addDays(30))->plainTextToken;

    return response()->json([
      'user'          => $user,
      'access_token'  => $accessToken,
      'refresh_token' => $refreshToken,
      'expires_in'    => 900,
    ]);
  }

  public function refresh(Request $request)
  {
    $refreshToken = $request->input('refresh_token');
    $user = User::whereHas('tokens', fn ($q) => $q->where('token', hash('sha256', explode('|', $refreshToken)[1] ?? '')))->first();

    if (!$user) {
      return response()->json(['message' => 'Refresh inválido'], 401);
    }

    // Revoga o access token anterior se quiser
    $user->tokens()->where('name', 'access-token')->delete();

    $newAccessToken = $user->createToken('access-token', ['*'], now()->addMinutes(15))->plainTextToken;

    return response()->json([
      'access_token' => $newAccessToken,
      'expires_in'   => 900,
    ]);
  }

  public function logout(Request $request)
  {
    $request->user()->currentAccessToken()->delete();
    return response()->json(['message' => 'Logout feito']);
  }

  public function me(Request $request)
  {
    return response()->json($request->user());
  }
}
