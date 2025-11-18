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
            <p class="uppercase tracking-widest text-sm text-white/80">{{ __('Constituency: :constituency', ['constituency' => $candidate->constituency]) }}</p>
            <h1 class="text-4xl md:text-6xl font-extrabold">{{ $candidate->name }}</h1>
            <p class="text-xl text-white/80">{{ $candidate->campaign_slogan ?? __('Building the people’s parliament together') }}</p>
            <div class="flex flex-wrap gap-3 justify-center pt-6">
                <a href="{{ route('tenant.donate') }}" class="px-6 py-3 bg-white text-gray-900 rounded-full font-semibold hover:scale-105 transition">{{ __('Donate Now') }}</a>
                <a href="{{ route('tenant.feedback') }}" class="px-6 py-3 border border-white/60 rounded-full font-semibold hover:bg-white/10 transition">{{ __('Submit Feedback') }}</a>
            </div>
        </div>
    </header>

    <main class="py-16 space-y-20">
        <section class="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
            <div class="space-y-4">
                <h2 class="text-3xl font-bold">{{ __('Campaign Goals') }}</h2>
                <p class="text-white/80">{{ $candidate->campaign_goals ?? __('Empowering citizens through transparency, inclusive development, and accountable leadership.') }}</p>
            </div>
            <div class="bg-white/10 rounded-2xl p-6">
                <h3 class="text-xl font-semibold mb-4">{{ __('Quick Facts') }}</h3>
                <ul class="space-y-2 text-white/80">
                    <li>{{ __('Party: :party', ['party' => $candidate->party ?? __('Independent')]) }}</li>
                    <li>{{ __('Primary Domain: :domain', ['domain' => $candidate->primary_domain ?? request()->getHost()]) }}</li>
                    <li>{{ __('Custom Domain: :domain', ['domain' => $candidate->custom_domain ?? __('Pending')]) }}</li>
                </ul>
            </div>
        </section>

        <section id="news" class="bg-white text-gray-900 py-16">
            <div class="max-w-6xl mx-auto px-6">
                <h2 class="text-3xl font-bold mb-8">{{ __('Latest Updates') }}</h2>
                <div class="grid md:grid-cols-3 gap-8">
                    @foreach(range(1, 3) as $i)
                        <article class="border border-gray-200 rounded-lg p-4 space-y-3">
                            <p class="text-sm text-gray-500"> {{ now()->subDays($i)->format('M d, Y') }}</p>
                            <h3 class="text-xl font-semibold">{{ __('Campaign Update :number', ['number' => $i]) }}</h3>
                            <p class="text-gray-600">{{ __('Stories from the field, policy highlights, and upcoming rallies will appear here.') }}</p>
                        </article>
                    @endforeach
                </div>
            </div>
        </section>

        <section id="donate" class="max-w-4xl mx-auto px-6 text-center space-y-4">
            <h2 class="text-3xl font-bold">{{ __('Support the Campaign') }}</h2>
            <p class="text-white/80">{{ __('Scan the QR code or click below to make a secure donation.') }}</p>
            <div class="flex flex-col sm:flex-row gap-6 justify-center items-center pt-4">
                <div class="w-48 h-48 bg-white rounded-2xl flex items-center justify-center text-gray-700 font-semibold">
                    {{ __('QR Code') }}
                </div>
                <button class="px-6 py-3 bg-emerald-500 text-white rounded-full font-semibold hover:bg-emerald-400 transition">
                    {{ __('Donate Online') }}
                </button>
            </div>
        </section>
    </main>

    <footer class="bg-black/80 py-6 text-center text-sm text-white/70">
        {{ __('Paid for by Binirman BD campaign committee') }}
    </footer>
</body>
</html>


