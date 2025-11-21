<?php

namespace Database\Seeders;

use App\Models\Candidate;
use App\Models\Poll;
use App\Models\PollOption;
use App\Models\PollVote;
use Illuminate\Database\Seeder;

class PollsSeeder extends Seeder
{
    public function run(): void
    {
        $candidates = Candidate::all();

        $pollQuestions = [
            [
                'en' => 'What is the most important issue in your constituency?',
                'bn' => 'আপনার নির্বাচনী এলাকায় সবচেয়ে গুরুত্বপূর্ণ বিষয় কী?',
                'options' => [
                    ['en' => 'Education', 'bn' => 'শিক্ষা'],
                    ['en' => 'Healthcare', 'bn' => 'স্বাস্থ্যসেবা'],
                    ['en' => 'Infrastructure', 'bn' => 'অবকাঠামো'],
                    ['en' => 'Employment', 'bn' => 'কর্মসংস্থান'],
                ],
            ],
            [
                'en' => 'How satisfied are you with current public services?',
                'bn' => 'বর্তমান সরকারি সেবা নিয়ে আপনি কতটা সন্তুষ্ট?',
                'options' => [
                    ['en' => 'Very Satisfied', 'bn' => 'খুব সন্তুষ্ট'],
                    ['en' => 'Satisfied', 'bn' => 'সন্তুষ্ট'],
                    ['en' => 'Neutral', 'bn' => 'নিরপেক্ষ'],
                    ['en' => 'Dissatisfied', 'bn' => 'অসন্তুষ্ট'],
                ],
            ],
        ];

        foreach ($candidates as $candidate) {
            foreach ($pollQuestions as $pollData) {
                $poll = Poll::create([
                    'tenant_id' => $candidate->tenant_id,
                    'candidate_id' => $candidate->id,
                    'question' => $pollData['en'],
                    'question_bn' => $pollData['bn'],
                    'status' => 'published',
                ]);

                foreach ($pollData['options'] as $index => $optionData) {
                    $option = PollOption::create([
                        'poll_id' => $poll->id,
                        'label' => $optionData['en'],
                        'option_text' => $optionData['en'],
                        'option_text_bn' => $optionData['bn'],
                    ]);

                    // Create some votes
                    $voteCount = fake()->numberBetween(10, 50);
                    for ($i = 0; $i < $voteCount; $i++) {
                        PollVote::create([
                            'poll_id' => $poll->id,
                            'poll_option_id' => $option->id,
                            'voter_hash' => md5(fake()->ipv4() . fake()->unique()->uuid()),
                        ]);
                    }
                }
            }
        }
    }
}
