<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PricingTier extends Model
{
    /** @use HasFactory<\Database\Factories\PricingTierFactory> */
    use HasFactory;

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'features' => 'array',
        ];
    }

    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }
}
