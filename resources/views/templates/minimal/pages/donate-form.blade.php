<!-- Donation Form Section -->
<section class="wpo-service-section section-padding" style="background: #f8fafc;">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-8 col-md-10 col-12">
                <div style="background: #fff; padding: 3rem 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <h2 style="font-size: 1.75rem; font-weight: 600; margin-bottom: 1rem; color: #1e293b; text-align: center;">
                        {{ $heading ?: __('template.donation.title') }}
                    </h2>
                    <p style="color: #64748b; margin-bottom: 2rem; text-align: center;">
                        {{ $description ?: __('template.donation.description') }}
                    </p>
                    
                    <div id="alert-container"></div>
                    <div id="loading-container" style="text-align: center; padding: 2rem;">
                        <p>{{ __('template.donation.loading_form') }}</p>
                    </div>

                    <form id="donation-form" style="display: none;">
                        <div class="form-group" style="margin-bottom: 1.25rem;">
                            <label for="donor_name" style="display: block; font-weight: 500; margin-bottom: 0.5rem; color: #1e293b;">{{ __('template.donation.name') }} <span style="color: #ef4444;">*</span></label>
                            <input type="text" id="donor_name" name="donor_name" placeholder="{{ __('template.donation.your_name') }}" required style="width: 100%; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 0.5rem; font-size: 1rem;">
                        </div>

                        <div class="form-group" id="donor_name_bn-group" style="display: none; margin-bottom: 1.25rem;">
                            <label for="donor_name_bn" style="display: block; font-weight: 500; margin-bottom: 0.5rem; color: #1e293b;">{{ __('template.donation.name_bengali') }}</label>
                            <input type="text" id="donor_name_bn" name="donor_name_bn" placeholder="{{ __('template.donation.your_name') }}" style="width: 100%; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 0.5rem; font-size: 1rem;">
                        </div>

                        <div class="form-group" id="donor_phone-group" style="margin-bottom: 1.25rem;">
                            <label for="donor_phone" style="display: block; font-weight: 500; margin-bottom: 0.5rem; color: #1e293b;">{{ __('template.donation.phone') }}</label>
                            <input type="tel" id="donor_phone" name="donor_phone" placeholder="{{ __('template.donation.your_phone') }}" style="width: 100%; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 0.5rem; font-size: 1rem;">
                        </div>

                        <div class="form-group" id="donor_email-group" style="margin-bottom: 1.25rem;">
                            <label for="donor_email" style="display: block; font-weight: 500; margin-bottom: 0.5rem; color: #1e293b;">{{ __('template.donation.email') }}</label>
                            <input type="email" id="donor_email" name="donor_email" placeholder="{{ __('template.donation.your_email') }}" style="width: 100%; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 0.5rem; font-size: 1rem;">
                        </div>

                        <div class="form-group" id="donor_id_number-group" style="display: none; margin-bottom: 1.25rem;">
                            <label for="donor_id_number" style="display: block; font-weight: 500; margin-bottom: 0.5rem; color: #1e293b;">{{ __('template.donation.id_number') }}</label>
                            <input type="text" id="donor_id_number" name="donor_id_number" placeholder="{{ __('template.donation.id_number') }}" style="width: 100%; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 0.5rem; font-size: 1rem;">
                        </div>

                        <div class="form-group" style="margin-bottom: 1.25rem;">
                            <label for="amount" style="display: block; font-weight: 500; margin-bottom: 0.5rem; color: #1e293b;">{{ __('template.donation.amount') }} <span style="color: #ef4444;">*</span></label>
                            <input type="number" id="amount" name="amount" placeholder="{{ __('template.donation.enter_amount') }}" min="10" step="1" required style="width: 100%; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 0.5rem; font-size: 1rem;">
                            <div class="amount-buttons" id="amount-buttons" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 0.5rem; margin-top: 0.5rem;"></div>
                        </div>

                        <div class="form-group" style="margin-bottom: 1.25rem;">
                            <label for="currency" style="display: block; font-weight: 500; margin-bottom: 0.5rem; color: #1e293b;">{{ __('template.donation.currency') }}</label>
                            <select id="currency" name="currency" style="width: 100%; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 0.5rem; font-size: 1rem;">
                                <option value="BDT">BDT (৳)</option>
                                <option value="USD">USD ($)</option>
                            </select>
                        </div>

                        <div class="form-group" style="margin-bottom: 1.25rem;">
                            <label for="method" style="display: block; font-weight: 500; margin-bottom: 0.5rem; color: #1e293b;">{{ __('template.donation.payment_method') }} <span style="color: #ef4444;">*</span></label>
                            <select id="method" name="method" required style="width: 100%; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 0.5rem; font-size: 1rem;">
                                <option value="">{{ __('template.donation.select_payment_method') }}</option>
                            </select>
                        </div>

                        <div id="payment-details" style="display: none; margin-bottom: 1.25rem;"></div>

                        <div class="form-group" style="margin-bottom: 1.25rem;">
                            <label for="notes" style="display: block; font-weight: 500; margin-bottom: 0.5rem; color: #1e293b;">{{ __('template.donation.notes') }}</label>
                            <textarea id="notes" name="notes" placeholder="{{ __('template.donation.any_additional_info') }}" style="width: 100%; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 0.5rem; font-size: 1rem; min-height: 120px; resize: vertical;"></textarea>
                        </div>

                        <button type="submit" id="submit-btn" style="width: 100%; padding: 0.875rem; background: #2563eb; color: #fff; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; transition: background 0.2s;">{{ __('template.donation.submit_donation') }}</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>

<style>
.alert { padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem; }
.alert-success { background: #d1fae5; color: #065f46; border: 1px solid #6ee7b7; }
.alert-error { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
.alert-info { background: #dbeafe; color: #1e40af; border: 1px solid #93c5fd; }
.amount-btn { padding: 0.5rem; border: 1px solid #cbd5e1; background: #fff; border-radius: 0.5rem; cursor: pointer; transition: all 0.2s; }
.amount-btn:hover { background: #f1f5f9; border-color: #2563eb; }
.amount-btn.selected { background: #2563eb; color: #fff; border-color: #2563eb; }
button[type="submit"]:hover { background: #1d4ed8; }
button[type="submit"]:disabled { background: #94a3b8; cursor: not-allowed; }
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('donation-form');
    const alertContainer = document.getElementById('alert-container');
    const submitBtn = document.getElementById('submit-btn');
    const loadingContainer = document.getElementById('loading-container');
    const apiUrl = '{{ $api_url }}';
    const settingsUrl = '{{ $settings_url }}';
    
    // Translations
    const translations = {
        donationsDisabled: @json(__('template.donation.donations_disabled')),
        failedToLoad: @json(__('template.donation.failed_to_load')),
        submitting: @json(__('template.donation.submitting')),
        submittedSuccessfully: @json(__('template.donation.submitted_successfully', ['reference' => ''])),
        redirectingPayment: @json(__('template.donation.redirecting_payment')),
        failedToSubmit: @json(__('template.donation.failed_to_submit')),
        errorOccurred: @json(__('template.donation.error_occurred')),
        submitDonation: @json(__('template.donation.submit_donation')),
        bankDetails: @json(__('template.donation.bank_details')),
        bank: @json(__('template.donation.bank')),
        accountName: @json(__('template.donation.account_name')),
        accountNumber: @json(__('template.donation.account_number')),
        routing: @json(__('template.donation.routing')),
        branch: @json(__('template.donation.branch')),
        bkashNumber: @json(__('template.donation.bkash_number')),
    };
    
    let settings = null;
    let enabledMethods = [];

    if (!form || !alertContainer || !submitBtn || !loadingContainer) {
        console.error('Required form elements not found');
        return;
    }

    function showAlert(message, type = 'success') {
        alertContainer.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
        setTimeout(() => { alertContainer.innerHTML = ''; }, 5000);
    }

    async function loadSettings() {
        try {
            if (!settingsUrl) {
                throw new Error('Settings URL not provided');
            }
            
            const response = await fetch(settingsUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();

        if (!data.donations_enabled) {
            showAlert(translations.donationsDisabled, 'error');
            loadingContainer.innerHTML = '<p style="color: #991b1b;">' + translations.donationsDisabled + '</p>';
            return;
        }

        settings = data;
        enabledMethods = data.enabled_payment_methods || [];

        if (data.show_donor_name_bn) {
            document.getElementById('donor_name_bn-group').style.display = 'block';
        }
        if (data.require_donor_phone) {
            document.getElementById('donor_phone').required = true;
            document.querySelector('#donor_phone-group label').innerHTML += ' <span style="color: #ef4444;">*</span>';
        }
        if (data.require_donor_email) {
            document.getElementById('donor_email').required = true;
            document.querySelector('#donor_email-group label').innerHTML += ' <span style="color: #ef4444;">*</span>';
        }
        if (data.require_donor_id) {
            document.getElementById('donor_id_number-group').style.display = 'block';
            document.getElementById('donor_id_number').required = true;
            document.querySelector('#donor_id_number-group label').innerHTML += ' <span style="color: #ef4444;">*</span>';
        }

        const amountInput = document.getElementById('amount');
        amountInput.min = data.minimum_amount || 10;
        if (data.maximum_amount) {
            amountInput.max = data.maximum_amount;
        }

        if (data.default_currency) {
            document.getElementById('currency').value = data.default_currency;
        }

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

        const methodSelect = document.getElementById('method');
        enabledMethods.forEach(method => {
            if (method.is_configured) {
                const option = document.createElement('option');
                option.value = method.code;
                option.textContent = method.name + (method.name_bn ? ` (${method.name_bn})` : '');
                methodSelect.appendChild(option);
            }
        });

        methodSelect.addEventListener('change', (e) => {
            const selectedMethod = enabledMethods.find(m => m.code === e.target.value);
            const paymentDetails = document.getElementById('payment-details');
            
            if (selectedMethod) {
                let detailsHtml = '<div class="alert alert-info">';
                if (selectedMethod.code === 'bank' && selectedMethod.config) {
                    detailsHtml += `<strong>${translations.bankDetails}:</strong><br>`;
                    if (selectedMethod.config.bank_name) detailsHtml += `${translations.bank}: ${selectedMethod.config.bank_name}<br>`;
                    if (selectedMethod.config.bank_account_name) detailsHtml += `${translations.accountName}: ${selectedMethod.config.bank_account_name}<br>`;
                    if (selectedMethod.config.bank_account_number) detailsHtml += `${translations.accountNumber}: ${selectedMethod.config.bank_account_number}<br>`;
                    if (selectedMethod.config.bank_routing_number) detailsHtml += `${translations.routing}: ${selectedMethod.config.bank_routing_number}<br>`;
                    if (selectedMethod.config.bank_branch) detailsHtml += `${translations.branch}: ${selectedMethod.config.bank_branch}`;
                } else if (selectedMethod.code === 'bkash' && selectedMethod.config) {
                    detailsHtml += `<strong>${translations.bkashNumber}:</strong> ${selectedMethod.config.bkash_number || 'N/A'}`;
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
            console.error('Settings URL:', settingsUrl);
            showAlert(translations.failedToLoad, 'error');
            // Show form anyway with default settings
            loadingContainer.style.display = 'none';
            form.style.display = 'block';
            
            // Add default payment methods if available
            const methodSelect = document.getElementById('method');
            if (methodSelect && methodSelect.options.length === 1) {
                // Only has "Select payment method" option, add a default
                const defaultOption = document.createElement('option');
                defaultOption.value = 'bank';
                defaultOption.textContent = '{{ __('template.donation.payment_method') }}';
                methodSelect.appendChild(defaultOption);
            }
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.textContent = translations.submitting;

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
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
            showAlert(translations.submittedSuccessfully + data.donation.transaction_reference, 'success');
            form.reset();
            
            if (data.payment_data && formData.method === 'sslcommerz') {
                setTimeout(() => {
                    showAlert(translations.redirectingPayment, 'info');
                }, 2000);
            }
        } else {
            const errorMsg = data.message || translations.failedToSubmit;
            showAlert(errorMsg, 'error');
        }
    } catch (error) {
        showAlert(translations.errorOccurred, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = translations.submitDonation;
    }
    });

    loadSettings();
});
</script>

