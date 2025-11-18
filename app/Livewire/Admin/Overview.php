<?php

namespace App\Livewire\Admin;

use App\Models\Candidate;
use App\Models\Donation;
use App\Models\Feedback;
use Illuminate\Support\Facades\DB;
use Livewire\Component;

class Overview extends Component
{
    public function render()
    {
        $tenantCount = Candidate::count();
        $activeTemplates = Candidate::select('template_id', DB::raw('count(*) as total'))
            ->groupBy('template_id')
            ->with('template')
            ->get();

        $recentDonations = Donation::with('candidate')
            ->latest()
            ->limit(5)
            ->get();

        $escalatedFeedback = Feedback::with('candidate')
            ->whereNull('resolved_at')
            ->orderByDesc('escalated_at')
            ->limit(5)
            ->get();

        return view('livewire.admin.overview', [
            'tenantCount' => $tenantCount,
            'activeTemplates' => $activeTemplates,
            'recentDonations' => $recentDonations,
            'escalatedFeedback' => $escalatedFeedback,
        ]);
    }
}
