<div class="space-y-8">
    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div class="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <p class="text-sm text-gray-500">{{ __('Total Donations') }}</p>
            <p class="text-3xl font-semibold text-gray-900 dark:text-white mt-2">
                ৳{{ number_format($metrics['donation_total'], 2) }}
            </p>
            <p class="text-xs text-emerald-600 mt-1">{{ __('Online: ৳:amount', ['amount' => number_format($metrics['donation_online'], 2)]) }}</p>
        </div>
        <div class="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <p class="text-sm text-gray-500">{{ __('Offline Donations Logged') }}</p>
            <p class="text-3xl font-semibold text-gray-900 dark:text-white mt-2">
                ৳{{ number_format($metrics['donation_offline'], 2) }}
            </p>
            <p class="text-xs text-gray-500 mt-1">{{ __('Ledger entries synced with HQ wallet') }}</p>
        </div>
        <div class="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <p class="text-sm text-gray-500">{{ __('Feedback Resolved') }}</p>
            <p class="text-3xl font-semibold text-gray-900 dark:text-white mt-2">
                {{ $metrics['resolution_rate'] }}%
            </p>
            <p class="text-xs text-gray-500 mt-1">{{ __('Average :hours hrs to close', ['hours' => $metrics['avg_resolution_hours']]) }}</p>
        </div>
        <div class="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <p class="text-sm text-gray-500">{{ __('Transparency Score') }}</p>
            <p class="text-3xl font-semibold text-gray-900 dark:text-white mt-2">
                {{ $metrics['transparency']['trust_index'] }} / 100
            </p>
            <p class="text-xs text-gray-500 mt-1">{{ __('Updates public dashboard nightly') }}</p>
        </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ __('Donation Trend') }}</h3>
                    <p class="text-sm text-gray-500">{{ __('Daily inflow last 7 days') }}</p>
                </div>
            </div>
            <canvas id="donationTrendChart"></canvas>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ __('Feedback Volume') }}</h3>
                    <p class="text-sm text-gray-500">{{ __('New submissions last 7 days') }}</p>
                </div>
            </div>
            <canvas id="feedbackTrendChart"></canvas>
        </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ __('Top Donors') }}</h3>
            <ul class="divide-y divide-gray-200 dark:divide-gray-700">
                @forelse ($metrics['top_donors'] as $donor)
                    <li class="py-3 flex items-center justify-between text-sm">
                        <span class="font-medium text-gray-900 dark:text-gray-100">{{ $donor->donor_name }}</span>
                        <span class="text-indigo-600 font-semibold">৳{{ number_format($donor->total, 2) }}</span>
                    </li>
                @empty
                    <li class="py-3 text-sm text-gray-500">{{ __('No donations recorded yet.') }}</li>
                @endforelse
            </ul>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ __('Public Transparency Snapshot') }}</h3>
            <div class="space-y-2 text-sm text-gray-600 dark:text-gray-200">
                <p>{{ __('Total raised: ৳:amount', ['amount' => number_format($metrics['transparency']['public_donation_total'], 2)]) }}</p>
                <p>{{ __('Resolution rate: :rate%', ['rate' => $metrics['transparency']['public_resolution_rate']]) }}</p>
                <p>{{ __('Trust index (beta): :score/100', ['score' => $metrics['transparency']['trust_index']]) }}</p>
                <p class="text-xs text-gray-400">{{ __('Data published on transparency.binirmanbd.com (coming soon)') }}</p>
            </div>
        </div>
    </div>

    @if ($metrics['template_usage']->isNotEmpty())
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ __('Template Adoption') }}</h3>
            <div class="grid gap-4 md:grid-cols-3">
                @foreach ($metrics['template_usage'] as $row)
                    <div class="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                        <p class="text-sm text-gray-500">{{ $row->template->name ?? __('Unassigned') }}</p>
                        <p class="text-2xl font-semibold text-gray-900 dark:text-white mt-1">{{ $row->total }}</p>
                    </div>
                @endforeach
            </div>
        </div>
    @endif
</div>

@push('scripts')
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
        const donationCtx = document.getElementById('donationTrendChart');
        new Chart(donationCtx, {
            type: 'line',
            data: {
                labels: @json($this->donationTrend['labels']),
                datasets: [{
                    label: '৳',
                    data: @json($this->donationTrend['values']),
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99,102,241,0.2)',
                    tension: 0.4,
                    fill: true,
                }],
            },
            options: {
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } },
            },
        });

        const feedbackCtx = document.getElementById('feedbackTrendChart');
        new Chart(feedbackCtx, {
            type: 'bar',
            data: {
                labels: @json($this->feedbackTrend['labels']),
                datasets: [{
                    label: '{{ __('Submissions') }}',
                    data: @json($this->feedbackTrend['values']),
                    backgroundColor: '#22c55e',
                }],
            },
            options: {
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, precision: 0 } },
            },
        });
    </script>
@endpush
