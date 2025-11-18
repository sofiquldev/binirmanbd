<form wire:submit.prevent="submit" class="bg-white/5 backdrop-blur rounded-2xl p-6 space-y-5">
    <div class="space-y-1">
        <label class="text-sm text-white/80">{{ __('Full Name') }}</label>
        <input type="text" wire:model.defer="donor_name" class="w-full rounded-lg border border-white/20 bg-white/10 text-white px-4 py-2 focus:ring-2 focus:ring-indigo-300" placeholder="{{ __('Your name') }}">
        @error('donor_name') <p class="text-sm text-rose-300">{{ $message }}</p> @enderror
    </div>
    <div class="grid md:grid-cols-2 gap-4">
        <div class="space-y-1">
            <label class="text-sm text-white/80">{{ __('National ID / Passport') }}</label>
            <input type="text" wire:model.defer="donor_id_number" class="w-full rounded-lg border border-white/20 bg-white/10 text-white px-4 py-2" placeholder="NID / Passport">
            @error('donor_id_number') <p class="text-sm text-rose-300">{{ $message }}</p> @enderror
        </div>
        <div class="space-y-1">
            <label class="text-sm text-white/80">{{ __('Phone') }}</label>
            <input type="text" wire:model.defer="donor_phone" class="w-full rounded-lg border border-white/20 bg-white/10 text-white px-4 py-2" placeholder="+8801XXXXXXXXX">
            @error('donor_phone') <p class="text-sm text-rose-300">{{ $message }}</p> @enderror
        </div>
    </div>
    <div class="grid md:grid-cols-2 gap-4">
        <div class="space-y-1">
            <label class="text-sm text-white/80">{{ __('Email') }}</label>
            <input type="email" wire:model.defer="donor_email" class="w-full rounded-lg border border-white/20 bg-white/10 text-white px-4 py-2" placeholder="you@email.com">
            @error('donor_email') <p class="text-sm text-rose-300">{{ $message }}</p> @enderror
        </div>
        <div class="space-y-1">
            <label class="text-sm text-white/80">{{ __('Amount') }}</label>
            <div class="flex items-center gap-2">
                <select wire:model="currency" class="rounded-lg border border-white/20 bg-white/10 text-white px-3 py-2">
                    <option value="BDT">BDT</option>
                    <option value="USD">USD</option>
                </select>
                <input type="number" step="10" wire:model="amount" class="w-full rounded-lg border border-white/20 bg-white/10 text-white px-4 py-2" placeholder="1000">
            </div>
            @error('amount') <p class="text-sm text-rose-300">{{ $message }}</p> @enderror
        </div>
    </div>
    <div class="space-y-1">
        <label class="text-sm text-white/80">{{ __('Choose Gateway') }}</label>
        <select wire:model="gateway" class="w-full rounded-lg border border-white/20 bg-white/10 text-white px-4 py-2">
            <option value="sslcommerz">SSLCommerz</option>
            <option value="bkash">bKash</option>
            <option value="nagad">Nagad</option>
            <option value="stripe">Stripe</option>
        </select>
        <p class="text-xs text-white/60">{{ __('You will be redirected securely via the selected provider.') }}</p>
        @error('gateway') <p class="text-sm text-rose-300">{{ $message }}</p> @enderror
    </div>
    <div class="space-y-1">
        <label class="text-sm text-white/80">{{ __('Message (optional)') }}</label>
        <textarea wire:model.defer="notes" rows="3" class="w-full rounded-lg border border-white/20 bg-white/10 text-white px-4 py-2" placeholder="{{ __('Share why you support this campaign') }}"></textarea>
        @error('notes') <p class="text-sm text-rose-300">{{ $message }}</p> @enderror
    </div>

    <button type="submit" class="w-full py-3 rounded-xl font-semibold bg-emerald-500 hover:bg-emerald-400 text-white transition disabled:opacity-70" wire:loading.attr="disabled">
        <span wire:loading.remove>{{ __('Proceed to Pay') }}</span>
        <span wire:loading>{{ __('Processing...') }}</span>
    </button>
</form>
