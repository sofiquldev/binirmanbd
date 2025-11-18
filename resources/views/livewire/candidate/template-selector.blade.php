<div class="space-y-6">
    <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {{ __('Website Template') }}
        </h3>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
            {{ __('Preview the available templates and select the one that best represents your campaign website.') }}
        </p>
    </div>

    <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        @forelse ($templates as $template)
            <div class="border rounded-lg overflow-hidden shadow-sm {{ $currentTemplateId === $template->id ? 'border-indigo-500 ring-2 ring-indigo-300' : 'border-gray-200 dark:border-gray-700' }}">
                @if ($template->preview_image)
                    <img src="{{ asset($template->preview_image) }}" alt="{{ $template->name }}" class="w-full h-40 object-cover">
                @else
                    <div class="w-full h-40 bg-gradient-to-br from-slate-200 via-slate-100 to-white dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                        <span class="text-sm text-gray-500 dark:text-gray-300">{{ __('Preview coming soon') }}</span>
                    </div>
                @endif

                <div class="p-4 space-y-2">
                    <div class="flex items-center justify-between">
                        <h4 class="text-base font-semibold text-gray-900 dark:text-gray-100">
                            {{ $template->name }}
                        </h4>
                        @if ($currentTemplateId === $template->id)
                            <span class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                {{ __('Active') }}
                            </span>
                        @endif
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-300">
                        {{ $template->description ?? __('No description available') }}
                    </p>
                    <button
                        type="button"
                        wire:click="selectTemplate({{ $template->id }})"
                        class="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                        @disabled($currentTemplateId === $template->id)
                    >
                        {{ $currentTemplateId === $template->id ? __('Selected') : __('Select Template') }}
                    </button>
                </div>
            </div>
        @empty
            <div class="col-span-full bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                {{ __('No templates are currently available. Please contact the Super Admin to add templates.') }}
            </div>
        @endforelse
    </div>
</div>
