<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $candidate->name }} — {{ config('app.name', 'Binirman BD') }}</title>
    @vite('resources/css/app.css')
</head>
<body class="bg-slate-950 text-white">
    <header class="bg-gradient-to-r from-indigo-600 to-pink-600 py-16">
        <div class="max-w-6xl mx-auto px-6 text-center space-y-4">
            <p class="uppercase tracking-widest text-sm text-white/80">
                {{ $candidate->constituency?->name ?? 'Constituency' }}
            </p>
            <h1 class="text-4xl md:text-6xl font-extrabold">{{ $candidate->name }}</h1>
            <p class="text-xl text-white/80">{{ $candidate->campaign_slogan ?? 'Building the people\'s parliament together' }}</p>
        </div>
    </header>
    <main class="max-w-6xl mx-auto px-6 py-16">
        <div class="prose prose-invert max-w-none">
            @if($candidate->about)
                <div class="mb-8">
                    <h2 class="text-2xl font-bold mb-4">About</h2>
                    <p class="text-gray-300 whitespace-pre-line">{{ $candidate->about }}</p>
                </div>
            @endif
        </div>
    </main>
</body>
</html>

