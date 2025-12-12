<!-- Feedback Form Section -->
<section class="wpo-service-section section-padding" style="background: #f8fafc;">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-8 col-md-10 col-12">
                <div style="background: #fff; padding: 3rem 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <h2 style="font-size: 1.75rem; font-weight: 600; margin-bottom: 1rem; color: #1e293b; text-align: center;">
                        {{ $heading ?: __('template.feedback.title') }}
                    </h2>
                    <p style="color: #64748b; margin-bottom: 2rem; text-align: center;">
                        {{ $description ?: __('template.feedback.description') }}
                    </p>

                    <div id="alert-container"></div>

                    <form id="feedback-form">
                        <input type="hidden" name="candidate_id" value="{{ $candidate->id }}">

                        <div class="form-group" style="margin-bottom: 1.25rem;">
                            <label for="name" style="display: block; font-weight: 500; margin-bottom: 0.5rem; color: #1e293b;">{{ __('template.feedback.name_optional') }}</label>
                            <input type="text" id="name" name="name" placeholder="{{ __('template.donation.your_name') }}" style="width: 100%; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 0.5rem; font-size: 1rem;">
                        </div>

                        <div class="form-group" style="margin-bottom: 1.25rem;">
                            <label for="phone" style="display: block; font-weight: 500; margin-bottom: 0.5rem; color: #1e293b;">{{ __('template.feedback.phone_optional') }}</label>
                            <input type="tel" id="phone" name="phone" placeholder="{{ __('template.donation.your_phone') }}" style="width: 100%; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 0.5rem; font-size: 1rem;">
                        </div>

                        <div class="form-group" style="margin-bottom: 1.25rem;">
                            <label for="email" style="display: block; font-weight: 500; margin-bottom: 0.5rem; color: #1e293b;">{{ __('template.feedback.email_optional') }}</label>
                            <input type="email" id="email" name="email" placeholder="{{ __('template.donation.your_email') }}" style="width: 100%; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 0.5rem; font-size: 1rem;">
                        </div>

                        <div class="form-group" style="margin-bottom: 1.25rem;">
                            <label for="category" style="display: block; font-weight: 500; margin-bottom: 0.5rem; color: #1e293b;">{{ __('template.feedback.category') }} <span style="color: #ef4444;">*</span></label>
                            <select id="category" name="category" required style="width: 100%; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 0.5rem; font-size: 1rem;">
                                <option value="">{{ __('template.feedback.select_category') }}</option>
                                <option value="complaint">{{ __('template.feedback.complaint') }}</option>
                                <option value="suggestion">{{ __('template.feedback.suggestion') }}</option>
                                <option value="problem">{{ __('template.feedback.problem') }}</option>
                                <option value="appreciation">{{ __('template.feedback.appreciation') }}</option>
                                <option value="other">{{ __('template.feedback.other') }}</option>
                            </select>
                        </div>

                        <div class="form-group" style="margin-bottom: 1.25rem;">
                            <label for="description" style="display: block; font-weight: 500; margin-bottom: 0.5rem; color: #1e293b;">{{ __('template.feedback.description_label') }} <span style="color: #ef4444;">*</span></label>
                            <textarea id="description" name="description" placeholder="{{ __('template.feedback.description_placeholder') }}" required minlength="10" style="width: 100%; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 0.5rem; font-size: 1rem; min-height: 120px; resize: vertical;"></textarea>
                        </div>

                        <div class="form-group" style="margin-bottom: 1.25rem;">
                            <label for="attachment" style="display: block; font-weight: 500; margin-bottom: 0.5rem; color: #1e293b;">{{ __('template.feedback.attachment_optional') }}</label>
                            <input type="file" id="attachment" name="attachment" accept="image/*,.pdf,.doc,.docx" style="width: 100%; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 0.5rem; font-size: 1rem;">
                        </div>

                        <button type="submit" id="submit-btn" style="width: 100%; padding: 0.875rem; background: #2563eb; color: #fff; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; transition: background 0.2s;">{{ __('template.feedback.submit_feedback') }}</button>
                    </form>

                    <p style="margin-top: 1.5rem; font-size: 0.75rem; color: #64748b; text-align: center;">
                        {{ __('template.feedback.status_workflow') }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</section>

<style>
.alert { padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem; }
.alert-success { background: #d1fae5; color: #065f46; border: 1px solid #6ee7b7; }
.alert-error { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
button[type="submit"]:hover { background: #1d4ed8; }
button[type="submit"]:disabled { background: #94a3b8; cursor: not-allowed; }
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('feedback-form');
    const alertContainer = document.getElementById('alert-container');
    const submitBtn = document.getElementById('submit-btn');
    const apiUrl = '{{ $api_url }}';
    
    // Translations
    const translations = {
        submitting: @json(__('template.feedback.submitting')),
        submittedSuccessfully: @json(__('template.feedback.submitted_successfully', ['reference' => ''])),
        failedToSubmit: @json(__('template.feedback.failed_to_submit')),
        errorOccurred: @json(__('template.feedback.error_occurred')),
        submitFeedback: @json(__('template.feedback.submit_feedback')),
    };

    function showAlert(message, type = 'success') {
        alertContainer.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
        setTimeout(() => { alertContainer.innerHTML = ''; }, 5000);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.textContent = translations.submitting;

    const formData = new FormData(form);

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (response.ok) {
            showAlert(translations.submittedSuccessfully + data.reference, 'success');
            form.reset();
        } else {
            const errorMsg = data.message || data.error || translations.failedToSubmit;
            showAlert(errorMsg, 'error');
        }
    } catch (error) {
        showAlert(translations.errorOccurred, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = translations.submitFeedback;
    }
    });
});
</script>

