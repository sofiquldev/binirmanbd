<?php

namespace App\Livewire\Tenant;

use App\Models\CampaignEvent;
use App\Models\EventRsvp;
use Livewire\Component;

class EventRsvpForm extends Component
{
    public ?int $eventId = null;
    public string $name = '';
    public string $email = '';
    public string $phone = '';
    public int $guests = 1;
    public string $notes = '';
    public bool $success = false;

    protected $rules = [
        'eventId' => 'required|exists:campaign_events,id',
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'phone' => 'required|string|max:20',
        'guests' => 'required|integer|min:1|max:10',
        'notes' => 'nullable|string|max:500',
    ];

    public function mount(?int $eventId = null): void
    {
        $this->eventId = $eventId;
    }

    public function submit(): void
    {
        $this->validate();

        $event = CampaignEvent::findOrFail($this->eventId);
        
        // Check if already RSVP'd
        $existing = EventRsvp::where('event_id', $this->eventId)
            ->where('email', $this->email)
            ->first();

        if ($existing) {
            session()->flash('error', __('You have already RSVP\'d for this event.', [], 'en'));
            return;
        }

        EventRsvp::create([
            'event_id' => $this->eventId,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'guests' => $this->guests,
            'notes' => $this->notes,
            'status' => 'confirmed',
        ]);

        $this->success = true;
        $this->reset(['name', 'email', 'phone', 'guests', 'notes']);
        
        session()->flash('message', __('RSVP confirmed! We look forward to seeing you at the event.', [], 'en'));
    }

    public function render()
    {
        $event = $this->eventId ? CampaignEvent::find($this->eventId) : null;
        
        return view('livewire.tenant.event-rsvp-form', [
            'event' => $event,
        ]);
    }
}
