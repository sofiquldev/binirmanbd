<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Candidate;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

class FeedController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $candidate = Candidate::where('tenant_id', tenant('id'))->firstOrFail();

        // Placeholder stories until CMS module is added
        $feed = collect(range(1, 5))->map(function ($index) use ($candidate) {
            return [
                'title' => "{$candidate->name} update {$index}",
                'body' => $candidate->campaign_goals
                    ? str($candidate->campaign_goals)->limit(120)
                    : __('Community engagement highlight placeholder.'),
                'published_at' => Carbon::now()->subDays($index)->toIso8601ZuluString(),
            ];
        });

        return response()->json([
            'data' => $feed,
        ]);
    }
}
