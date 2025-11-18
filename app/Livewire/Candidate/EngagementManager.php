<?php

namespace App\Livewire\Candidate;

use App\Models\EngagementCounter;
use App\Models\MediaHighlight;
use App\Models\Popup;
use App\Models\PricingTier;
use App\Models\SalesNotification;
use App\Models\Testimonial;
use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class EngagementManager extends Component
{
    public string $counter_label = '';
    public int $counter_value = 0;
    public ?string $counter_color = null;

    public string $testimonial_name = '';
    public ?string $testimonial_designation = null;
    public string $testimonial_quote = '';

    public string $pricing_name = '';
    public ?string $pricing_description = null;
    public ?float $pricing_amount = null;
    public string $pricing_features = '';

    public string $popup_title = '';
    public string $popup_content = '';

    public string $media_type = 'instagram';
    public string $media_url = '';

    public string $notification_message = '';

    protected function candidate()
    {
        return Auth::user()?->candidate;
    }

    public function saveCounter(): void
    {
        $candidate = $this->candidate();
        if (! $candidate) {
            return;
        }

        $this->validate([
            'counter_label' => ['required', 'string', 'max:255'],
            'counter_value' => ['required', 'integer', 'min:0'],
            'counter_color' => ['nullable', 'string', 'max:20'],
        ]);

        EngagementCounter::create([
            'tenant_id' => $candidate->tenant_id,
            'candidate_id' => $candidate->id,
            'label' => $this->counter_label,
            'value' => $this->counter_value,
            'color' => $this->counter_color,
        ]);

        $this->reset(['counter_label', 'counter_value', 'counter_color']);
        $this->dispatch('banner-message', message: __('Counter saved.'));
    }

    public function saveTestimonial(): void
    {
        $candidate = $this->candidate();
        if (! $candidate) {
            return;
        }

        $this->validate([
            'testimonial_name' => ['required', 'string', 'max:255'],
            'testimonial_quote' => ['required', 'string'],
        ]);

        Testimonial::create([
            'tenant_id' => $candidate->tenant_id,
            'candidate_id' => $candidate->id,
            'name' => $this->testimonial_name,
            'designation' => $this->testimonial_designation,
            'quote' => $this->testimonial_quote,
        ]);

        $this->reset(['testimonial_name', 'testimonial_designation', 'testimonial_quote']);
        $this->dispatch('banner-message', message: __('Testimonial saved.'));
    }

    public function savePricing(): void
    {
        $candidate = $this->candidate();
        if (! $candidate) {
            return;
        }

        $this->validate([
            'pricing_name' => ['required', 'string', 'max:255'],
            'pricing_amount' => ['nullable', 'numeric', 'min:0'],
        ]);

        PricingTier::create([
            'tenant_id' => $candidate->tenant_id,
            'candidate_id' => $candidate->id,
            'name' => $this->pricing_name,
            'description' => $this->pricing_description,
            'amount' => $this->pricing_amount,
            'features' => $this->pricing_features ? array_map('trim', explode(',', $this->pricing_features)) : null,
        ]);

        $this->reset(['pricing_name', 'pricing_description', 'pricing_amount', 'pricing_features']);
        $this->dispatch('banner-message', message: __('Pricing tier saved.'));
    }

    public function savePopup(): void
    {
        $candidate = $this->candidate();
        if (! $candidate) {
            return;
        }

        $this->validate([
            'popup_title' => ['required', 'string', 'max:255'],
            'popup_content' => ['required', 'string'],
        ]);

        Popup::create([
            'tenant_id' => $candidate->tenant_id,
            'candidate_id' => $candidate->id,
            'title' => $this->popup_title,
            'content' => $this->popup_content,
        ]);

        $this->reset(['popup_title', 'popup_content']);
        $this->dispatch('banner-message', message: __('Popup saved.'));
    }

    public function saveMedia(): void
    {
        $candidate = $this->candidate();
        if (! $candidate) {
            return;
        }

        $this->validate([
            'media_type' => ['required', 'in:instagram,youtube'],
            'media_url' => ['required', 'url'],
        ]);

        MediaHighlight::create([
            'tenant_id' => $candidate->tenant_id,
            'candidate_id' => $candidate->id,
            'type' => $this->media_type,
            'embed_url' => $this->media_url,
        ]);

        $this->reset(['media_type', 'media_url']);
        $this->media_type = 'instagram';
        $this->dispatch('banner-message', message: __('Media highlight saved.'));
    }

    public function saveNotification(): void
    {
        $candidate = $this->candidate();
        if (! $candidate) {
            return;
        }

        $this->validate([
            'notification_message' => ['required', 'string', 'max:255'],
        ]);

        SalesNotification::create([
            'tenant_id' => $candidate->tenant_id,
            'candidate_id' => $candidate->id,
            'message' => $this->notification_message,
        ]);

        $this->reset(['notification_message']);
        $this->dispatch('banner-message', message: __('Notification queued.'));
    }

    public function render()
    {
        $candidate = $this->candidate();

        return view('livewire.candidate.engagement-manager', [
            'counters' => $candidate?->engagementCounters()->get() ?? collect(),
            'testimonials' => $candidate?->testimonials()->get() ?? collect(),
            'pricing' => $candidate?->pricingTiers()->get() ?? collect(),
            'popups' => $candidate?->popups()->get() ?? collect(),
            'media' => $candidate?->mediaHighlights()->get() ?? collect(),
            'notifications' => $candidate?->salesNotifications()->latest()->limit(10)->get() ?? collect(),
        ]);
    }
}
