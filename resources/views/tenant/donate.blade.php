<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ __('Donate to :name', ['name' => $candidate->name]) }}</title>
    @vite('resources/css/app.css')
    @livewireStyles
</head>
<body class="min-h-screen bg-slate-950 text-white">
    <header class="py-6 border-b border-white/10">
        <div class="max-w-4xl mx-auto px-6 flex items-center justify-between">
            <div>
                <p class="text-xs uppercase tracking-[0.3em] text-white/60">{{ $candidate->constituency }}</p>
                <h1 class="text-2xl font-bold">{{ $candidate->name }}</h1>
            </div>
            <a href="{{ route('tenant.home') }}" class="text-sm text-white/70 hover:text-white">
                {{ __('Back to campaign site') }}
            </a>
        </div>
    </header>

    <main class="py-12">
        <div class="max-w-4xl mx-auto px-6 grid lg:grid-cols-2 gap-8">
            <div class="space-y-4">
                <h2 class="text-3xl font-bold">{{ __('Support This Campaign') }}</h2>
                <p class="text-white/70">
                    {{ __('Your contribution flows into the Binirman BD central wallet and is redistributed to the candidate based on approved budgets. All donations are fully auditable and receipts are provided instantly.') }}
                </p>
                <ul class="space-y-2 text-white/70 text-sm">
                    <li>• {{ __('KYC required: name, ID, and contact') }}</li>
                    <li>• {{ __('Payment gateways: SSLCommerz, bKash, Nagad, Stripe') }}</li>
                    <li>• {{ __('Offline donations can be logged by campaign staff and verified by Super Admin') }}</li>
                </ul>
                <div class="bg-white/10 rounded-xl p-4">
                    <p class="text-sm uppercase tracking-[0.3em] text-white/60">{{ __('Scan to donate') }}</p>
                    <div class="mt-3 w-40 h-40 bg-white rounded-xl flex items-center justify-center font-semibold text-gray-900">
                        {{ __('QR') }}
                    </div>
                </div>
            </div>
            <div>
                <livewire:donations.donate-form :candidate="$candidate" />
            </div>
        </div>
    </main>
    @livewireScripts
</body>
</html>


