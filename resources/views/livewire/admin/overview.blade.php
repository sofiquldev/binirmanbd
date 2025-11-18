<div class="space-y-6">
    <div class="grid gap-4 md:grid-cols-3">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <p class="text-sm text-gray-500">{{ __('Total Tenants') }}</p>
            <p class="text-3xl font-semibold text-gray-900 dark:text-white mt-2">{{ $tenantCount }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <p class="text-sm text-gray-500">{{ __('Templates Live') }}</p>
            <p class="text-3xl font-semibold text-gray-900 dark:text-white mt-2">{{ $activeTemplates->count() }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <p class="text-sm text-gray-500">{{ __('Escalated Issues') }}</p>
            <p class="text-3xl font-semibold text-gray-900 dark:text-white mt-2">{{ $escalatedFeedback->count() }}</p>
        </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ __('Recent Donations Across Tenants') }}</h3>
            <a href="#" class="text-sm text-indigo-600">{{ __('View all') }}</a>
        </div>
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                <thead>
                    <tr class="text-gray-500">
                        <th class="px-4 py-2 text-left">{{ __('Candidate') }}</th>
                        <th class="px-4 py-2 text-left">{{ __('Donor') }}</th>
                        <th class="px-4 py-2 text-left">{{ __('Amount') }}</th>
                        <th class="px-4 py-2 text-left">{{ __('Source') }}</th>
                        <th class="px-4 py-2 text-left">{{ __('Status') }}</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                    @forelse ($recentDonations as $donation)
                        <tr>
                            <td class="px-4 py-3">{{ $donation->candidate->name ?? __('N/A') }}</td>
                            <td class="px-4 py-3">{{ $donation->donor_name }}</td>
                            <td class="px-4 py-3">৳{{ number_format($donation->amount, 2) }}</td>
                            <td class="px-4 py-3 capitalize">{{ $donation->source }}</td>
                            <td class="px-4 py-3">
                                <span class="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                                    {{ ucfirst($donation->status) }}
                                </span>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="px-4 py-4 text-center text-gray-500">{{ __('No donations logged yet.') }}</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ __('Escalated Feedback') }}</h3>
            <a href="#" class="text-sm text-indigo-600">{{ __('Manage queue') }}</a>
        </div>
        <div class="space-y-4">
            @forelse ($escalatedFeedback as $feedback)
                <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-semibold text-gray-900 dark:text-white">
                                {{ $feedback->candidate->name ?? __('Unknown candidate') }}
                            </p>
                            <p class="text-xs text-gray-500">{{ $feedback->category }} • {{ $feedback->created_at->diffForHumans() }}</p>
                        </div>
                        <span class="text-xs px-2 py-1 rounded-full bg-rose-100 text-rose-700">{{ strtoupper($feedback->status) }}</span>
                    </div>
                    <p class="mt-2 text-sm text-gray-700 dark:text-gray-200">
                        {{ Str::limit($feedback->description, 160) }}
                    </p>
                </div>
            @empty
                <p class="text-sm text-gray-500">{{ __('No escalated issues at the moment.') }}</p>
            @endforelse
        </div>
    </div>
</div>
