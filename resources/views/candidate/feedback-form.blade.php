@php
    $name = $candidate->name ?? 'Candidate';
    $constituencyName = optional($candidate->constituency)->name;
    $title = $constituencyName
        ? 'Feedback for ' . $name . ' - ' . $constituencyName
        : 'Feedback for ' . $name;
    $image = $candidate->image ?? null;
    $apiUrl = config('app.url') . '/api/v1/feedback/public';
@endphp

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title }} | Binirman BD</title>

    {{-- Open Graph / social meta --}}
    <meta property="og:title" content="{{ $title }}">
    <meta property="og:description" content="Share your feedback, problems, or suggestions with {{ $name }}.">
    @if($image)
        <meta property="og:image" content="{{ $image }}">
    @endif
    <meta property="og:type" content="website">

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css">
    <style>
        body {
            background: radial-gradient(circle at top, #f1f5f9, #e2e8f0);
            min-height: 100vh;
            padding: 1.5rem;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .container {
            max-width: 720px;
            margin: 0 auto;
        }
        .card {
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
        .form-section {
            padding: 2rem 1.75rem;
        }
        .alert {
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 1.5rem;
        }
        .alert-success {
            background: #d1fae5;
            color: #065f46;
            border: 1px solid #6ee7b7;
        }
        .alert-error {
            background: #fee2e2;
            color: #991b1b;
            border: 1px solid #fca5a5;
        }
        .form-group {
            margin-bottom: 1.25rem;
        }
        label {
            display: block;
            font-weight: 500;
            margin-bottom: 0.5rem;
            color: #1e293b;
        }
        input[type="text"],
        input[type="email"],
        input[type="tel"],
        select,
        textarea {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #cbd5e1;
            border-radius: 0.5rem;
            font-size: 1rem;
        }
        textarea {
            min-height: 120px;
            resize: vertical;
        }
        button[type="submit"] {
            width: 100%;
            padding: 0.875rem;
            background: #2563eb;
            color: #fff;
            border: none;
            border-radius: 0.5rem;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
        }
        button[type="submit"]:hover {
            background: #1d4ed8;
        }
        button[type="submit"]:disabled {
            background: #94a3b8;
            cursor: not-allowed;
        }
    </style>
</head>
<body>
<div class="container">
    <main class="card">
        <section class="banner">
            @if($image)
                <img src="{{ $image }}" alt="{{ $candidate->name ?? 'Candidate' }}" class="banner-image">
            @endif
            <div class="banner-overlay"></div>
            <div class="banner-content">
                <p style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: .08em; margin-bottom: .4rem; opacity: .8;">
                    Citizen Feedback Portal
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

        <section class="form-section">
            <p style="color: #64748b; margin-bottom: 1.5rem; text-align: center;">
                Submit objections, problems, or suggestions. Your case will be routed to the right team immediately.
            </p>

            <div id="alert-container"></div>

            <form id="feedback-form">
                <input type="hidden" name="candidate_id" value="{{ $candidate->id }}">

                <div class="form-group">
                    <label for="name">Name (Optional)</label>
                    <input type="text" id="name" name="name" placeholder="Your name">
                </div>

                <div class="form-group">
                    <label for="phone">Phone (Optional)</label>
                    <input type="tel" id="phone" name="phone" placeholder="Your phone number">
                </div>

                <div class="form-group">
                    <label for="email">Email (Optional)</label>
                    <input type="email" id="email" name="email" placeholder="your.email@example.com">
                </div>

                <div class="form-group">
                    <label for="category">Category <span style="color: #ef4444;">*</span></label>
                    <select id="category" name="category" required>
                        <option value="">Select a category</option>
                        <option value="complaint">Complaint</option>
                        <option value="suggestion">Suggestion</option>
                        <option value="problem">Problem</option>
                        <option value="appreciation">Appreciation</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="description">Description <span style="color: #ef4444;">*</span></label>
                    <textarea id="description" name="description" placeholder="Please describe your feedback in detail (minimum 10 characters)" required minlength="10"></textarea>
                </div>

                <div class="form-group">
                    <label for="attachment">Attachment (Optional)</label>
                    <input type="file" id="attachment" name="attachment" accept="image/*,.pdf,.doc,.docx">
                </div>

                <button type="submit" id="submit-btn">Submit Feedback</button>
            </form>

            <p style="margin-top: 1.5rem; font-size: 0.75rem; color: #64748b; text-align: center;">
                Status workflow: New → In Review → Assigned → Resolved. Unresolved cases escalate to Binirman BD HQ automatically.
            </p>
        </section>
    </main>
</div>

<script>
    const form = document.getElementById('feedback-form');
    const alertContainer = document.getElementById('alert-container');
    const submitBtn = document.getElementById('submit-btn');

    function showAlert(message, type = 'success') {
        alertContainer.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
        setTimeout(() => {
            alertContainer.innerHTML = '';
        }, 5000);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        const formData = new FormData(form);

        try {
            const response = await fetch('{{ $apiUrl }}', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                showAlert('Feedback submitted successfully! Reference: ' + data.reference, 'success');
                form.reset();
            } else {
                const errorMsg = data.message || data.error || 'Failed to submit feedback. Please try again.';
                showAlert(errorMsg, 'error');
            }
        } catch (error) {
            showAlert('An error occurred. Please check your connection and try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Feedback';
        }
    });
</script>
</body>
</html>

