<div class="fixed bottom-4 right-4 z-50">
    @if($isOpen)
        <div class="bg-white rounded-lg shadow-2xl w-96 h-[500px] flex flex-col">
            <div class="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
                <h3 class="font-semibold">{{ __('Chat Support', [], 'en') }}</h3>
                <button wire:click="toggle" class="text-white hover:text-gray-200">✕</button>
            </div>
            <div class="flex-1 overflow-y-auto p-4 space-y-3">
                @foreach($messages as $message)
                    <div class="flex {{ $message['type'] === 'user' ? 'justify-end' : 'justify-start' }}">
                        <div class="max-w-[80%] rounded-lg p-3 {{ $message['type'] === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800' }}">
                            {{ $message['text'] }}
                        </div>
                    </div>
                @endforeach
            </div>
            <div class="p-4 border-t">
                <form wire:submit.prevent="ask" class="flex gap-2">
                    <input type="text" wire:model="query" placeholder="{{ __('Type your question...', [], 'en') }}" 
                           class="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        {{ __('Send', [], 'en') }}
                    </button>
                </form>
            </div>
        </div>
    @else
        <button wire:click="toggle" class="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
        </button>
    @endif
</div>
