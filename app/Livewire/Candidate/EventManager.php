<?php

namespace App\Livewire\Candidate;

use App\Models\CampaignEvent;
use App\Models\EventRsvp;
use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class EventManager extends Component
{
    public string $title = '';
    public ?string $description = null;
    public string $starts_at = '';
    public ?string $ends_at = null;
    public ?string $location = null;
    public ?string $map_url = null;
    public ?string $latitude = null;
    public ?string $longitude = null;
    public ?int $rsvp_limit = null;
    public bool $is_virtual = false;

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'starts_at' => ['required', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'location' => ['nullable', 'string', 'max:255'],
            'map_url' => ['nullable', 'url'],
            'latitude' => ['nullable', 'numeric'],
            'longitude' => ['nullable', 'numeric'],
            'rsvp_limit' => ['nullable', 'integer', 'min:1'],
            'is_virtual' => ['boolean'],
        ];
    }

    public function save(): void
    {
        $candidate = Auth::user()?->candidate;
        if (! $candidate) {
            return;
        }

        $data = $this->validate();

        CampaignEvent::create(array_merge($data, [
            'tenant_id' => $candidate->tenant_id,
            'candidate_id' => $candidate->id,
        ]));

        $this->reset();
        $this->dispatch('banner-message', message: __('Event added.'));
    }

    public function render()
    {
        $candidate = Auth::user()?->candidate;

        $events = $candidate
            ? $candidate->events()->with('rsvps')->latest('starts_at')->get()
            : collect();

        $latestRsvps = $candidate
            ? EventRsvp::whereIn('event_id', $candidate->events()->pluck('id'))->latest()->limit(10)->get()
            : collect();

        return view('livewire.candidate.event-manager', [
            'events' => $events,
            'latestRsvps' => $latestRsvps,
        ]);
    }
}
