<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\YoutubeUrl;

class SongUpdateRequest extends FormRequest
{
  public function authorize(): bool { return true; }

  public function rules(): array
  {
    return [
      'title'       => ['sometimes','string','max:255'],
      'youtube_url' => ['sometimes','string', new YoutubeUrl()],
      'position'    => ['sometimes','nullable','integer','between:1,5'],
    ];
  }
}
