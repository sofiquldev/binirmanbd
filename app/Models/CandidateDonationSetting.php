<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;

class CandidateDonationSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'candidate_id',
        'donations_enabled',
        'form_title',
        'form_title_bn',
        'form_description',
        'form_description_bn',
        'success_message',
        'success_message_bn',
        'minimum_amount',
        'maximum_amount',
        'suggested_amounts',
        'default_currency',
        'allowed_currencies',
        'require_donor_id',
        'require_donor_phone',
        'require_donor_email',
        'show_donor_name_bn',
        'qr_code_path',
        'qr_code_url',
        'thank_you_message',
        'thank_you_message_bn',
        'thank_you_redirect_url',
    ];

    protected function casts(): array
    {
        return [
            'donations_enabled' => 'boolean',
            'minimum_amount' => 'decimal:2',
            'maximum_amount' => 'decimal:2',
            'suggested_amounts' => 'array',
            'allowed_currencies' => 'array',
            'require_donor_id' => 'boolean',
            'require_donor_phone' => 'boolean',
            'require_donor_email' => 'boolean',
            'show_donor_name_bn' => 'boolean',
        ];
    }

    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }

    /**
     * Get enabled payment methods for this candidate
     */
    public function enabledPaymentMethods()
    {
        return $this->candidate->paymentMethods()
            ->wherePivot('is_enabled', true)
            ->orderByPivot('sort_order');
    }

    /**
     * Check if a payment method is enabled
     */
    public function isPaymentMethodEnabled(string $methodCode): bool
    {
        if (!$this->donations_enabled) {
            return false;
        }

        return $this->candidate->paymentMethods()
            ->where('code', $methodCode)
            ->wherePivot('is_enabled', true)
            ->exists();
    }

    /**
     * Get default settings for a candidate
     */
    public static function getDefaults(): array
    {
        return [
            'donations_enabled' => true,
            'minimum_amount' => 10.00,
            'maximum_amount' => null,
            'suggested_amounts' => [100, 500, 1000, 5000],
            'default_currency' => 'BDT',
            'allowed_currencies' => null,
            'require_donor_id' => false,
            'require_donor_phone' => false,
            'require_donor_email' => false,
            'show_donor_name_bn' => true,
        ];
    }
}
