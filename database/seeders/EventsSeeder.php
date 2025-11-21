<?php

namespace Database\Seeders;

use App\Models\Candidate;
use App\Models\CampaignEvent;
use App\Models\EventRsvp;
use Illuminate\Database\Seeder;

class EventsSeeder extends Seeder
{
    public function run(): void
    {
        $candidates = Candidate::all();
        $eventTypes = [
            ['en' => 'Campaign Rally', 'bn' => 'প্রচার সমাবেশ'],
            ['en' => 'Public Debate', 'bn' => 'পাবলিক বিতর্ক'],
            ['en' => 'Town Hall Meeting', 'bn' => 'টাউন হল মিটিং'],
            ['en' => 'Voter Registration Drive', 'bn' => 'ভোটার নিবন্ধন অভিযান'],
            ['en' => 'Community Service', 'bn' => 'সম্প্রদায় সেবা'],
        ];

        foreach ($candidates as $candidate) {
            // Create 2 events per candidate
            for ($i = 0; $i < 2; $i++) {
                $type = fake()->randomElement($eventTypes);
                $eventDate = fake()->dateTimeBetween('now', '+30 days');

                $eventTime = fake()->time('H:i');
                $startsAt = \Carbon\Carbon::parse($eventDate)->setTimeFromTimeString($eventTime);
                
                $event = CampaignEvent::create([
                    'tenant_id' => $candidate->tenant_id,
                    'candidate_id' => $candidate->id,
                    'title' => $type['en'] . ' - ' . $candidate->constituency,
                    'title_bn' => $type['bn'] . ' - ' . $candidate->constituency_bn,
                    'description' => 'Join us for an important campaign event in ' . $candidate->constituency . '.',
                    'description_bn' => $candidate->constituency_bn . ' এ একটি গুরুত্বপূর্ণ প্রচার অনুষ্ঠানে যোগ দিন।',
                    'starts_at' => $startsAt,
                    'ends_at' => $startsAt->copy()->addHours(2),
                    'location' => fake()->address(),
                    'location_bn' => fake()->address(),
                    'latitude' => fake()->latitude(23.5, 24.5),
                    'longitude' => fake()->longitude(88.0, 92.0),
                    'rsvp_limit' => fake()->numberBetween(50, 500),
                ]);

                // Create some RSVPs
                $rsvpCount = fake()->numberBetween(5, 20);
                for ($j = 0; $j < $rsvpCount; $j++) {
                    EventRsvp::create([
                        'event_id' => $event->id,
                        'name' => fake()->name(),
                        'email' => fake()->email(),
                        'phone' => '+880' . fake()->numerify('#########'),
                        'status' => fake()->randomElement(['pending', 'approved', 'waitlisted']),
                    ]);
                }
            }
        }
    }
}
