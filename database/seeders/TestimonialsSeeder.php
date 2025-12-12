<?php

namespace Database\Seeders;

use App\Models\Candidate;
use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class TestimonialsSeeder extends Seeder
{
    public function run(): void
    {
        $candidates = Candidate::all();

        $testimonials = [
            [
                'en' => 'A dedicated leader who truly cares about the community. His work on education reform has been outstanding.',
                'bn' => 'একজন নিবেদিত নেতা যিনি সত্যিই সম্প্রদায়ের যত্ন নেন। শিক্ষা সংস্কারে তার কাজ অসাধারণ হয়েছে।',
                'author_en' => 'Dr. Mohammad Ali',
                'author_bn' => 'ড. মোহাম্মদ আলী',
                'designation_en' => 'Principal, Local College',
                'designation_bn' => 'অধ্যক্ষ, স্থানীয় কলেজ',
            ],
            [
                'en' => 'She has been instrumental in improving healthcare facilities in our area. We are grateful for her efforts.',
                'bn' => 'তিনি আমাদের এলাকায় স্বাস্থ্যসেবা সুবিধা উন্নত করতে গুরুত্বপূর্ণ ভূমিকা পালন করেছেন। আমরা তার প্রচেষ্টার জন্য কৃতজ্ঞ।',
                'author_en' => 'Fatima Khatun',
                'author_bn' => 'ফাতিমা খাতুন',
                'designation_en' => 'Community Health Worker',
                'designation_bn' => 'সম্প্রদায় স্বাস্থ্যকর্মী',
            ],
            [
                'en' => 'His commitment to infrastructure development is visible everywhere. Roads, bridges, and public facilities have improved significantly.',
                'bn' => 'অবকাঠামো উন্নয়নে তার প্রতিশ্রুতি সর্বত্র দৃশ্যমান। সড়ক, সেতু এবং সরকারি সুবিধা উল্লেখযোগ্যভাবে উন্নত হয়েছে।',
                'author_en' => 'Karim Uddin',
                'author_bn' => 'করিম উদ্দিন',
                'designation_en' => 'Business Owner',
                'designation_bn' => 'ব্যবসায়ী',
            ],
        ];

        foreach ($candidates as $candidate) {
            // Create 2 testimonials per candidate
            for ($i = 0; $i < 2; $i++) {
                $testimonial = fake()->randomElement($testimonials);
                
                Testimonial::create([
                    'tenant_id' => $candidate->tenant_id,
                    'candidate_id' => $candidate->id,
                    'quote' => $testimonial['en'],
                    'content_bn' => $testimonial['bn'],
                    'name' => $testimonial['author_en'],
                    'author_name_bn' => $testimonial['author_bn'],
                    'designation' => $testimonial['designation_en'],
                    'author_designation_bn' => $testimonial['designation_bn'],
                    'photo_url' => '/templates/minimal/assets/images/testimonial/' . (($i % 3) + 1) . '.png',
                    'avatar_url' => '/templates/minimal/assets/images/testimonial/thumb' . (($i % 3) + 1) . '.png',
                    'is_featured' => $i === 0,
                ]);
            }
        }
    }
}
