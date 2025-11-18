<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventRsvp extends Model
{
    /** @use HasFactory<\Database\Factories\EventRsvpFactory> */
    use HasFactory;

    protected $guarded = [];

    public function event()
    {
        return $this->belongsTo(CampaignEvent::class, 'event_id');
    }
}
