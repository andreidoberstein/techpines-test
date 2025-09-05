<?php


namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class YoutubeUrl implements ValidationRule
{
  public function validate(string $attribute, mixed $value, Closure $fail): void
  {
    $url = (string)$value;

    // aceita: youtu.be/<id>, youtube.com/watch?v=<id>, youtube.com/shorts/<id>
    $pattern = '~^(https?://)?(www\.)?(youtube\.com/(watch\?v=|shorts/)|youtu\.be/)[A-Za-z0-9_-]{11}~i';
    if (!preg_match($pattern, $url)) {
      $fail('URL do YouTube inválida.');
    }
  }
}
