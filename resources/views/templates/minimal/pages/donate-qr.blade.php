<!-- Donation QR Code Section -->
<section class="wpo-service-section section-padding" style="background: #f8fafc; min-height: 60vh; display: flex; align-items: center;">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-6 col-md-8 col-12">
                <div class="text-center" style="background: #fff; padding: 3rem 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <h2 style="font-size: 1.75rem; font-weight: 600; margin-bottom: 1rem; color: #1e293b;">
                        {{ $heading ?: __('template.donation_qr.heading') }}
                    </h2>
                    <p style="color: #64748b; margin-bottom: 2rem;">
                        {{ $description ?: __('template.donation_qr.description') }}
                    </p>
                    <div style="display: inline-block; padding: 1.5rem; border: 2px dashed #cbd5e1; border-radius: 1rem; background: #f8fafc; margin-bottom: 1.5rem;">
                        <img src="{{ $qr_url }}" alt="Donation QR code" width="260" height="260" style="display: block;">
                    </div>
                    <p style="font-size: 0.875rem; color: #64748b; word-break: break-all; margin: 0;">
                        {{ $donation_url }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</section>

