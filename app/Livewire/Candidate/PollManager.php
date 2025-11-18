<?php

namespace App\Livewire\Candidate;

use App\Models\Poll;
use App\Models\PollOption;
use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class PollManager extends Component
{
    public string $question = '';
    public bool $allows_multiple = false;
    public array $options = [''];

    protected function rules(): array
    {
        return [
            'question' => ['required', 'string', 'max:255'],
            'allows_multiple' => ['boolean'],
            'options' => ['required', 'array', 'min:2'],
            'options.*' => ['required', 'string', 'max:120'],
        ];
    }

    public function addOption(): void
    {
        $this->options[] = '';
    }

    public function removeOption(int $index): void
    {
        unset($this->options[$index]);
        $this->options = array_values($this->options);
    }

    public function save(): void
    {
        $candidate = Auth::user()?->candidate;
        if (! $candidate) {
            return;
        }

        $this->validate();

        $poll = Poll::create([
            'tenant_id' => $candidate->tenant_id,
            'candidate_id' => $candidate->id,
            'question' => $this->question,
            'allows_multiple' => $this->allows_multiple,
        ]);

        foreach ($this->options as $option) {
            PollOption::create([
                'poll_id' => $poll->id,
                'label' => $option,
            ]);
        }

        $this->reset(['question', 'options', 'allows_multiple']);
        $this->options = [''];
        $this->dispatch('banner-message', message: __('Poll created.'));
    }

    public function closePoll(int $pollId): void
    {
        Poll::where('id', $pollId)
            ->where('candidate_id', Auth::user()?->candidate_id)
            ->update(['status' => 'closed']);
    }

    public function render()
    {
        $candidate = Auth::user()?->candidate;
        $polls = $candidate
            ? $candidate->polls()->with('options')->latest()->get()
            : collect();

        return view('livewire.candidate.poll-manager', [
            'polls' => $polls,
        ]);
    }
}
