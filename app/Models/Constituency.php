<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Constituency extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'name_bn',
        'slug',
        'district',
        'district_bn',
        'about',
        'about_bn',
        'history',
        'history_bn',
        'boundaries',
        'population',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'boundaries' => 'array',
            'is_active' => 'boolean',
        ];
    }

    public function candidates()
    {
        return $this->hasMany(Candidate::class);
    }
}
