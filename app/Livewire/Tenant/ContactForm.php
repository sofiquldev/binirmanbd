<?php

namespace App\Livewire\Tenant;

use App\Models\ContactMessage;
use Livewire\Component;

class ContactForm extends Component
{
    public string $name = '';
    public string $email = '';
    public string $phone = '';
    public string $subject = '';
    public string $message = '';
    public string $type = 'general'; // general, volunteer, inquiry
    public bool $success = false;

    protected $rules = [
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'phone' => 'nullable|string|max:20',
        'subject' => 'required|string|max:255',
        'message' => 'required|string|max:5000',
        'type' => 'required|in:general,volunteer,inquiry',
    ];

    public function submit(): void
    {
        $this->validate();

        $candidateId = $this->getCandidateId();

        ContactMessage::create([
            'candidate_id' => $candidateId,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'subject' => $this->subject,
            'message' => $this->message,
            'type' => $this->type,
            'status' => 'new',
        ]);

        $this->success = true;
        $this->reset(['name', 'email', 'phone', 'subject', 'message']);
        
        session()->flash('message', __('Thank you! Your message has been sent. We will get back to you soon.', [], 'en'));
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
        return view('livewire.tenant.contact-form');
    }
}
