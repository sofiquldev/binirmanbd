<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DonationLedger extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'candidate_id',
        'donation_id',
        'recorded_by',
        'entry_type',
        'wallet',
        'amount',
        'currency',
        'balance_after',
        'source',
        'description',
        'meta',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'balance_after' => 'decimal:2',
            'meta' => 'array',
        ];
    }

    public function donation()
    {
        return $this->belongsTo(Donation::class);
    }

    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }

    public function recorder()
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }
}
