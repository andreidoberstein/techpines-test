<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\YoutubeUrl;

class SuggestionStoreRequest extends FormRequest
{
  public function authorize(): bool { return true; }

  public function rules(): array
  {
    return [
      'title'       => ['required','string','max:255'],
      'youtube_url' => ['required','string', new YoutubeUrl()],
      // opcional: posição desejada (pode ou não ser usada na aprovação)
      'position'    => ['nullable','integer','between:1,5'],
    ];
  }
}
