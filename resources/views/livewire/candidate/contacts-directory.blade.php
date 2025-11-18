<div class="space-y-6">
    <form wire:submit.prevent="save" class="grid gap-4 md:grid-cols-2">
        <div class="space-y-1">
            <x-input-label value="{{ __('Name') }}"/>
            <x-text-input wire:model.defer="name" class="w-full"/>
            <x-input-error :messages="$errors->get('name')"/>
        </div>
        <div class="space-y-1">
            <x-input-label value="{{ __('Category') }}"/>
            <select wire:model="category" class="w-full rounded-md border-gray-300 shadow-sm">
                @foreach ($categories as $key => $label)
                    <option value="{{ $key }}">{{ __($label) }}</option>
                @endforeach
            </select>
            <x-input-error :messages="$errors->get('category')"/>
        </div>
        <div class="space-y-1">
            <x-input-label value="{{ __('Designation') }}"/>
            <x-text-input wire:model.defer="designation" class="w-full"/>
            <x-input-error :messages="$errors->get('designation')"/>
        </div>
        <div class="space-y-1">
            <x-input-label value="{{ __('Organization') }}"/>
            <x-text-input wire:model.defer="organization" class="w-full"/>
            <x-input-error :messages="$errors->get('organization')"/>
        </div>
        <div class="space-y-1">
            <x-input-label value="{{ __('Phone') }}"/>
            <x-text-input wire:model.defer="phone" class="w-full"/>
            <x-input-error :messages="$errors->get('phone')"/>
        </div>
        <div class="space-y-1">
            <x-input-label value="{{ __('Email') }}"/>
            <x-text-input wire:model.defer="email" class="w-full"/>
            <x-input-error :messages="$errors->get('email')"/>
        </div>
        <div class="space-y-1 md:col-span-2">
            <x-input-label value="{{ __('Notes') }}"/>
            <textarea wire:model.defer="notes" rows="2" class="w-full rounded-md border-gray-300 shadow-sm"></textarea>
            <label class="inline-flex items-center mt-2 text-sm text-gray-600 dark:text-gray-300">
                <input type="checkbox" wire:model="is_verified" class="rounded border-gray-300 text-indigo-600 shadow-sm">
                <span class="ml-2">{{ __('Verified contact') }}</span>
            </label>
        </div>
        <div class="md:col-span-2 flex justify-end">
            <x-primary-button type="submit">{{ __('Save Contact') }}</x-primary-button>
        </div>
    </form>

    <div class="flex flex-wrap gap-3 items-center">
        <div class="flex-1">
            <x-text-input type="search" wire:model.debounce.500ms="search" placeholder="{{ __('Search contact...') }}" class="w-full"/>
        </div>
        <select wire:model="categoryFilter" class="rounded-md border-gray-300 shadow-sm">
            <option value="all">{{ __('All Categories') }}</option>
            @foreach ($categories as $key => $label)
                <option value="{{ $key }}">{{ __($label) }}</option>
            @endforeach
        </select>
        <label class="inline-flex items-center text-sm text-gray-600 dark:text-gray-300">
            <input type="checkbox" wire:model="verifiedOnly" class="rounded border-gray-300 text-indigo-600 shadow-sm">
            <span class="ml-2">{{ __('Verified only') }}</span>
        </label>
        <x-secondary-button type="button" wire:click="export('csv')">{{ __('Export CSV') }}</x-secondary-button>
        <x-secondary-button type="button" wire:click="export('pdf')">{{ __('Export PDF') }}</x-secondary-button>
    </div>

    <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            <thead class="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-200">
                <tr>
                    <th class="px-4 py-2 text-left">{{ __('Name') }}</th>
                    <th class="px-4 py-2 text-left">{{ __('Category') }}</th>
                    <th class="px-4 py-2 text-left">{{ __('Contact') }}</th>
                    <th class="px-4 py-2 text-left">{{ __('Actions') }}</th>
                </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                @forelse ($contacts as $contact)
                    <tr>
                        <td class="px-4 py-3">
                            <div class="font-semibold text-gray-900 dark:text-gray-100">{{ $contact->name }}</div>
                            <div class="text-xs text-gray-500">{{ $contact->designation }}</div>
                            @if($contact->organization)
                                <div class="text-xs text-gray-500">{{ $contact->organization }}</div>
                            @endif
                        </td>
                        <td class="px-4 py-3">
                            <span class="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
                                {{ __(str_replace('_', ' ', ucfirst($contact->category))) }}
                            </span>
                        </td>
                        <td class="px-4 py-3 space-y-1">
                            @if($contact->phone)
                                <a href="tel:{{ $contact->phone }}" class="block text-indigo-500 hover:underline">{{ $contact->phone }}</a>
                            @endif
                            @if($contact->email)
                                <a href="mailto:{{ $contact->email }}" class="block text-indigo-500 hover:underline">{{ $contact->email }}</a>
                            @endif
                        </td>
                        <td class="px-4 py-3 text-sm text-gray-500">
                            {{ $contact->is_verified ? __('Verified') : __('Pending verification') }}
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="4" class="px-4 py-6 text-center text-gray-500">
                            {{ __('No contacts found. Add your first contact above.') }}
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
