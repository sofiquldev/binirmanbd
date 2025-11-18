@php
    $user = auth()->user();
@endphp

<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Binirman BD Super Admin') }}
        </h2>
    </x-slot>

    <div class="py-8">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
            <div class="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {{ __('Welcome, :name', ['name' => $user->name]) }}
                </h3>
                <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {{ __('Centralized oversight of all MP tenants, escalation queues, and donation ledgers.') }}
                </p>
            </div>

            <livewire:admin.overview />
        </div>
    </div>
</x-app-layout>


