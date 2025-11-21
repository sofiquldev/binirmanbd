<?php

namespace App\Livewire\Tenant;

use App\Models\Appointment;
use Livewire\Component;

class AppointmentForm extends Component
{
    public string $name = '';
    public string $email = '';
    public string $phone = '';
    public string $purpose = '';
    public string $preferred_date = '';
    public string $preferred_time = '';
    public string $notes = '';
    public bool $success = false;

    protected $rules = [
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'phone' => 'required|string|max:20',
        'purpose' => 'required|string|max:255',
        'preferred_date' => 'required|date|after:today',
        'preferred_time' => 'required|string',
        'notes' => 'nullable|string|max:1000',
    ];

    public function submit(): void
    {
        $this->validate();

        $candidateId = $this->getCandidateId();

        Appointment::create([
            'candidate_id' => $candidateId,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'purpose' => $this->purpose,
            'preferred_date' => $this->preferred_date,
            'preferred_time' => $this->preferred_time,
            'notes' => $this->notes,
            'status' => 'pending',
        ]);

        $this->success = true;
        $this->reset(['name', 'email', 'phone', 'purpose', 'preferred_date', 'preferred_time', 'notes']);
        
        session()->flash('message', __('Appointment request submitted! We will review and confirm with you soon.', [], 'en'));
    }

    protected function getCandidateId(): ?int
    {
        try {
            $tenantId = tenant('id');
            $candidate = \App\Models\Candidate::where('tenant_id', $tenantId)->first();
            return $candidate?->id;
        } catch (\Exception $e) {
            return null;
        }
    }

    public function render()
    {
        return view('livewire.tenant.appointment-form');
    }
}
