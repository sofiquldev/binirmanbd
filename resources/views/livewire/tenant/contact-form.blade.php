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
            <label class="block text-sm font-medium mb-1">{{ __('Type', [], 'en') }}</label>
            <select wire:model="type" class="w-full border rounded-lg px-3 py-2">
                <option value="general">{{ __('General Inquiry', [], 'en') }}</option>
                <option value="volunteer">{{ __('Volunteer Sign-up', [], 'en') }}</option>
                <option value="inquiry">{{ __('Campaign Inquiry', [], 'en') }}</option>
            </select>
        </div>

        <div>
            <label class="block text-sm font-medium mb-1">{{ __('Subject', [], 'en') }}</label>
            <input type="text" wire:model="subject" class="w-full border rounded-lg px-3 py-2">
            @error('subject') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
        </div>

        <div>
            <label class="block text-sm font-medium mb-1">{{ __('Message', [], 'en') }}</label>
            <textarea wire:model="message" rows="5" class="w-full border rounded-lg px-3 py-2"></textarea>
            @error('message') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
        </div>

        <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            {{ __('Send Message', [], 'en') }}
        </button>
    </form>
</div>
