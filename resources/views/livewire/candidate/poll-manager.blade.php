<div class="space-y-8">
    <section class="space-y-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ __('Create Poll') }}</h3>
        <form wire:submit.prevent="save" class="grid gap-4">
            <div>
                <x-input-label value="{{ __('Question') }}"/>
                <x-text-input wire:model.defer="question" class="mt-1 block w-full"/>
                <x-input-error :messages="$errors->get('question')" class="mt-1"/>
            </div>
            <div>
                <label class="text-sm text-gray-600 dark:text-gray-300 inline-flex items-center">
                    <input type="checkbox" wire:model="allows_multiple" class="rounded border-gray-300 text-indigo-600 shadow-sm">
                    <span class="ml-2">{{ __('Allow multiple answers') }}</span>
                </label>
            </div>
            <div class="space-y-2">
                <x-input-label value="{{ __('Options') }}"/>
                @foreach ($options as $index => $option)
                    <div class="flex items-center space-x-2">
                        <x-text-input wire:model.defer="options.{{ $index }}" class="flex-1"/>
                        @if (count($options) > 2)
                            <button type="button" wire:click="removeOption({{ $index }})" class="text-sm text-rose-600">{{ __('Remove') }}</button>
                        @endif
                    </div>
                @endforeach
                <x-primary-button type="button" wire:click="addOption">{{ __('Add Option') }}</x-primary-button>
                <x-input-error :messages="$errors->get('options')" class="mt-1"/>
            </div>
            <div class="flex justify-end">
                <x-primary-button type="submit">{{ __('Publish Poll') }}</x-primary-button>
            </div>
        </form>
    </section>

    <section class="space-y-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ __('Recent Polls') }}</h3>
        <div class="grid gap-4 md:grid-cols-2">
            @forelse ($polls as $poll)
                <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-2">
                    <div class="flex items-center justify-between">
                        <p class="text-sm text-gray-500">{{ $poll->status }}</p>
                        @if($poll->status !== 'closed')
                            <button type="button" wire:click="closePoll({{ $poll->id }})" class="text-xs text-rose-600">{{ __('Close') }}</button>
                        @endif
                    </div>
                    <p class="font-semibold text-gray-900 dark:text-white">{{ $poll->question }}</p>
                    <ul class="space-y-1 text-sm">
                        @foreach ($poll->options as $option)
                            <li class="flex items-center justify-between">
                                <span>{{ $option->label }}</span>
                                <span class="font-semibold">{{ $option->votes }}</span>
                            </li>
                        @endforeach
                    </ul>
                </div>
            @empty
                <p class="text-sm text-gray-500">{{ __('No polls yet.') }}</p>
            @endforelse
        </div>
    </section>
</div>
