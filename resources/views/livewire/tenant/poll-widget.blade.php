<div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
    @if($poll)
        <h3 class="text-xl font-bold mb-4">{{ $poll->question }}</h3>

        @if(!$hasVoted && !$showResults)
            <form wire:submit.prevent="vote" class="space-y-3">
                @foreach($poll->options as $option)
                    <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input type="radio" wire:model="selectedOption" value="{{ $option->id }}" class="mr-3">
                        <span>{{ $option->option_text }}</span>
                    </label>
                @endforeach

                <button type="submit" class="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    {{ __('Vote', [], 'en') }}
                </button>
            </form>
        @else
            <div class="space-y-3">
                @foreach($poll->options as $option)
                    @php
                        $totalVotes = $poll->options->sum(fn($opt) => $opt->votes->count());
                        $optionVotes = $option->votes->count();
                        $percentage = $totalVotes > 0 ? round(($optionVotes / $totalVotes) * 100, 1) : 0;
                    @endphp
                    <div>
                        <div class="flex justify-between mb-1">
                            <span>{{ $option->option_text }}</span>
                            <span class="font-semibold">{{ $percentage }}% ({{ $optionVotes }})</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="bg-blue-600 h-2 rounded-full" style="width: {{ $percentage }}%"></div>
                        </div>
                    </div>
                @endforeach
            </div>

            @if($hasVoted)
                <p class="mt-4 text-sm text-gray-600">{{ __('Thank you for voting!', [], 'en') }}</p>
            @endif
        @endif
    @else
        <p class="text-gray-600">{{ __('No active polls at the moment.', [], 'en') }}</p>
    @endif
</div>
