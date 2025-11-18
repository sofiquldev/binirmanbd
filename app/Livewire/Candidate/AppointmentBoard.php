<?php

namespace App\Livewire\Candidate;

use App\Models\Appointment;
use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class AppointmentBoard extends Component
{
    public string $statusFilter = 'pending';

    public function updateStatus(int $appointmentId, string $status): void
    {
        if (! in_array($status, ['pending', 'approved', 'rejected', 'cancelled'], true)) {
            return;
        }

        $candidateId = Auth::user()?->candidate_id;
        if (! $candidateId) {
            return;
        }

        Appointment::where('candidate_id', $candidateId)
            ->where('id', $appointmentId)
            ->update(['status' => $status]);

        $this->dispatch('banner-message', message: __('Appointment updated.'));
    }

    public function render()
    {
        $candidateId = Auth::user()?->candidate_id;

        $appointments = $candidateId
            ? Appointment::where('candidate_id', $candidateId)
                ->when($this->statusFilter !== 'all', fn ($q) => $q->where('status', $this->statusFilter))
                ->latest()
                ->limit(15)
                ->get()
            : collect();

        return view('livewire.candidate.appointment-board', [
            'appointments' => $appointments,
        ]);
    }
}
