<form wire:submit.prevent="save" class="space-y-5">
    <div class="grid gap-4 md:grid-cols-2">
        <div>
            <x-input-label value="{{ __('Donor Name') }}"/>
            <x-text-input type="text" wire:model.defer="donor_name" class="mt-1 block w-full"/>
            <x-input-error :messages="$errors->get('donor_name')" class="mt-1"/>
        </div>
        <div>
            <x-input-label value="{{ __('NID / Passport') }}"/>
            <x-text-input type="text" wire:model.defer="donor_id_number" class="mt-1 block w-full"/>
            <x-input-error :messages="$errors->get('donor_id_number')" class="mt-1"/>
        </div>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
        <div>
            <x-input-label value="{{ __('Phone') }}"/>
            <x-text-input type="text" wire:model.defer="donor_phone" class="mt-1 block w-full"/>
            <x-input-error :messages="$errors->get('donor_phone')" class="mt-1"/>
        </div>
        <div>
            <x-input-label value="{{ __('Email') }}"/>
            <x-text-input type="email" wire:model.defer="donor_email" class="mt-1 block w-full"/>
            <x-input-error :messages="$errors->get('donor_email')" class="mt-1"/>
        </div>
    </div>

    <div class="grid gap-4 md:grid-cols-3">
        <div>
            <x-input-label value="{{ __('Method') }}"/>
            <select wire:model="method" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                <option value="cash">{{ __('Cash') }}</option>
                <option value="bank">{{ __('Bank Transfer') }}</option>
                <option value="cheque">{{ __('Cheque') }}</option>
            </select>
            <x-input-error :messages="$errors->get('method')" class="mt-1"/>
        </div>
        <div>
            <x-input-label value="{{ __('Amount') }}"/>
            <x-text-input type="number" step="10" wire:model="amount" class="mt-1 block w-full"/>
            <x-input-error :messages="$errors->get('amount')" class="mt-1"/>
        </div>
        <div>
            <x-input-label value="{{ __('Date Received') }}"/>
            <x-text-input type="date" wire:model="donation_date" class="mt-1 block w-full"/>
            <x-input-error :messages="$errors->get('donation_date')" class="mt-1"/>
        </div>
    </div>

    <div>
        <x-input-label value="{{ __('Proof (optional)') }}"/>
        <input type="file" wire:model="proof" class="mt-1 block w-full text-sm text-gray-500">
        <x-input-error :messages="$errors->get('proof')" class="mt-1"/>
    </div>

    <div>
        <x-input-label value="{{ __('Notes') }}"/>
        <textarea wire:model.defer="notes" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
        <x-input-error :messages="$errors->get('notes')" class="mt-1"/>
    </div>

    <div class="flex justify-end">
        <x-primary-button type="submit" wire:loading.attr="disabled">
            <span wire:loading.remove>{{ __('Log Offline Donation') }}</span>
            <span wire:loading>{{ __('Saving...') }}</span>
        </x-primary-button>
    </div>
</form>
