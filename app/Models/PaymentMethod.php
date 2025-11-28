<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'name_bn',
        'description',
        'description_bn',
        'icon',
        'is_active',
        'requires_credentials',
        'is_online',
        'config_fields',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'requires_credentials' => 'boolean',
            'is_online' => 'boolean',
            'config_fields' => 'array',
        ];
    }

    /**
     * Get candidates using this payment method
     */
    public function candidates()
    {
        return $this->belongsToMany(Candidate::class, 'candidate_payment_methods')
            ->withPivot('config', 'is_enabled', 'sort_order')
            ->withTimestamps();
    }

    /**
     * Get active payment methods
     */
    public static function getActive()
    {
        return static::where('is_active', true)->orderBy('sort_order')->get();
    }

    /**
     * Get payment method by code
     */
    public static function getByCode(string $code)
    {
        return static::where('code', $code)->first();
    }
}
