<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Song extends Model
{
  use HasFactory, HasUuids;

  public $incrementing = false;
  protected $keyType = 'string';

  protected $fillable = [
    'title',
    'youtube_url',
    'position',
    'approved_at',
  ];

  protected $casts = [
    'approved_at' => 'datetime',
    'position'    => 'integer',
  ];
}
