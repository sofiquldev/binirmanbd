<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CampaignEvent extends Model
{
    /** @use HasFactory<\Database\Factories\CampaignEventFactory> */
    use HasFactory;

    protected $table = 'events';

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'is_virtual' => 'boolean',
        ];
    }

    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }

    public function rsvps()
    {
        return $this->hasMany(EventRsvp::class, 'event_id');
    }
}
