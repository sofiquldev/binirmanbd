<?php

namespace App\Livewire\Donations;

use App\Models\Candidate;
use App\Models\Donation;
use Illuminate\Support\Str;
use Livewire\Component;

class DonateForm extends Component
{
    public Candidate $candidate;

    public string $donor_name = '';
    public ?string $donor_id_number = null;
    public ?string $donor_phone = null;
    public ?string $donor_email = null;
    public string $gateway = 'sslcommerz';
    public string $currency = 'BDT';
    public float $amount = 500;
    public ?string $notes = null;

    protected function rules(): array
    {
        return [
            'donor_name' => ['required', 'string', 'max:255'],
            'donor_id_number' => ['nullable', 'string', 'max:50'],
            'donor_phone' => ['nullable', 'string', 'max:20'],
            'donor_email' => ['nullable', 'email'],
            'gateway' => ['required', 'in:sslcommerz,bkash,nagad,stripe'],
            'currency' => ['required', 'in:BDT,USD'],
            'amount' => ['required', 'numeric', 'min:10'],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function submit(): void
    {
        $this->validate();

        $donation = Donation::create([
            'tenant_id' => tenant('id') ?? $this->candidate->tenant_id,
            'candidate_id' => $this->candidate->id,
            'donor_name' => $this->donor_name,
            'donor_id_number' => $this->donor_id_number,
            'donor_phone' => $this->donor_phone,
            'donor_email' => $this->donor_email,
            'source' => 'online',
            'method' => $this->gateway,
            'amount' => $this->amount,
            'currency' => $this->currency,
            'status' => Donation::STATUS_PENDING,
            'payment_gateway' => $this->gateway,
            'transaction_reference' => 'BNBD-' . Str::uuid(),
            'notes' => $this->notes,
        ]);

        // Placeholder for redirecting to payment gateway
        $this->dispatch('donation-created', donationId: $donation->id);
        $this->dispatch('banner-message', message: __('Thank you! We are redirecting you to complete payment.'));

        $this->reset(['donor_name', 'donor_id_number', 'donor_phone', 'donor_email', 'amount', 'notes']);
        $this->amount = 500;
    }

    public function render()
    {
        return view('livewire.donations.donate-form');
    }
}
