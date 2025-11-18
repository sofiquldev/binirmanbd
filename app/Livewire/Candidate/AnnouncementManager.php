<?php

namespace App\Livewire\Candidate;

use App\Models\Announcement;
use App\Models\BusinessHour;
use App\Models\Candidate as CandidateModel;
use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class AnnouncementManager extends Component
{
    public ?CandidateModel $candidate = null;

    public string $type = 'banner';
    public string $message = '';
    public ?string $title = null;
    public ?string $cta_label = null;
    public ?string $cta_url = null;
    public ?string $starts_at = null;
    public ?string $ends_at = null;
    public bool $is_active = true;

    public array $hours = [];
    public string $whatsapp_number = '';
    public bool $translator_enabled = true;

    protected $days = [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
    ];

    public function mount(): void
    {
        $this->candidate = Auth::user()?->candidate;
        if (! $this->candidate) {
            return;
        }

        $this->whatsapp_number = (string) $this->candidate->whatsapp_number;
        $this->translator_enabled = (bool) $this->candidate->translator_enabled;

        foreach ($this->days as $day) {
            BusinessHour::firstOrCreate([
                'candidate_id' => $this->candidate->id,
                'tenant_id' => $this->candidate->tenant_id,
                'day_of_week' => $day,
            ], [
                'opens_at' => '09:00',
                'closes_at' => '17:00',
            ]);
        }

        $this->hours = $this->candidate->businessHours()
            ->orderByRaw("FIELD(day_of_week, '" . implode("','", $this->days) . "')")
            ->get()
            ->map(fn ($hour) => [
                'id' => $hour->id,
                'day' => $hour->day_of_week,
                'opens_at' => optional($hour->opens_at)->format('H:i') ?? '',
                'closes_at' => optional($hour->closes_at)->format('H:i') ?? '',
                'is_closed' => $hour->is_closed,
            ])->toArray();
    }

    protected function rules(): array
    {
        return [
            'type' => ['required', 'in:banner,bar'],
            'message' => ['required', 'string', 'max:500'],
            'title' => ['nullable', 'string', 'max:255'],
            'cta_label' => ['nullable', 'string', 'max:120'],
            'cta_url' => ['nullable', 'url'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'is_active' => ['boolean'],
            'whatsapp_number' => ['nullable', 'string', 'max:25'],
            'translator_enabled' => ['boolean'],
        ];
    }

    public function saveAnnouncement(): void
    {
        if (! $this->candidate) {
            return;
        }

        $this->validate();

        Announcement::create([
            'tenant_id' => $this->candidate->tenant_id,
            'candidate_id' => $this->candidate->id,
            'type' => $this->type,
            'title' => $this->title,
            'message' => $this->message,
            'cta_label' => $this->cta_label,
            'cta_url' => $this->cta_url,
            'starts_at' => $this->starts_at,
            'ends_at' => $this->ends_at,
            'is_active' => $this->is_active,
        ]);

        $this->reset(['type', 'message', 'title', 'cta_label', 'cta_url', 'starts_at', 'ends_at', 'is_active']);
        $this->type = 'banner';
        $this->is_active = true;

        $this->dispatch('banner-message', message: __('Announcement created.'));
    }

    public function updateHours(): void
    {
        foreach ($this->hours as $hour) {
            BusinessHour::where('id', $hour['id'] ?? null)
                ->where('candidate_id', $this->candidate?->id)
                ->update([
                    'opens_at' => $hour['opens_at'] ?: null,
                    'closes_at' => $hour['closes_at'] ?: null,
                    'is_closed' => (bool) ($hour['is_closed'] ?? false),
                ]);
        }

        $this->dispatch('banner-message', message: __('Business hours updated.'));
    }

    public function updateSettings(): void
    {
        if (! $this->candidate) {
            return;
        }

        $this->candidate->update([
            'whatsapp_number' => $this->whatsapp_number ?: null,
            'translator_enabled' => $this->translator_enabled,
            'supported_languages' => ['bn', 'en'],
        ]);

        $this->dispatch('banner-message', message: __('Campaign settings saved.'));
    }

    public function render()
    {
        $announcements = $this->candidate
            ? $this->candidate->announcements()->latest()->get()
            : collect();

        return view('livewire.candidate.announcement-manager', [
            'announcements' => $announcements,
            'hoursForm' => $this->hours,
        ]);
    }
}
