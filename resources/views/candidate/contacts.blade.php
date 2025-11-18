<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Important Contacts Directory') }}
        </h2>
    </x-slot>

    <div class="py-8">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                <p class="mb-4 text-sm text-gray-600 dark:text-gray-300">
                    {{ __('Maintain verified touchpoints with election commission, law enforcement, medical services, and NGOs. Export at any time for field teams.') }}
                </p>
                <livewire:candidate.contacts-directory />
            </div>
        </div>
    </div>
</x-app-layout>


