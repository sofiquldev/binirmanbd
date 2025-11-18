<?php

namespace App\Livewire\Candidate;

use App\Models\Candidate as CandidateModel;
use App\Models\Donation;
use App\Models\DonationLedger;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Livewire\Component;
use Livewire\WithFileUploads;

class OfflineDonationForm extends Component
{
    use WithFileUploads;

    public ?CandidateModel $candidate = null;

    public string $donor_name = '';
    public ?string $donor_id_number = null;
    public ?string $donor_phone = null;
    public ?string $donor_email = null;
    public string $method = 'cash';
    public float $amount = 0;
    public string $currency = 'BDT';
    public string $donation_date;
    public ?string $notes = null;
    public $proof;

    public function mount(): void
    {
        $this->candidate = Auth::user()?->candidate;
        $this->donation_date = now()->format('Y-m-d');
    }

    protected function rules(): array
    {
        return [
            'donor_name' => ['required', 'string', 'max:255'],
            'donor_id_number' => ['nullable', 'string', 'max:50'],
            'donor_phone' => ['nullable', 'string', 'max:20'],
            'donor_email' => ['nullable', 'email'],
            'method' => ['required', 'in:cash,bank,cheque'],
            'amount' => ['required', 'numeric', 'min:10'],
            'currency' => ['required', 'in:BDT,USD'],
            'donation_date' => ['required', 'date'],
            'notes' => ['nullable', 'string', 'max:500'],
            'proof' => ['nullable', 'file', 'max:2048'],
        ];
    }

    public function save(): void
    {
        if (! $this->candidate) {
            $this->addError('candidate', __('You are not linked to a candidate profile.'));
            return;
        }

        $this->validate();

        $proofPath = $this->proof ? $this->proof->store('donation-proofs', 'public') : null;

        $donation = Donation::create([
            'tenant_id' => $this->candidate->tenant_id,
            'candidate_id' => $this->candidate->id,
            'user_id' => Auth::id(),
            'donor_name' => $this->donor_name,
            'donor_id_number' => $this->donor_id_number,
            'donor_phone' => $this->donor_phone,
            'donor_email' => $this->donor_email,
            'source' => 'offline',
            'method' => $this->method,
            'amount' => $this->amount,
            'currency' => $this->currency,
            'status' => Donation::STATUS_PENDING,
            'transaction_reference' => 'OFF-' . Str::upper(Str::random(10)),
            'paid_at' => $this->donation_date,
            'proof_path' => $proofPath ? Storage::disk('public')->url($proofPath) : null,
            'notes' => $this->notes,
        ]);

        DonationLedger::create([
            'tenant_id' => $this->candidate->tenant_id,
            'candidate_id' => $this->candidate->id,
            'donation_id' => $donation->id,
            'recorded_by' => Auth::id(),
            'entry_type' => 'credit',
            'wallet' => 'central',
            'amount' => $this->amount,
            'currency' => $this->currency,
            'source' => 'offline',
            'description' => __('Offline donation logged pending verification'),
        ]);

        $this->dispatch('offline-donation-logged', donationId: $donation->id);
        $this->dispatch('banner-message', message: __('Offline donation recorded and pending verification.'));

        $this->reset(['donor_name', 'donor_id_number', 'donor_phone', 'donor_email', 'amount', 'notes', 'proof']);
        $this->method = 'cash';
        $this->amount = 0;
        $this->donation_date = now()->format('Y-m-d');
    }

    public function render()
    {
        return view('livewire.candidate.offline-donation-form');
    }
}
