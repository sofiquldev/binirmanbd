<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Stancl\Tenancy\Database\Models\Tenant;

class Candidate extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'name',
        'name_bn',
        'slug',
        'image',
        'constituency_id',
        'party_id',
        'template_id',
        'campaign_slogan',
        'campaign_slogan_bn',
        'campaign_goals',
        'campaign_goals_bn',
        'about',
        'about_bn',
        'history',
        'history_bn',
        'primary_domain',
        'custom_domain',
        'whatsapp_number',
        'translator_enabled',
        'supported_languages',
        'default_locale',
    ];

    protected function casts(): array
    {
        return [
            'translator_enabled' => 'boolean',
            'supported_languages' => 'array',
        ];
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function template()
    {
        return $this->belongsTo(Template::class);
    }

    public function knowledgeEntries()
    {
        return $this->hasMany(KnowledgeEntry::class);
    }

    public function announcements()
    {
        return $this->hasMany(Announcement::class);
    }

    public function businessHours()
    {
        return $this->hasMany(BusinessHour::class);
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    public function contactMessages()
    {
        return $this->hasMany(ContactMessage::class);
    }

    public function events()
    {
        return $this->hasMany(CampaignEvent::class);
    }

    public function mapLocations()
    {
        return $this->hasMany(MapLocation::class);
    }

    public function mediaHighlights()
    {
        return $this->hasMany(MediaHighlight::class);
    }

    public function engagementCounters()
    {
        return $this->hasMany(EngagementCounter::class);
    }

    public function salesNotifications()
    {
        return $this->hasMany(SalesNotification::class);
    }

    public function polls()
    {
        return $this->hasMany(Poll::class);
    }

    public function popups()
    {
        return $this->hasMany(Popup::class);
    }

    public function pricingTiers()
    {
        return $this->hasMany(PricingTier::class);
    }

    public function testimonials()
    {
        return $this->hasMany(Testimonial::class);
    }

    public function pageContent()
    {
        return $this->hasOne(CandidatePageContent::class);
    }

    public function donations()
    {
        return $this->hasMany(Donation::class);
    }

    public function party()
    {
        return $this->belongsTo(Party::class);
    }

    public function constituency()
    {
        return $this->belongsTo(Constituency::class);
    }

    public function manifestos()
    {
        return $this->hasMany(ElectionManifesto::class);
    }

    public function donationSetting()
    {
        return $this->hasOne(CandidateDonationSetting::class);
    }

    public function paymentMethods()
    {
        return $this->belongsToMany(PaymentMethod::class, 'candidate_payment_methods')
            ->withPivot('config', 'is_enabled', 'sort_order')
            ->withTimestamps();
    }

    /**
     * Many-to-many relationship with users
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'candidate_user')
            ->withTimestamps();
    }
}


