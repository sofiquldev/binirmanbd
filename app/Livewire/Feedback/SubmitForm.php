<?php

namespace App\Livewire\Feedback;

use App\Models\Candidate;
use App\Models\Feedback;
use Illuminate\Support\Facades\Storage;
use Livewire\Component;
use Livewire\WithFileUploads;

class SubmitForm extends Component
{
    use WithFileUploads;

    public Candidate $candidate;

    public ?string $name = null;
    public ?string $phone = null;
    public ?string $email = null;
    public string $category = 'general';
    public string $description = '';
    public $attachment;

    public array $categories = [
        'general',
        'infrastructure',
        'law_and_order',
        'health',
        'education',
    ];

    protected function rules(): array
    {
        return [
            'name' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'email' => ['nullable', 'email'],
            'category' => ['required', 'in:'.implode(',', $this->categories)],
            'description' => ['required', 'string', 'min:10'],
            'attachment' => ['nullable', 'file', 'max:4096'],
        ];
    }

    public function submit(): void
    {
        $this->validate();

        $attachmentPath = $this->attachment ? $this->attachment->store('feedback', 'public') : null;

        Feedback::create([
            'tenant_id' => tenant('id') ?? $this->candidate->tenant_id,
            'candidate_id' => $this->candidate->id,
            'name' => $this->name,
            'phone' => $this->phone,
            'email' => $this->email,
            'category' => $this->category,
            'description' => $this->description,
            'status' => Feedback::STATUS_NEW,
            'attachment_path' => $attachmentPath ? Storage::disk('public')->url($attachmentPath) : null,
        ]);

        $this->dispatch('feedback-submitted');
        $this->dispatch('banner-message', message: __('Thank you! Your submission has been received.'));

        $this->reset(['name', 'phone', 'email', 'category', 'description', 'attachment']);
        $this->category = 'general';
    }

    public function render()
    {
        return view('livewire.feedback.submit-form');
    }
}
