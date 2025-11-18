<div class="space-y-8">
    <section class="space-y-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ __('Schedule Event') }}</h3>
        <form wire:submit.prevent="save" class="grid gap-4">
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <x-input-label value="{{ __('Title') }}"/>
                    <x-text-input wire:model.defer="title" class="mt-1 block w-full"/>
                    <x-input-error :messages="$errors->get('title')" class="mt-1"/>
                </div>
                <div class="flex items-center space-x-3 mt-6">
                    <label class="text-sm text-gray-600 dark:text-gray-300 inline-flex items-center">
                        <input type="checkbox" wire:model="is_virtual" class="rounded border-gray-300 text-indigo-600 shadow-sm">
                        <span class="ml-2">{{ __('Virtual event') }}</span>
                    </label>
                </div>
            </div>
            <div>
                <x-input-label value="{{ __('Description') }}"/>
                <textarea wire:model.defer="description" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
                <x-input-error :messages="$errors->get('description')" class="mt-1"/>
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
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <x-input-label value="{{ __('Location / Link') }}"/>
                    <x-text-input wire:model.defer="location" class="mt-1 block w-full"/>
                    <x-input-error :messages="$errors->get('location')" class="mt-1"/>
                </div>
                <div>
                    <x-input-label value="{{ __('RSVP Limit') }}"/>
                    <x-text-input type="number" wire:model.defer="rsvp_limit" class="mt-1 block w-full"/>
                    <x-input-error :messages="$errors->get('rsvp_limit')" class="mt-1"/>
                </div>
            </div>
            <div class="grid md:grid-cols-3 gap-4">
                <div>
                    <x-input-label value="{{ __('Map URL') }}"/>
                    <x-text-input wire:model.defer="map_url" class="mt-1 block w-full"/>
                    <x-input-error :messages="$errors->get('map_url')" class="mt-1"/>
                </div>
                <div>
                    <x-input-label value="{{ __('Latitude') }}"/>
                    <x-text-input wire:model.defer="latitude" class="mt-1 block w-full"/>
                    <x-input-error :messages="$errors->get('latitude')" class="mt-1"/>
                </div>
                <div>
                    <x-input-label value="{{ __('Longitude') }}"/>
                    <x-text-input wire:model.defer="longitude" class="mt-1 block w-full"/>
                    <x-input-error :messages="$errors->get('longitude')" class="mt-1"/>
                </div>
            </div>
            <div class="flex justify-end">
                <x-primary-button type="submit">{{ __('Add Event') }}</x-primary-button>
            </div>
        </form>
    </section>

    <section class="space-y-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ __('Upcoming Events') }}</h3>
        <div class="grid gap-4 md:grid-cols-2">
            @forelse ($events as $event)
                <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-2">
                    <div class="flex items-center justify-between">
                        <p class="text-sm text-gray-500">{{ $event->starts_at->format('d M Y H:i') }}</p>
                        <span class="text-xs text-gray-500">{{ $event->is_virtual ? __('Virtual') : __('In-person') }}</span>
                    </div>
                    <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ $event->title }}</p>
                    <p class="text-sm text-gray-700 dark:text-gray-200">{{ Str::limit($event->description, 120) }}</p>
                    <p class="text-xs text-gray-500">{{ $event->location }}</p>
                    <p class="text-xs text-indigo-600">{{ __('RSVPs: :count', ['count' => $event->rsvps->count()]) }}</p>
                </div>
            @empty
                <p class="text-sm text-gray-500">{{ __('No events scheduled.') }}</p>
            @endforelse
        </div>
    </section>

    <section class="space-y-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ __('Recent RSVPs') }}</h3>
        <div class="border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
            @forelse ($latestRsvps as $rsvp)
                <div class="p-4">
                    <p class="font-semibold text-gray-900 dark:text-white">{{ $rsvp->name }}</p>
                    <p class="text-sm text-gray-500">{{ $rsvp->email ?? $rsvp->phone }}</p>
                    <p class="text-xs text-gray-500">{{ __('Event: :title', ['title' => $rsvp->event->title ?? '—']) }}</p>
                </div>
            @empty
                <p class="p-4 text-sm text-gray-500">{{ __('No RSVPs yet.') }}</p>
            @endforelse
        </div>
    </section>
</div>
