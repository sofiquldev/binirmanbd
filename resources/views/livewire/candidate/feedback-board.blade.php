<div class="space-y-4">
    <div class="flex flex-wrap gap-2">
        <button wire:click="setStatusFilter('all')" @class([
            'px-3 py-1 rounded-full text-sm',
            $statusFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
        ])>{{ __('All') }}</button>
        @foreach ($statuses as $value => $label)
            <button wire:click="setStatusFilter('{{ $value }}')" @class([
                'px-3 py-1 rounded-full text-sm',
                $statusFilter === $value ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
            ])>{{ __($label) }}</button>
        @endforeach
    </div>

    <div class="border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
        @forelse ($items as $feedback)
            <div class="p-4 flex flex-col gap-2">
                <div class="flex items-center justify-between">
                    <div class="text-sm text-gray-600 dark:text-gray-300">
                        {{ $feedback->name ?? __('Anonymous citizen') }} • {{ $feedback->category }}
                    </div>
                    <select wire:change="updateStatus({{ $feedback->id }}, $event.target.value)" class="text-sm rounded-md border-gray-300 dark:bg-gray-800 dark:border-gray-700">
                        @foreach ($statuses as $value => $label)
                            <option value="{{ $value }}" @selected($feedback->status === $value)>{{ __($label) }}</option>
                        @endforeach
                    </select>
                </div>
                <p class="text-sm text-gray-800 dark:text-gray-100">
                    {{ Str::limit($feedback->description, 180) }}
                </p>
                <div class="text-xs text-gray-500 dark:text-gray-400 flex gap-4">
                    <span>{{ __('Submitted :time', ['time' => $feedback->created_at->diffForHumans()]) }}</span>
                    @if ($feedback->attachment_path)
                        <a href="{{ $feedback->attachment_path }}" target="_blank" class="text-indigo-500 hover:underline">{{ __('View attachment') }}</a>
                    @endif
                </div>
            </div>
        @empty
            <div class="p-4 text-sm text-gray-500 dark:text-gray-300">
                {{ __('No submissions yet for this filter.') }}
            </div>
        @endforelse
    </div>
</div>
