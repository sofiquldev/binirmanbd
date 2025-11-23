<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'candidate_id',
        'category_id',
        'organization_id',
        'name',
        'name_bn',
        'designation',
        'phone',
        'email',
        'address',
        'address_bn',
        'is_verified',
        'priority',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'is_verified' => 'boolean',
        ];
    }

    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }

    public function category()
    {
        return $this->belongsTo(ContactCategory::class);
    }

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }
}
