<div class="space-y-8">
    <section class="space-y-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ __('Announcement Bar & Banner') }}</h3>
        <form wire:submit.prevent="saveAnnouncement" class="grid gap-4">
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <x-input-label value="{{ __('Type') }}"/>
                    <select wire:model="type" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                        <option value="banner">{{ __('Hero Banner') }}</option>
                        <option value="bar">{{ __('Sticky Bar') }}</option>
                    </select>
                    <x-input-error :messages="$errors->get('type')" class="mt-1"/>
                </div>
                <div class="flex items-end">
                    <label class="text-sm text-gray-600 dark:text-gray-300 inline-flex items-center w-full mt-1">
                        <input type="checkbox" wire:model="is_active" class="rounded border-gray-300 text-indigo-600 shadow-sm">
                        <span class="ml-2">{{ __('Active') }}</span>
                    </label>
                </div>
            </div>
            <div>
                <x-input-label value="{{ __('Title (optional)') }}"/>
                <x-text-input type="text" wire:model.defer="title" class="mt-1 block w-full"/>
                <x-input-error :messages="$errors->get('title')" class="mt-1"/>
            </div>
            <div>
                <x-input-label value="{{ __('Message') }}"/>
                <textarea wire:model.defer="message" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
                <x-input-error :messages="$errors->get('message')" class="mt-1"/>
            </div>
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <x-input-label value="{{ __('CTA Label') }}"/>
                    <x-text-input wire:model.defer="cta_label" class="mt-1 block w-full"/>
                    <x-input-error :messages="$errors->get('cta_label')" class="mt-1"/>
                </div>
                <div>
                    <x-input-label value="{{ __('CTA URL') }}"/>
                    <x-text-input wire:model.defer="cta_url" class="mt-1 block w-full"/>
                    <x-input-error :messages="$errors->get('cta_url')" class="mt-1"/>
                </div>
            </div>
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <x-input-label value="{{ __('Starts At') }}"/>
                    <x-text-input type="datetime-local" wire:model="starts_at" class="mt-1 block w-full"/>
                    <x-input-error :messages="$errors->get('starts_at')" class="mt-1"/>
                </div>
                <div>
                    <x-input-label value="{{ __('Ends At') }}"/>
                    <x-text-input type="datetime-local" wire:model="ends_at" class="mt-1 block w-full"/>
                    <x-input-error :messages="$errors->get('ends_at')" class="mt-1"/>
                </div>
            </div>
            <div class="flex justify-end">
                <x-primary-button type="submit">{{ __('Publish Announcement') }}</x-primary-button>
            </div>
        </form>

        <div class="border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
            @forelse ($announcements as $announcement)
                <div class="p-4">
                    <div class="flex items-center justify-between">
                        <p class="text-sm text-gray-500 uppercase">{{ $announcement->type }}</p>
                        <span class="text-xs px-2 py-1 rounded-full {{ $announcement->is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500' }}">
                            {{ $announcement->is_active ? __('Active') : __('Paused') }}
                        </span>
                    </div>
                    <p class="text-lg font-semibold text-gray-900 dark:text-white mt-1">{{ $announcement->title }}</p>
                    <p class="text-sm text-gray-700 dark:text-gray-200 mt-1">{{ $announcement->message }}</p>
                </div>
            @empty
                <p class="p-4 text-sm text-gray-500">{{ __('No announcements yet.') }}</p>
            @endforelse
        </div>
    </section>

    <section class="space-y-4">
        <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ __('Office Hours & Channels') }}</h3>
            <x-primary-button wire:click="updateHours">{{ __('Save Hours') }}</x-primary-button>
        </div>
        <div class="grid md:grid-cols-2 gap-4">
            @foreach ($hoursForm as $index => $hour)
                <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-2">
                    <p class="font-semibold text-gray-900 dark:text-white">{{ $hour['day'] }}</p>
                    <div class="flex items-center space-x-2">
                        <x-text-input type="time" wire:model="hours.{{ $index }}.opens_at" class="w-full" :disabled="$hour['is_closed']"/>
                        <x-text-input type="time" wire:model="hours.{{ $index }}.closes_at" class="w-full" :disabled="$hour['is_closed']"/>
                    </div>
                    <label class="text-sm text-gray-600 dark:text-gray-300 inline-flex items-center">
                        <input type="checkbox" wire:model="hours.{{ $index }}.is_closed" class="rounded border-gray-300 text-indigo-600 shadow-sm">
                        <span class="ml-2">{{ __('Closed') }}</span>
                    </label>
                </div>
            @endforeach
        </div>
        <div class="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 space-y-3">
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <x-input-label value="{{ __('WhatsApp Number') }}"/>
                    <x-text-input wire:model.defer="whatsapp_number" class="mt-1 block w-full"/>
                </div>
                <div class="flex items-end">
                    <label class="text-sm text-gray-600 dark:text-gray-300 inline-flex items-center">
                        <input type="checkbox" wire:model="translator_enabled" class="rounded border-gray-300 text-indigo-600 shadow-sm">
                        <span class="ml-2">{{ __('Enable Bengali-English Switch') }}</span>
                    </label>
                </div>
            </div>
            <x-primary-button type="button" wire:click="updateSettings">{{ __('Update Settings') }}</x-primary-button>
        </div>
    </section>
</div>
