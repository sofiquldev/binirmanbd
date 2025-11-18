<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ __('Feedback for :name', ['name' => $candidate->name]) }}</title>
    @vite('resources/css/app.css')
    @livewireStyles
</head>
<body class="min-h-screen bg-slate-950 text-white">
    <header class="py-6 border-b border-white/10">
        <div class="max-w-3xl mx-auto px-6 text-center space-y-2">
            <p class="text-xs uppercase tracking-[0.3em] text-white/60">{{ __('Citizen Feedback Portal') }}</p>
            <h1 class="text-3xl font-bold">{{ $candidate->name }}</h1>
            <p class="text-white/70">{{ __('Submit objections, problems, or suggestions. Your case will be routed to the right team immediately.') }}</p>
        </div>
    </header>

    <main class="py-12">
        <div class="max-w-3xl mx-auto px-6">
            <livewire:feedback.submit-form :candidate="$candidate" />
            <p class="mt-6 text-xs text-white/50 text-center">
                {{ __('Status workflow: New → In Review → Assigned → Resolved. Unresolved cases escalate to Binirman BD HQ automatically.') }}
            </p>
        </div>
    </main>

    @livewireScripts
</body>
</html>


