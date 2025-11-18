<?php

namespace App\Livewire\Candidate;

use App\Models\Candidate as CandidateModel;
use App\Models\Feedback;
use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class FeedbackBoard extends Component
{
    public ?CandidateModel $candidate = null;
    public string $statusFilter = 'all';

    public array $statuses = [
        Feedback::STATUS_NEW => 'New',
        Feedback::STATUS_IN_REVIEW => 'In Review',
        Feedback::STATUS_ASSIGNED => 'Assigned',
        Feedback::STATUS_RESOLVED => 'Resolved',
    ];

    public function mount(): void
    {
        $this->candidate = Auth::user()?->candidate;
    }

    public function setStatusFilter(string $status): void
    {
        $this->statusFilter = $status;
    }

    public function updateStatus(int $feedbackId, string $status): void
    {
        if (! array_key_exists($status, $this->statuses)) {
            return;
        }

        $feedback = $this->getCandidateFeedbackQuery()
            ->where('id', $feedbackId)
            ->first();

        if (! $feedback) {
            return;
        }

        $feedback->update([
            'status' => $status,
            'resolved_at' => $status === Feedback::STATUS_RESOLVED ? now() : null,
        ]);

        $this->dispatch('banner-message', message: __('Feedback status updated.'));
    }

    protected function getCandidateFeedbackQuery()
    {
        return Feedback::query()
            ->where('candidate_id', optional($this->candidate)->id);
    }

    public function render()
    {
        $query = $this->getCandidateFeedbackQuery()->latest();

        if ($this->statusFilter !== 'all') {
            $query->where('status', $this->statusFilter);
        }

        return view('livewire.candidate.feedback-board', [
            'items' => $query->limit(10)->get(),
        ]);
    }
}
