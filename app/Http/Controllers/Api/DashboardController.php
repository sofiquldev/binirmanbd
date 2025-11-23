<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Candidate;
use App\Models\Donation;
use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $candidateId = $user->candidate_id;
        $isSuperAdmin = $user->hasRole(\App\Models\User::ROLE_SUPER_ADMIN);

        // Donations query
        $donationsQuery = Donation::query()
            ->when($candidateId, fn($q) => $q->where('candidate_id', $candidateId));

        // Feedback query
        $feedbackQuery = Feedback::query()
            ->when($candidateId, fn($q) => $q->where('candidate_id', $candidateId));

        // Metrics
        $totalDonations = (clone $donationsQuery)->sum('amount');
        $offlineDonations = (clone $donationsQuery)->where('source', 'offline')->sum('amount');
        $onlineDonations = $totalDonations - $offlineDonations;
        $donationCount = (clone $donationsQuery)->count();

        $feedbackCount = (clone $feedbackQuery)->count();
        $resolvedFeedback = (clone $feedbackQuery)->where('status', Feedback::STATUS_RESOLVED)->count();
        $resolutionRate = $feedbackCount > 0 ? round(($resolvedFeedback / $feedbackCount) * 100, 1) : 0;

        // Donation trend (last 7 days)
        $donationTrend = $this->buildTrend(function ($date) use ($donationsQuery) {
            return (clone $donationsQuery)->whereDate('created_at', $date)->sum('amount');
        });

        // Feedback trend (last 7 days)
        $feedbackTrend = $this->buildTrend(function ($date) use ($feedbackQuery) {
            return (clone $feedbackQuery)->whereDate('created_at', $date)->count();
        });

        return response()->json([
            'metrics' => [
                'donation_total' => $totalDonations,
                'donation_online' => $onlineDonations,
                'donation_offline' => $offlineDonations,
                'donation_count' => $donationCount,
                'feedback_total' => $feedbackCount,
                'resolution_rate' => $resolutionRate,
            ],
            'trends' => [
                'donations' => $donationTrend,
                'feedback' => $feedbackTrend,
            ],
        ]);
    }

    protected function buildTrend(callable $callback, int $days = 7): array
    {
        $labels = [];
        $values = [];

        for ($i = $days - 1; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $labels[] = $date->format('M d');
            $values[] = $callback($date->toDateString());
        }

        return [
            'labels' => $labels,
            'values' => $values,
        ];
    }
}
