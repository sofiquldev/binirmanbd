<?php

namespace Database\Seeders;

use App\Models\Candidate;
use App\Models\Feedback;
use Illuminate\Database\Seeder;

class ObjectionsSeeder extends Seeder
{
    public function run(): void
    {
        $candidates = Candidate::all();
        $statuses = ['new', 'in_review', 'assigned', 'resolved'];
        $categories = [
            ['en' => 'Infrastructure', 'bn' => 'অবকাঠামো'],
            ['en' => 'Education', 'bn' => 'শিক্ষা'],
            ['en' => 'Healthcare', 'bn' => 'স্বাস্থ্যসেবা'],
            ['en' => 'Water Supply', 'bn' => 'পানি সরবরাহ'],
            ['en' => 'Road Maintenance', 'bn' => 'সড়ক রক্ষণাবেক্ষণ'],
            ['en' => 'Electricity', 'bn' => 'বিদ্যুৎ'],
            ['en' => 'Corruption', 'bn' => 'দুর্নীতি'],
            ['en' => 'Other', 'bn' => 'অন্যান্য'],
        ];

        $problems = [
            ['en' => 'Road in front of my house is damaged and needs repair.', 'bn' => 'আমার বাড়ির সামনের রাস্তা ক্ষতিগ্রস্ত এবং মেরামত প্রয়োজন।'],
            ['en' => 'No clean drinking water available in our area.', 'bn' => 'আমাদের এলাকায় পরিষ্কার পানীয় জল নেই।'],
            ['en' => 'School building needs renovation urgently.', 'bn' => 'স্কুল ভবন জরুরিভাবে সংস্কার প্রয়োজন।'],
            ['en' => 'Hospital lacks basic medical equipment.', 'bn' => 'হাসপাতালে মৌলিক চিকিৎসা সরঞ্জামের অভাব।'],
            ['en' => 'Frequent power outages affecting daily life.', 'bn' => 'ঘন ঘন বিদ্যুৎ বিভ্রাট দৈনন্দিন জীবনকে প্রভাবিত করছে।'],
        ];

        foreach ($candidates as $candidate) {
            // Create 6 objections per candidate
            for ($i = 0; $i < 6; $i++) {
                $category = fake()->randomElement($categories);
                $problem = fake()->randomElement($problems);
                $status = fake()->randomElement($statuses);
                $createdAt = fake()->dateTimeBetween('-20 days', 'now');

                $feedback = Feedback::create([
                    'tenant_id' => $candidate->tenant_id,
                    'candidate_id' => $candidate->id,
                    'name' => fake()->name(),
                    'name_bn' => fake()->name(),
                    'email' => fake()->email(),
                    'phone' => '+880' . fake()->numerify('#########'),
                    'category' => $category['en'],
                    'category_bn' => $category['bn'],
                    'description' => $problem['en'],
                    'description_bn' => $problem['bn'],
                    'status' => $status,
                    'created_at' => $createdAt,
                    'resolved_at' => $status === 'resolved' ? fake()->dateTimeBetween($createdAt, 'now') : null,
                ]);
            }
        }
    }
}
