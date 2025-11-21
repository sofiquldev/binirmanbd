<?php

namespace Database\Seeders;

use App\Models\Candidate;
use App\Models\Contact;
use Illuminate\Database\Seeder;

class ContactsSeeder extends Seeder
{
    public function run(): void
    {
        $candidates = Candidate::all();

        $contactCategories = [
            ['en' => 'Election Commission', 'bn' => 'নির্বাচন কমিশন'],
            ['en' => 'Police Station', 'bn' => 'পুলিশ স্টেশন'],
            ['en' => 'Hospital', 'bn' => 'হাসপাতাল'],
            ['en' => 'Fire Service', 'bn' => 'ফায়ার সার্ভিস'],
            ['en' => 'NGO', 'bn' => 'এনজিও'],
            ['en' => 'Local Government', 'bn' => 'স্থানীয় সরকার'],
        ];

        $baseContacts = [
            [
                'name' => 'Election Commission Office',
                'name_bn' => 'নির্বাচন কমিশন অফিস',
                'category' => 'Election Commission',
                'category_bn' => 'নির্বাচন কমিশন',
                'phone' => '+880-2-9112000',
                'email' => 'info@ecs.gov.bd',
                'address' => 'Agargaon, Dhaka',
                'address_bn' => 'আগারগাঁও, ঢাকা',
            ],
            [
                'name' => 'Dhaka Medical College Hospital',
                'name_bn' => 'ঢাকা মেডিকেল কলেজ হাসপাতাল',
                'category' => 'Hospital',
                'category_bn' => 'হাসপাতাল',
                'phone' => '+880-2-55165000',
                'email' => 'info@dmch.gov.bd',
                'address' => 'Dhaka Medical College, Dhaka',
                'address_bn' => 'ঢাকা মেডিকেল কলেজ, ঢাকা',
            ],
            [
                'name' => 'Central Police Station',
                'name_bn' => 'সেন্ট্রাল পুলিশ স্টেশন',
                'category' => 'Police Station',
                'category_bn' => 'পুলিশ স্টেশন',
                'phone' => '+880-2-9330000',
                'email' => null,
                'address' => 'Dhanmondi, Dhaka',
                'address_bn' => 'ধানমন্ডি, ঢাকা',
            ],
        ];

        foreach ($candidates as $candidate) {
            // Add base contacts
            foreach ($baseContacts as $contactData) {
                Contact::create([
                    'tenant_id' => $candidate->tenant_id,
                    'candidate_id' => $candidate->id,
                    'name' => $contactData['name'],
                    'name_bn' => $contactData['name_bn'],
                    'category' => $contactData['category'],
                    'category_bn' => $contactData['category_bn'],
                    'phone' => $contactData['phone'],
                    'email' => $contactData['email'],
                    'address' => $contactData['address'],
                    'address_bn' => $contactData['address_bn'],
                    'is_verified' => true,
                ]);
            }

            // Add random contacts
            for ($i = 0; $i < 3; $i++) {
                $category = fake()->randomElement($contactCategories);
                Contact::create([
                    'tenant_id' => $candidate->tenant_id,
                    'candidate_id' => $candidate->id,
                    'name' => fake()->company() . ' ' . $category['en'],
                    'name_bn' => fake()->company() . ' ' . $category['bn'],
                    'category' => $category['en'],
                    'category_bn' => $category['bn'],
                    'phone' => '+880' . fake()->numerify('#########'),
                    'email' => fake()->email(),
                    'address' => fake()->address(),
                    'address_bn' => fake()->address(),
                    'is_verified' => fake()->boolean(80),
                ]);
            }
        }
    }
}
