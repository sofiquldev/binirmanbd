<div class="max-w-2xl mx-auto p-6">
    @if($event)
        <div class="mb-6">
            <h2 class="text-2xl font-bold mb-2">{{ $event->title }}</h2>
            <p class="text-gray-600">{{ $event->description }}</p>
            <p class="mt-2"><strong>{{ __('Date:', [], 'en') }}</strong> {{ $event->event_date->format('F d, Y') }}</p>
            <p><strong>{{ __('Time:', [], 'en') }}</strong> {{ $event->event_time }}</p>
            <p><strong>{{ __('Location:', [], 'en') }}</strong> {{ $event->location }}</p>
        </div>
    @endif

    @if(session()->has('message'))
        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {{ session('message') }}
        </div>
    @endif

    @if(session()->has('error'))
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {{ session('error') }}
        </div>
    @endif

    @if(!$success)
        <form wire:submit="submit" class="space-y-4">
            <input type="hidden" wire:model="eventId">

            <div>
                <label class="block text-sm font-medium mb-1">{{ __('Name', [], 'en') }}</label>
                <input type="text" wire:model="name" class="w-full border rounded-lg px-3 py-2">
                @error('name') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
            </div>

            <div>
                <label class="block text-sm font-medium mb-1">{{ __('Email', [], 'en') }}</label>
                <input type="email" wire:model="email" class="w-full border rounded-lg px-3 py-2">
                @error('email') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
            </div>

            <div>
                <label class="block text-sm font-medium mb-1">{{ __('Phone', [], 'en') }}</label>
                <input type="tel" wire:model="phone" class="w-full border rounded-lg px-3 py-2">
                @error('phone') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
            </div>

            <div>
                <label class="block text-sm font-medium mb-1">{{ __('Number of Guests', [], 'en') }}</label>
                <input type="number" wire:model="guests" min="1" max="10" class="w-full border rounded-lg px-3 py-2">
                @error('guests') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
            </div>

            <div>
                <label class="block text-sm font-medium mb-1">{{ __('Notes', [], 'en') }}</label>
                <textarea wire:model="notes" rows="3" class="w-full border rounded-lg px-3 py-2"></textarea>
            </div>

            <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                {{ __('Confirm RSVP', [], 'en') }}
            </button>
        </form>
    @endif
</div>
