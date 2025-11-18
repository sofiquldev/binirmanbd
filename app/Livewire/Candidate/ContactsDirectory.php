<?php

namespace App\Livewire\Candidate;

use App\Models\Candidate as CandidateModel;
use App\Models\Contact;
use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class ContactsDirectory extends Component
{
    public ?CandidateModel $candidate = null;

    public string $search = '';
    public string $categoryFilter = 'all';
    public bool $verifiedOnly = false;

    public string $name = '';
    public string $category = 'election_commission';
    public ?string $designation = null;
    public ?string $organization = null;
    public ?string $phone = null;
    public ?string $email = null;
    public ?string $notes = null;
    public bool $is_verified = true;

    public array $categories = [
        'election_commission' => 'Election Commission',
        'police' => 'Police',
        'hospitals' => 'Hospitals',
        'ngos' => 'NGOs',
        'emergency' => 'Emergency',
    ];

    public function mount(): void
    {
        $this->candidate = Auth::user()?->candidate;
    }

    protected function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'in:'.implode(',', array_keys($this->categories))],
            'designation' => ['nullable', 'string', 'max:255'],
            'organization' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'email'],
            'notes' => ['nullable', 'string', 'max:500'],
            'is_verified' => ['boolean'],
        ];
    }

    public function save(): void
    {
        if (! $this->candidate) {
            $this->addError('candidate', __('Candidate profile missing.'));
            return;
        }

        $this->validate();

        Contact::create([
            'tenant_id' => $this->candidate->tenant_id,
            'candidate_id' => $this->candidate->id,
            'category' => $this->category,
            'name' => $this->name,
            'designation' => $this->designation,
            'organization' => $this->organization,
            'phone' => $this->phone,
            'email' => $this->email,
            'is_verified' => $this->is_verified,
            'notes' => $this->notes,
        ]);

        $this->dispatch('banner-message', message: __('Contact saved.'));
        $this->reset(['name', 'designation', 'organization', 'phone', 'email', 'notes', 'is_verified']);
        $this->category = 'election_commission';
        $this->is_verified = true;
    }

    public function export(string $type): void
    {
        $this->dispatch('banner-message', message: __('Export job queued (:type)', ['type' => strtoupper($type)]));
    }

    public function render()
    {
        if (! $this->candidate) {
            return view('livewire.candidate.contacts-directory', ['contacts' => collect()]);
        }

        $query = Contact::query()
            ->where('candidate_id', $this->candidate->id)
            ->orderBy('priority')
            ->orderBy('name');

        if ($this->search) {
            $query->where(function ($q) {
                $q->where('name', 'like', "%{$this->search}%")
                    ->orWhere('organization', 'like', "%{$this->search}%")
                    ->orWhere('phone', 'like', "%{$this->search}%");
            });
        }

        if ($this->categoryFilter !== 'all') {
            $query->where('category', $this->categoryFilter);
        }

        if ($this->verifiedOnly) {
            $query->where('is_verified', true);
        }

        return view('livewire.candidate.contacts-directory', [
            'contacts' => $query->get(),
        ]);
    }
}
