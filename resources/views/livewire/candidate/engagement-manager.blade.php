<div class="space-y-10">
    <section class="space-y-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ __('Counters & Milestones') }}</h3>
        <form wire:submit.prevent="saveCounter" class="grid md:grid-cols-3 gap-4">
            <div>
                <x-input-label value="{{ __('Label') }}"/>
                <x-text-input wire:model.defer="counter_label" class="mt-1 block w-full"/>
                <x-input-error :messages="$errors->get('counter_label')" class="mt-1"/>
            </div>
            <div>
                <x-input-label value="{{ __('Value') }}"/>
                <x-text-input type="number" wire:model.defer="counter_value" class="mt-1 block w-full"/>
                <x-input-error :messages="$errors->get('counter_value')" class="mt-1"/>
            </div>
            <div>
                <x-input-label value="{{ __('Accent Color') }}"/>
                <x-text-input wire:model.defer="counter_color" placeholder="#22c55e" class="mt-1 block w-full"/>
            </div>
            <div class="md:col-span-3 flex justify-end">
                <x-primary-button type="submit">{{ __('Add Counter') }}</x-primary-button>
            </div>
        </form>
        <div class="grid md:grid-cols-3 gap-4">
            @foreach ($counters as $counter)
                <div class="rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
                    <p class="text-3xl font-bold" style="color: {{ $counter->color ?? '#374151' }}">{{ $counter->value }}</p>
                    <p class="text-sm text-gray-500">{{ $counter->label }}</p>
                </div>
            @endforeach
        </div>
    </section>

    <section class="space-y-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ __('Testimonials') }}</h3>
        <form wire:submit.prevent="saveTestimonial" class="grid md:grid-cols-2 gap-4">
            <div>
                <x-input-label value="{{ __('Name') }}"/>
                <x-text-input wire:model.defer="testimonial_name" class="mt-1 block w-full"/>
                <x-input-error :messages="$errors->get('testimonial_name')" class="mt-1"/>
            </div>
            <div>
                <x-input-label value="{{ __('Role / Org') }}"/>
                <x-text-input wire:model.defer="testimonial_designation" class="mt-1 block w-full"/>
            </div>
            <div class="md:col-span-2">
                <x-input-label value="{{ __('Quote') }}"/>
                <textarea wire:model.defer="testimonial_quote" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
                <x-input-error :messages="$errors->get('testimonial_quote')" class="mt-1"/>
            </div>
            <div class="md:col-span-2 flex justify-end">
                <x-primary-button type="submit">{{ __('Add Testimonial') }}</x-primary-button>
            </div>
        </form>
        <div class="grid md:grid-cols-2 gap-4">
            @foreach ($testimonials as $testimonial)
                <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <p class="text-sm text-gray-500">{{ $testimonial->designation }}</p>
                    <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ $testimonial->name }}</p>
                    <p class="text-sm text-gray-700 dark:text-gray-200 mt-2">“{{ $testimonial->quote }}”</p>
                </div>
            @endforeach
        </div>
    </section>

    <section class="space-y-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ __('Pricing / Donation Tiers') }}</h3>
        <form wire:submit.prevent="savePricing" class="grid md:grid-cols-3 gap-4">
            <div>
                <x-input-label value="{{ __('Tier Name') }}"/>
                <x-text-input wire:model.defer="pricing_name" class="mt-1 block w-full"/>
                <x-input-error :messages="$errors->get('pricing_name')" class="mt-1"/>
            </div>
            <div>
                <x-input-label value="{{ __('Amount') }}"/>
                <x-text-input type="number" step="100" wire:model.defer="pricing_amount" class="mt-1 block w-full"/>
            </div>
            <div>
                <x-input-label value="{{ __('Features (comma separated)') }}"/>
                <x-text-input wire:model.defer="pricing_features" class="mt-1 block w-full"/>
            </div>
            <div class="md:col-span-3">
                <x-input-label value="{{ __('Description') }}"/>
                <textarea wire:model.defer="pricing_description" rows="2" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
            </div>
            <div class="md:col-span-3 flex justify-end">
                <x-primary-button type="submit">{{ __('Add Tier') }}</x-primary-button>
            </div>
        </form>
        <div class="grid md:grid-cols-3 gap-4">
            @foreach ($pricing as $tier)
                <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <p class="text-sm text-gray-500">{{ __('Tier') }}</p>
                    <p class="text-xl font-semibold text-gray-900 dark:text-white">{{ $tier->name }}</p>
                    @if($tier->amount)
                        <p class="text-2xl font-bold mt-2">৳{{ number_format($tier->amount, 0) }}</p>
                    @endif
                    <ul class="mt-2 text-sm text-gray-600 space-y-1">
                        @foreach ((array) $tier->features as $feature)
                            <li>• {{ $feature }}</li>
                        @endforeach
                    </ul>
                </div>
            @endforeach
        </div>
    </section>

    <section class="space-y-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ __('Popups & Notifications') }}</h3>
        <form wire:submit.prevent="savePopup" class="grid gap-4">
            <div>
                <x-input-label value="{{ __('Popup Title') }}"/>
                <x-text-input wire:model.defer="popup_title" class="mt-1 block w-full"/>
                <x-input-error :messages="$errors->get('popup_title')" class="mt-1"/>
            </div>
            <div>
                <x-input-label value="{{ __('Popup Content') }}"/>
                <textarea wire:model.defer="popup_content" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
                <x-input-error :messages="$errors->get('popup_content')" class="mt-1"/>
            </div>
            <div class="flex justify-end">
                <x-primary-button type="submit">{{ __('Save Popup') }}</x-primary-button>
            </div>
        </form>
        <div class="grid md:grid-cols-2 gap-4">
            @foreach ($popups as $popup)
                <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <p class="text-xs text-gray-500">{{ __('Popup') }}</p>
                    <p class="text-lg font-semibold">{{ $popup->title }}</p>
                    <p class="text-sm text-gray-600">{{ $popup->content }}</p>
                </div>
            @endforeach
        </div>
        <form wire:submit.prevent="saveNotification" class="grid md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
                <x-input-label value="{{ __('Sales / Donation Notification') }}"/>
                <x-text-input wire:model.defer="notification_message" class="mt-1 block w-full"/>
            </div>
            <div class="md:col-span-2 flex justify-end">
                <x-primary-button type="submit">{{ __('Push Notification') }}</x-primary-button>
            </div>
        </form>
        <div class="space-y-2 text-sm text-gray-600">
            @foreach ($notifications as $notification)
                <p>• {{ $notification->message }}</p>
            @endforeach
        </div>
    </section>

    <section class="space-y-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ __('Social Highlights') }}</h3>
        <form wire:submit.prevent="saveMedia" class="grid md:grid-cols-3 gap-4">
            <div>
                <x-input-label value="{{ __('Platform') }}"/>
                <select wire:model="media_type" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                </select>
            </div>
            <div class="md:col-span-2">
                <x-input-label value="{{ __('Embed URL') }}"/>
                <x-text-input wire:model.defer="media_url" class="mt-1 block w-full"/>
                <x-input-error :messages="$errors->get('media_url')" class="mt-1"/>
            </div>
            <div class="md:col-span-3 flex justify-end">
                <x-primary-button type="submit">{{ __('Add Media') }}</x-primary-button>
            </div>
        </form>
        <div class="grid md:grid-cols-3 gap-4">
            @foreach ($media as $item)
                <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-sm">
                    <p class="text-xs text-gray-500 uppercase">{{ $item->type }}</p>
                    <p class="font-semibold text-gray-900 dark:text-white">{{ $item->embed_url }}</p>
                </div>
            @endforeach
        </div>
    </section>
</div>
