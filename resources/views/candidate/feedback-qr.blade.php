@php
    $name = $candidate->name ?? 'Candidate';
    $constituencyName = optional($candidate->constituency)->name;
    // Example: "Feedback for Jalal Unus - Pabna-1"
    $title = $constituencyName
        ? 'Feedback for ' . $name . ' - ' . $constituencyName
        : 'Feedback for ' . $name;

    $description = 'Scan the QR code to share your feedback and problems with ' . $name . '.';
    $image = $candidate->image ?? null;
    $qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=' . urlencode($feedbackUrl);
@endphp

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title }} | Binirman BD</title>

    {{-- Open Graph / social meta --}}
    <meta property="og:title" content="{{ $title }}">
    <meta property="og:description" content="{{ $description }}">
    @if($image)
        <meta property="og:image" content="{{ $image }}">
    @endif
    <meta property="og:type" content="website">

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css">
    <style>
        body {
            background: radial-gradient(circle at top, #f1f5f9, #e2e8f0);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .card {
            max-width: 640px;
            width: 100%;
            background: #ffffff;
            border-radius: 1rem;
            box-shadow: 0 18px 35px rgba(15, 23, 42, 0.08);
            overflow: hidden;
        }
        .banner {
            position: relative;
            height: 180px;
            background: linear-gradient(120deg, #0f766e, #2563eb);
            color: #fff;
        }
        .banner-image {
            position: absolute;
            inset: 0;
            opacity: 0.75;
            object-fit: cover;
            width: 100%;
            height: 100%;
        }
        .banner-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(120deg, rgba(15,23,42,0.75), rgba(30,64,175,0.4));
        }
        .banner-content {
            position: relative;
            padding: 1.75rem;
            z-index: 10;
        }
        .qr-wrap {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            padding: 1.5rem 1.75rem 1.75rem;
        }
        .qr-border {
            padding: 1rem;
            border-radius: 1rem;
            border: 1px dashed #cbd5f5;
            background: #f8fafc;
        }
        .url {
            font-size: 0.75rem;
            color: #64748b;
            word-break: break-all;
        }
    </style>
</head>
<body>
<main class="card">
    <section class="banner">
        @if($image)
            <img src="{{ $image }}" alt="{{ $candidate->name ?? 'Candidate' }}" class="banner-image">
        @endif
        <div class="banner-overlay"></div>
        <div class="banner-content">
            <p style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: .08em; margin-bottom: .4rem; opacity: .8;">
                Feedback Form
            </p>
            <h1 style="font-size: 1.5rem; font-weight: 600; margin: 0;">
                {{ $candidate->name ?? 'Candidate' }}
            </h1>
            @if(optional($candidate->party)->name || optional($candidate->constituency)->name)
                <p style="font-size: .8rem; margin-top: .25rem; opacity: .9;">
                    {{ optional($candidate->party)->name }}
                    @if(optional($candidate->party)->name && optional($candidate->constituency)->name)
                        •
                    @endif
                    {{ optional($candidate->constituency)->name }}
                </p>
            @endif
        </div>
    </section>

    <section class="qr-wrap">
        <div class="qr-border">
            <img src="{{ $qrUrl }}" alt="Feedback QR code" width="260" height="260">
        </div>
        <div style="text-align: center;">
            <p style="font-size: .9rem; font-weight: 500; margin-bottom: .25rem;">
                Scan this QR code to share your feedback
            </p>
            <p class="url">{{ $feedbackUrl }}</p>
        </div>
    </section>
</main>
</body>
</html>


