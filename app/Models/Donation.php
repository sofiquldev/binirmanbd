<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    use HasFactory;

    public const STATUS_PENDING    = 'pending';
    public const STATUS_PROCESSING = 'processing';
    public const STATUS_VERIFIED   = 'verified';
    public const STATUS_REJECTED   = 'rejected';
    public const STATUS_REFUNDED   = 'refunded';

    protected $fillable = [
        'tenant_id',
        'candidate_id',
        'user_id',
        'donor_name',
        'donor_id_number',
        'donor_phone',
        'donor_email',
        'source',
        'method',
        'amount',
        'currency',
        'status',
        'payment_gateway',
        'transaction_reference',
        'paid_at',
        'verified_at',
        'proof_path',
        'notes',
        'meta',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'meta' => 'array',
            'paid_at' => 'datetime',
            'verified_at' => 'datetime',
        ];
    }

    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }

    public function ledgerEntries()
    {
        return $this->hasMany(DonationLedger::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
