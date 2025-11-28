@php
    $name = $candidate->name ?? 'Candidate';
    $constituencyName = optional($candidate->constituency)->name;
    $title = $constituencyName
        ? 'Donate to ' . $name . ' - ' . $constituencyName
        : 'Donate to ' . $name;
    $image = $candidate->image ?? null;
    $apiUrl = config('app.url') . '/api/v1/candidates/' . $candidate->id . '/donations/public';
    $settingsUrl = config('app.url') . '/api/v1/candidates/' . $candidate->id . '/donation-settings';
@endphp

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title }} | Binirman BD</title>

    {{-- Open Graph / social meta --}}
    <meta property="og:title" content="{{ $title }}">
    <meta property="og:description" content="Support {{ $name }} by making a donation.">
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
        .alert-info {
            background: #dbeafe;
            color: #1e40af;
            border: 1px solid #93c5fd;
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
        .required {
            color: #ef4444;
        }
        input[type="text"],
        input[type="email"],
        input[type="tel"],
        input[type="number"],
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
        .amount-buttons {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
            gap: 0.5rem;
            margin-top: 0.5rem;
        }
        .amount-btn {
            padding: 0.5rem;
            border: 1px solid #cbd5e1;
            background: #fff;
            border-radius: 0.5rem;
            cursor: pointer;
            transition: all 0.2s;
        }
        .amount-btn:hover {
            background: #f1f5f9;
            border-color: #2563eb;
        }
        .amount-btn.selected {
            background: #2563eb;
            color: #fff;
            border-color: #2563eb;
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
                    Support This Campaign
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
            <div id="alert-container"></div>
            <div id="loading-container" style="text-align: center; padding: 2rem;">
                <p>Loading donation form...</p>
            </div>

            <form id="donation-form" style="display: none;">
                <div class="form-group">
                    <label for="donor_name">Name <span class="required">*</span></label>
                    <input type="text" id="donor_name" name="donor_name" placeholder="Your name" required>
                </div>

                <div class="form-group" id="donor_name_bn-group" style="display: none;">
                    <label for="donor_name_bn">Name (Bengali)</label>
                    <input type="text" id="donor_name_bn" name="donor_name_bn" placeholder="আপনার নাম">
                </div>

                <div class="form-group" id="donor_phone-group">
                    <label for="donor_phone">Phone</label>
                    <input type="tel" id="donor_phone" name="donor_phone" placeholder="01XXXXXXXXX">
                </div>

                <div class="form-group" id="donor_email-group">
                    <label for="donor_email">Email</label>
                    <input type="email" id="donor_email" name="donor_email" placeholder="your.email@example.com">
                </div>

                <div class="form-group" id="donor_id_number-group" style="display: none;">
                    <label for="donor_id_number">ID Number (NID/Passport)</label>
                    <input type="text" id="donor_id_number" name="donor_id_number" placeholder="Optional">
                </div>

                <div class="form-group">
                    <label for="amount">Amount (BDT) <span class="required">*</span></label>
                    <input type="number" id="amount" name="amount" placeholder="Enter amount" min="10" step="1" required>
                    <div class="amount-buttons" id="amount-buttons"></div>
                </div>

                <div class="form-group">
                    <label for="currency">Currency</label>
                    <select id="currency" name="currency">
                        <option value="BDT">BDT (৳)</option>
                        <option value="USD">USD ($)</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="method">Payment Method <span class="required">*</span></label>
                    <select id="method" name="method" required>
                        <option value="">Select payment method</option>
                    </select>
                </div>

                <div id="payment-details" style="display: none;"></div>

                <div class="form-group">
                    <label for="notes">Notes (Optional)</label>
                    <textarea id="notes" name="notes" placeholder="Any additional information..."></textarea>
                </div>

                <button type="submit" id="submit-btn">Submit Donation</button>
            </form>
        </section>
    </main>
</div>

<script>
    const form = document.getElementById('donation-form');
    const alertContainer = document.getElementById('alert-container');
    const submitBtn = document.getElementById('submit-btn');
    const loadingContainer = document.getElementById('loading-container');
    let settings = null;
    let enabledMethods = [];

    function showAlert(message, type = 'success') {
        alertContainer.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
        setTimeout(() => {
            alertContainer.innerHTML = '';
        }, 5000);
    }

    async function loadSettings() {
        try {
            const response = await fetch('{{ $settingsUrl }}');
            const data = await response.json();

            if (!data.donations_enabled) {
                showAlert('Donations are currently disabled for this candidate.', 'error');
                loadingContainer.innerHTML = '<p style="color: #991b1b;">Donations are currently disabled.</p>';
                return;
            }

            settings = data;
            enabledMethods = data.enabled_payment_methods || [];

            // Show/hide fields based on settings
            if (data.show_donor_name_bn) {
                document.getElementById('donor_name_bn-group').style.display = 'block';
            }
            if (data.require_donor_phone) {
                document.getElementById('donor_phone').required = true;
                document.querySelector('#donor_phone-group label').innerHTML += ' <span class="required">*</span>';
            }
            if (data.require_donor_email) {
                document.getElementById('donor_email').required = true;
                document.querySelector('#donor_email-group label').innerHTML += ' <span class="required">*</span>';
            }
            if (data.require_donor_id) {
                document.getElementById('donor_id_number-group').style.display = 'block';
                document.getElementById('donor_id_number').required = true;
                document.querySelector('#donor_id_number-group label').innerHTML += ' <span class="required">*</span>';
            }

            // Set amount limits
            const amountInput = document.getElementById('amount');
            amountInput.min = data.minimum_amount || 10;
            if (data.maximum_amount) {
                amountInput.max = data.maximum_amount;
            }

            // Set default currency
            if (data.default_currency) {
                document.getElementById('currency').value = data.default_currency;
            }

            // Populate suggested amounts
            if (data.suggested_amounts && data.suggested_amounts.length > 0) {
                const amountButtons = document.getElementById('amount-buttons');
                data.suggested_amounts.forEach(amt => {
                    const btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = 'amount-btn';
                    btn.textContent = amt.toLocaleString() + ' ৳';
                    btn.onclick = () => {
                        amountInput.value = amt;
                        document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('selected'));
                        btn.classList.add('selected');
                    };
                    amountButtons.appendChild(btn);
                });
            }

            // Populate payment methods
            const methodSelect = document.getElementById('method');
            enabledMethods.forEach(method => {
                if (method.is_configured) {
                    const option = document.createElement('option');
                    option.value = method.code;
                    option.textContent = method.name + (method.name_bn ? ` (${method.name_bn})` : '');
                    methodSelect.appendChild(option);
                }
            });

            // Show payment details when method is selected
            methodSelect.addEventListener('change', (e) => {
                const selectedMethod = enabledMethods.find(m => m.code === e.target.value);
                const paymentDetails = document.getElementById('payment-details');
                
                if (selectedMethod) {
                    let detailsHtml = '<div class="alert alert-info">';
                    if (selectedMethod.code === 'bank' && selectedMethod.config) {
                        detailsHtml += `<strong>Bank Details:</strong><br>`;
                        if (selectedMethod.config.bank_name) detailsHtml += `Bank: ${selectedMethod.config.bank_name}<br>`;
                        if (selectedMethod.config.bank_account_name) detailsHtml += `Account Name: ${selectedMethod.config.bank_account_name}<br>`;
                        if (selectedMethod.config.bank_account_number) detailsHtml += `Account Number: ${selectedMethod.config.bank_account_number}<br>`;
                        if (selectedMethod.config.bank_routing_number) detailsHtml += `Routing: ${selectedMethod.config.bank_routing_number}<br>`;
                        if (selectedMethod.config.bank_branch) detailsHtml += `Branch: ${selectedMethod.config.bank_branch}`;
                    } else if (selectedMethod.code === 'bkash' && selectedMethod.config) {
                        detailsHtml += `<strong>bKash Number:</strong> ${selectedMethod.config.bkash_number || 'N/A'}`;
                    }
                    detailsHtml += '</div>';
                    paymentDetails.innerHTML = detailsHtml;
                    paymentDetails.style.display = 'block';
                } else {
                    paymentDetails.style.display = 'none';
                }
            });

            loadingContainer.style.display = 'none';
            form.style.display = 'block';
        } catch (error) {
            console.error('Failed to load settings:', error);
            showAlert('Failed to load donation form. Please try again later.', 'error');
            loadingContainer.innerHTML = '<p style="color: #991b1b;">Failed to load donation form.</p>';
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        const formData = {
            donor_name: document.getElementById('donor_name').value,
            donor_name_bn: document.getElementById('donor_name_bn').value || null,
            donor_id_number: document.getElementById('donor_id_number').value || null,
            donor_phone: document.getElementById('donor_phone').value || null,
            donor_email: document.getElementById('donor_email').value || null,
            amount: parseFloat(document.getElementById('amount').value),
            currency: document.getElementById('currency').value,
            method: document.getElementById('method').value,
            notes: document.getElementById('notes').value || null,
        };

        try {
            const response = await fetch('{{ $apiUrl }}', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                showAlert('Donation submitted successfully! Reference: ' + data.donation.transaction_reference, 'success');
                form.reset();
                
                // If SSLCommerz, redirect to payment gateway
                if (data.payment_data && formData.method === 'sslcommerz') {
                    setTimeout(() => {
                        showAlert('Redirecting to payment gateway...', 'info');
                        // TODO: Implement SSLCommerz redirect
                    }, 2000);
                }
            } else {
                const errorMsg = data.message || 'Failed to submit donation. Please try again.';
                showAlert(errorMsg, 'error');
            }
        } catch (error) {
            showAlert('An error occurred. Please check your connection and try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Donation';
        }
    });

    // Load settings on page load
    loadSettings();
</script>
</body>
</html>

