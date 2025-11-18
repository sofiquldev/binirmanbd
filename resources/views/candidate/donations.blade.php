<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Donations & Ledger') }}
        </h2>
    </x-slot>

    <div class="py-8 space-y-6">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    {{ __('Log Offline Donation') }}
                </h3>
                <livewire:candidate.offline-donation-form />
            </div>
        </div>

        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    {{ __('Recent Donations (stub)') }}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-300">
                    {{ __('Livewire table for donations will appear here. Use this section to review statuses, resend receipts, and export ledgers.') }}
                </p>
            </div>
        </div>
    </div>
</x-app-layout>


