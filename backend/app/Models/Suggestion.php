<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Suggestion extends Model
{
  use HasFactory, HasUuids;

  public $incrementing = false;
  protected $keyType = 'string';

  protected $fillable = [
    'user_id',
    'title',
    'youtube_url',
    'status',
    'reviewed_by',
    'reviewed_at',
    'position',
  ];

  protected $casts = [
    'reviewed_at' => 'datetime',
    'position'    => 'integer',
  ];

  // Relacionamentos úteis
  public function author()
  {
    return $this->belongsTo(User::class, 'user_id');
  }

  public function reviewer()
  {
    return $this->belongsTo(User::class, 'reviewed_by');
  }
}
