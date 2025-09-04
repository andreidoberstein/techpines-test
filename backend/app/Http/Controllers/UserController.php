<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
  public function index(): \Illuminate\Pagination\LengthAwarePaginator
  {
    try {
      return User::paginate(10);
    } catch (\Throwable $th) {
      throw $th;
    }
  }

  public function store(Request $request)
  {
    $data = $request->validate([
      'name' => 'required|string|max:255',
      'email' => 'required|email|unique:users',
      'password' => 'required|min:6',
      'role' => 'required|in:user,admin',
    ]);
    $data['password'] = Hash::make($data['password']);

    return User::create($data);
  }

  public function update(Request $request, User $user)
  {
    $data = $request->validate([
      'name' => 'sometimes|string|max:255',
      'email' => 'sometimes|email|unique:users,email,'.$user->id,
      'password' => 'sometimes|min:6',
      'role' => 'sometimes|in:user,admin',
    ]);

    if (isset($data['password'])) {
      $data['password'] = Hash::make($data['password']);
    }

    $user->update($data);
    return $user;
  }

  public function destroy(User $user)
  {
    $user->delete();
    return response()->noContent();
  }
}
