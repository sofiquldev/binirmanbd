<div class="max-w-2xl mx-auto p-6">
    @if(session()->has('message'))
        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {{ session('message') }}
        </div>
    @endif

    <form wire:submit="submit" class="space-y-4">
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
            <label class="block text-sm font-medium mb-1">{{ __('Purpose', [], 'en') }}</label>
            <input type="text" wire:model="purpose" class="w-full border rounded-lg px-3 py-2">
            @error('purpose') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium mb-1">{{ __('Preferred Date', [], 'en') }}</label>
                <input type="date" wire:model="preferred_date" min="{{ date('Y-m-d', strtotime('+1 day')) }}" class="w-full border rounded-lg px-3 py-2">
                @error('preferred_date') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
            </div>

            <div>
                <label class="block text-sm font-medium mb-1">{{ __('Preferred Time', [], 'en') }}</label>
                <input type="time" wire:model="preferred_time" class="w-full border rounded-lg px-3 py-2">
                @error('preferred_time') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
            </div>
        </div>

        <div>
            <label class="block text-sm font-medium mb-1">{{ __('Notes', [], 'en') }}</label>
            <textarea wire:model="notes" rows="3" class="w-full border rounded-lg px-3 py-2"></textarea>
        </div>

        <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            {{ __('Request Appointment', [], 'en') }}
        </button>
    </form>
</div>
