<?php

namespace App\Livewire\Dashboard;

use App\Models\Candidate;
use App\Models\Donation;
use App\Models\Feedback;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Livewire\Component;

class MetricsBoard extends Component
{
    public ?int $candidateId = null;
    public bool $isSuperAdmin = false;
    public array $donationTrend = [];
    public array $feedbackTrend = [];

    public function mount(): void
    {
        $user = Auth::user();
        $this->candidateId = $user?->candidate_id;
        $this->isSuperAdmin = $user?->hasRole(User::ROLE_SUPER_ADMIN) ?? false;

        $this->donationTrend = $this->buildTrend(fn ($date) => $this->donationsQuery()->whereDate('created_at', $date)->sum('amount'));
        $this->feedbackTrend = $this->buildTrend(fn ($date) => $this->feedbackQuery()->whereDate('created_at', $date)->count());
    }

    protected function donationsQuery()
    {
        return Donation::query()
            ->when($this->candidateId, fn ($query) => $query->where('candidate_id', $this->candidateId));
    }

    protected function feedbackQuery()
    {
        return Feedback::query()
            ->when($this->candidateId, fn ($query) => $query->where('candidate_id', $this->candidateId));
    }

    protected function buildTrend(callable $callback, int $days = 7): array
    {
        $labels = [];
        $values = [];

        for ($i = $days - 1; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $labels[] = $date->format('M d');
            $values[] = $callback($date->toDateString());
        }

        return [
            'labels' => $labels,
            'values' => $values,
        ];
    }

    protected function metrics(): array
    {
        $donations = $this->donationsQuery();
        $feedback = $this->feedbackQuery();

        $totalDonations = (clone $donations)->sum('amount');
        $offlineDonations = (clone $donations)->where('source', 'offline')->sum('amount');
        $onlineDonations = $totalDonations - $offlineDonations;
        $donationCount = (clone $donations)->count();

        $feedbackCount = (clone $feedback)->count();
        $resolvedFeedback = (clone $feedback)->where('status', Feedback::STATUS_RESOLVED)->count();
        $resolutionRate = $feedbackCount > 0 ? round(($resolvedFeedback / $feedbackCount) * 100, 1) : 0;

        $avgResolutionHours = (clone $feedback)
            ->whereNotNull('resolved_at')
            ->select(DB::raw('AVG(TIMESTAMPDIFF(HOUR, created_at, resolved_at)) as avg_hours'))
            ->value('avg_hours') ?? 0;

        $topDonors = (clone $donations)
            ->select('donor_name', DB::raw('SUM(amount) as total'))
            ->whereNotNull('donor_name')
            ->groupBy('donor_name')
            ->orderByDesc('total')
            ->limit(5)
            ->get();

        $templateUsage = $this->isSuperAdmin
            ? Candidate::select('template_id', DB::raw('count(*) as total'))
                ->with('template')
                ->groupBy('template_id')
                ->get()
            : collect();

        return [
            'donation_total' => $totalDonations,
            'donation_online' => $onlineDonations,
            'donation_offline' => $offlineDonations,
            'donation_count' => $donationCount,
            'feedback_total' => $feedbackCount,
            'resolution_rate' => $resolutionRate,
            'avg_resolution_hours' => round($avgResolutionHours, 1),
            'top_donors' => $topDonors,
            'template_usage' => $templateUsage,
            'transparency' => [
                'public_donation_total' => $totalDonations,
                'public_resolution_rate' => $resolutionRate,
                'trust_index' => min(100, $resolutionRate + ($donationCount > 0 ? 10 : 0)),
            ],
        ];
    }

    public function render()
    {
        return view('livewire.dashboard.metrics-board', [
            'metrics' => $this->metrics(),
        ]);
    }
}
