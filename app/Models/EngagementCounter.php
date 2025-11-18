<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EngagementCounter extends Model
{
    /** @use HasFactory<\Database\Factories\EngagementCounterFactory> */
    use HasFactory;

    protected $guarded = [];

    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }
}
