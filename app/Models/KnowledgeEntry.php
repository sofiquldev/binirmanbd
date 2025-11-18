<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KnowledgeEntry extends Model
{
    /** @use HasFactory<\Database\Factories\KnowledgeEntryFactory> */
    use HasFactory;

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'is_public' => 'boolean',
        ];
    }

    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }
}
