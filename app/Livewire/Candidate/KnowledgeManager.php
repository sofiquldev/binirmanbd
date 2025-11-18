<?php

namespace App\Livewire\Candidate;

use App\Models\Candidate as CandidateModel;
use App\Models\KnowledgeEntry;
use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class KnowledgeManager extends Component
{
    public ?CandidateModel $candidate = null;
    public string $type = 'faq';
    public string $question = '';
    public string $answer = '';
    public bool $is_public = true;
    public string $tags = '';

    public function mount(): void
    {
        $this->candidate = Auth::user()?->candidate;
    }

    protected function rules(): array
    {
        return [
            'type' => ['required', 'in:faq,chatbot'],
            'question' => ['required', 'string', 'max:255'],
            'answer' => ['required', 'string'],
            'is_public' => ['boolean'],
            'tags' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function save(): void
    {
        if (! $this->candidate) {
            $this->addError('candidate', __('No candidate profile linked.'));
            return;
        }

        $this->validate();

        KnowledgeEntry::create([
            'tenant_id' => $this->candidate->tenant_id,
            'candidate_id' => $this->candidate->id,
            'type' => $this->type,
            'question' => $this->question,
            'answer' => $this->answer,
            'is_public' => $this->is_public,
            'tags' => $this->tags,
        ]);

        $this->reset(['question', 'answer', 'tags']);
        $this->type = 'faq';
        $this->is_public = true;

        $this->dispatch('banner-message', message: __('Entry saved.'));
    }

    public function delete(int $entryId): void
    {
        KnowledgeEntry::where('candidate_id', $this->candidate?->id)
            ->where('id', $entryId)
            ->delete();
    }

    public function render()
    {
        $entries = $this->candidate
            ? $this->candidate->knowledgeEntries()->latest()->get()
            : collect();

        return view('livewire.candidate.knowledge-manager', [
            'entries' => $entries,
        ]);
    }
}
