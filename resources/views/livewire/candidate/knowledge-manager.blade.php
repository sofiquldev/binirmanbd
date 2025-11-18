<div class="space-y-6">
    <form wire:submit.prevent="save" class="grid gap-4">
        <div class="grid md:grid-cols-2 gap-4">
            <div>
                <x-input-label value="{{ __('Type') }}"/>
                <select wire:model="type" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                    <option value="faq">{{ __('FAQ (public)') }}</option>
                    <option value="chatbot">{{ __('Chatbot Knowledge') }}</option>
                </select>
                <x-input-error :messages="$errors->get('type')" class="mt-1"/>
            </div>
            <div class="flex items-end space-x-3">
                <label class="text-sm text-gray-600 dark:text-gray-300 inline-flex items-center mt-6">
                    <input type="checkbox" wire:model="is_public" class="rounded border-gray-300 text-indigo-600 shadow-sm">
                    <span class="ml-2">{{ __('Show publicly') }}</span>
                </label>
            </div>
        </div>
        <div>
            <x-input-label value="{{ __('Question') }}"/>
            <x-text-input type="text" wire:model.defer="question" class="mt-1 block w-full"/>
            <x-input-error :messages="$errors->get('question')" class="mt-1"/>
        </div>
        <div>
            <x-input-label value="{{ __('Answer') }}"/>
            <textarea wire:model.defer="answer" rows="4" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
            <x-input-error :messages="$errors->get('answer')" class="mt-1"/>
        </div>
        <div>
            <x-input-label value="{{ __('Tags (comma separated)') }}"/>
            <x-text-input type="text" wire:model.defer="tags" class="mt-1 block w-full"/>
            <x-input-error :messages="$errors->get('tags')" class="mt-1"/>
        </div>
        <div class="flex justify-end">
            <x-primary-button type="submit">{{ __('Save Entry') }}</x-primary-button>
        </div>
    </form>

    <div class="border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
        @forelse ($entries as $entry)
            <div class="p-4">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm uppercase text-gray-500">{{ strtoupper($entry->type) }}</p>
                        <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ $entry->question }}</p>
                    </div>
                    <button wire:click="delete({{ $entry->id }})" class="text-sm text-rose-600 hover:underline">{{ __('Delete') }}</button>
                </div>
                <p class="mt-2 text-sm text-gray-700 dark:text-gray-200">{{ $entry->answer }}</p>
                @if($entry->tags)
                    <p class="mt-1 text-xs text-gray-500">{{ __('Tags: :tags', ['tags' => $entry->tags]) }}</p>
                @endif
            </div>
        @empty
            <p class="p-4 text-sm text-gray-500">{{ __('No entries yet.') }}</p>
        @endforelse
    </div>
</div>
