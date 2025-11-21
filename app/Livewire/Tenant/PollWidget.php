<?php

namespace App\Livewire\Tenant;

use App\Models\Poll;
use App\Models\PollOption;
use App\Models\PollVote;
use Livewire\Component;

class PollWidget extends Component
{
    public ?int $pollId = null;
    public ?int $selectedOption = null;
    public bool $hasVoted = false;
    public bool $showResults = false;

    public function mount(?int $pollId = null): void
    {
        $this->pollId = $pollId;
        $this->checkVoteStatus();
    }

    public function vote(): void
    {
        if (!$this->selectedOption || $this->hasVoted) {
            return;
        }

        $candidateId = $this->getCandidateId();
        
        PollVote::create([
            'poll_id' => $this->pollId,
            'option_id' => $this->selectedOption,
            'candidate_id' => $candidateId,
            'voter_ip' => request()->ip(),
        ]);

        $this->hasVoted = true;
        $this->showResults = true;
        
        session()->flash('message', __('Thank you for voting!', [], 'en'));
    }

    public function showResults(): void
    {
        $this->showResults = true;
    }

    protected function checkVoteStatus(): void
    {
        if (!$this->pollId) {
            return;
        }

        $ip = request()->ip();
        $this->hasVoted = PollVote::where('poll_id', $this->pollId)
            ->where('voter_ip', $ip)
            ->exists();
        
        if ($this->hasVoted) {
            $this->showResults = true;
        }
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
        $poll = $this->pollId ? Poll::with(['options.votes'])->find($this->pollId) : null;
        
        if (!$poll) {
            $candidateId = $this->getCandidateId();
            $poll = Poll::where('candidate_id', $candidateId)
                ->where('is_active', true)
                ->with(['options.votes'])
                ->latest()
                ->first();
        }

        return view('livewire.tenant.poll-widget', [
            'poll' => $poll,
        ]);
    }
}
