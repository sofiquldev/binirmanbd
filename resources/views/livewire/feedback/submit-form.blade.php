<form wire:submit.prevent="submit" class="space-y-4 bg-white/10 rounded-2xl p-6">
    <div class="grid md:grid-cols-2 gap-4">
        <div>
            <label class="text-sm text-white/80">{{ __('Name (optional)') }}</label>
            <input type="text" wire:model.defer="name" class="mt-1 w-full rounded-lg border border-white/20 bg-white/10 text-white px-3 py-2" placeholder="{{ __('Your name') }}">
            @error('name') <p class="text-sm text-rose-300">{{ $message }}</p> @enderror
        </div>
        <div>
            <label class="text-sm text-white/80">{{ __('Phone (optional)') }}</label>
            <input type="text" wire:model.defer="phone" class="mt-1 w-full rounded-lg border border-white/20 bg-white/10 text-white px-3 py-2" placeholder="+8801XXXXXXXX">
            @error('phone') <p class="text-sm text-rose-300">{{ $message }}</p> @enderror
        </div>
    </div>
    <div>
        <label class="text-sm text-white/80">{{ __('Email (optional)') }}</label>
        <input type="email" wire:model.defer="email" class="mt-1 w-full rounded-lg border border-white/20 bg-white/10 text-white px-3 py-2" placeholder="you@email.com">
        @error('email') <p class="text-sm text-rose-300">{{ $message }}</p> @enderror
    </div>
    <div>
        <label class="text-sm text-white/80">{{ __('Category') }}</label>
        <select wire:model="category" class="mt-1 w-full rounded-lg border border-white/20 bg-white/10 text-white px-3 py-2">
            @foreach ($categories as $categoryOption)
                <option value="{{ $categoryOption }}">{{ __(ucwords(str_replace('_', ' ', $categoryOption))) }}</option>
            @endforeach
        </select>
        @error('category') <p class="text-sm text-rose-300">{{ $message }}</p> @enderror
    </div>
    <div>
        <label class="text-sm text-white/80">{{ __('Describe the issue / feedback') }}</label>
        <textarea wire:model.defer="description" rows="4" class="mt-1 w-full rounded-lg border border-white/20 bg-white/10 text-white px-3 py-2"></textarea>
        @error('description') <p class="text-sm text-rose-300">{{ $message }}</p> @enderror
    </div>
    <div>
        <label class="text-sm text-white/80">{{ __('Attachment (photo/doc)') }}</label>
        <input type="file" wire:model="attachment" class="mt-1 w-full text-sm text-white/80">
        @error('attachment') <p class="text-sm text-rose-300">{{ $message }}</p> @enderror
    </div>

    <button type="submit" class="w-full py-3 rounded-xl font-semibold bg-indigo-500 hover:bg-indigo-400 text-white transition disabled:opacity-70" wire:loading.attr="disabled">
        <span wire:loading.remove>{{ __('Submit Feedback') }}</span>
        <span wire:loading>{{ __('Sending...') }}</span>
    </button>
</form>
