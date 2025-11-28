<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ElectionManifesto extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'candidate_id',
        'category_id',
        'title',
        'title_bn',
        'description',
        'description_bn',
        'meta',
        'views',
        'likes',
        'dislikes',
        'is_visible',
    ];

    protected function casts(): array
    {
        return [
            'meta' => 'array',
            'is_visible' => 'boolean',
        ];
    }

    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }

    public function category()
    {
        return $this->belongsTo(ElectionManifestoCategory::class, 'category_id');
    }

    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
}
