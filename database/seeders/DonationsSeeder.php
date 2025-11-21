<?php

namespace Database\Seeders;

use App\Models\Candidate;
use App\Models\Donation;
use App\Models\DonationLedger;
use Illuminate\Database\Seeder;

class DonationsSeeder extends Seeder
{
    public function run(): void
    {
        $candidates = Candidate::all();
        $sources = ['online', 'offline'];
        $methods = ['sslcommerz', 'bkash', 'nagad', 'stripe', 'cash', 'bank', 'cheque'];
        $statuses = ['pending', 'verified', 'rejected'];

        $donorNames = [
            ['en' => 'Abdul Karim', 'bn' => 'আব্দুল করিম'],
            ['en' => 'Rashida Begum', 'bn' => 'রাশিদা বেগম'],
            ['en' => 'Mohammad Hasan', 'bn' => 'মোহাম্মদ হাসান'],
            ['en' => 'Fatima Khatun', 'bn' => 'ফাতিমা খাতুন'],
            ['en' => 'Kamal Uddin', 'bn' => 'কামাল উদ্দিন'],
            ['en' => 'Ayesha Rahman', 'bn' => 'আয়েশা রহমান'],
            ['en' => 'Shahid Ali', 'bn' => 'শাহিদ আলী'],
            ['en' => 'Nusrat Jahan', 'bn' => 'নুসরাত জাহান'],
        ];

        foreach ($candidates as $candidate) {
            // Create 10 donations per candidate
            for ($i = 0; $i < 10; $i++) {
                $source = fake()->randomElement($sources);
                $method = $source === 'online' 
                    ? fake()->randomElement(['sslcommerz', 'bkash', 'nagad', 'stripe'])
                    : fake()->randomElement(['cash', 'bank', 'cheque']);
                
                $donor = fake()->randomElement($donorNames);
                $amount = fake()->numberBetween(500, 50000);
                $status = fake()->randomElement($statuses);

                $donation = Donation::create([
                    'tenant_id' => $candidate->tenant_id,
                    'candidate_id' => $candidate->id,
                    'donor_name' => $donor['en'],
                    'donor_name_bn' => $donor['bn'],
                    'donor_email' => fake()->email(),
                    'donor_phone' => '+880' . fake()->numerify('#########'),
                    'donor_id_number' => fake()->numerify('##########'),
                    'amount' => $amount,
                    'source' => $source,
                    'method' => $method,
                    'status' => $status,
                    'transaction_reference' => $source === 'online' ? 'TXN' . fake()->unique()->numerify('########') : null,
                    'proof_path' => $source === 'offline' && $status === 'verified' ? 'proofs/' . fake()->uuid() . '.pdf' : null,
                    'created_at' => fake()->dateTimeBetween('-30 days', 'now'),
                ]);

                // Create ledger entry
                if ($status === 'verified') {
                    DonationLedger::create([
                        'tenant_id' => $candidate->tenant_id,
                        'donation_id' => $donation->id,
                        'candidate_id' => $candidate->id,
                        'amount' => $amount,
                        'entry_type' => 'credit',
                        'description' => "Donation from {$donor['en']} via {$method}",
                        'created_at' => $donation->created_at,
                    ]);
                }
            }
        }
    }
}
