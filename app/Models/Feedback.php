<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    use HasFactory;

    public const STATUS_NEW       = 'new';
    public const STATUS_IN_REVIEW = 'in_review';
    public const STATUS_ASSIGNED  = 'assigned';
    public const STATUS_RESOLVED  = 'resolved';

    protected $fillable = [
        'tenant_id',
        'candidate_id',
        'assigned_to',
        'name',
        'name_bn',
        'phone',
        'email',
        'category',
        'category_bn',
        'description',
        'description_bn',
        'status',
        'attachment_path',
        'escalated_at',
        'resolved_at',
        'resolution_notes',
        'meta',
        'likes',
        'dislikes',
        'views',
        'is_visible',
    ];

    protected function casts(): array
    {
        return [
            'meta' => 'array',
            'escalated_at' => 'datetime',
            'resolved_at' => 'datetime',
            'is_visible' => 'boolean',
        ];
    }

    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
}
