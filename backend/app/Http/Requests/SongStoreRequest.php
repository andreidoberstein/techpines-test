<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\YoutubeUrl;

class SongStoreRequest extends FormRequest
{
  public function authorize(): bool { return true; }

  public function rules(): array
  {
    return [
      'title'       => ['required','string','max:255'],
      'youtube_url' => ['required','string', new YoutubeUrl()],
      'position'    => ['nullable','integer','between:1,5'],
    ];
  }
}
