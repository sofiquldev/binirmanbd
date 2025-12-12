<?php

namespace Database\Seeders;

use App\Models\Candidate;
use App\Models\CandidatePageContent;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;

class CandidatePageContentSeeder extends Seeder
{
    public function run(): void
    {
        $candidates = Candidate::with('tenant')->get();

        foreach ($candidates as $candidate) {
            $funfacts = [
                ['label' => 'Total people served', 'value' => '35K'],
                ['label' => 'Projects delivered', 'value' => '120'],
                ['label' => 'Volunteers engaged', 'value' => '2.5K'],
                ['label' => 'Communities reached', 'value' => '48'],
            ];

            CandidatePageContent::updateOrCreate(
                ['candidate_id' => $candidate->id],
                [
                    'tenant_id' => $candidate->tenant_id,
                    'mission' => 'Build a safer, more prosperous community through jobs, infrastructure, and transparency.',
                    'vision' => 'A future where every family thrives with access to quality education, healthcare, and opportunity.',
                    'funfacts' => $funfacts,
                    'video_url' => 'https://www.youtube.com/embed/2lmv6ZDm0vw',
                    'privacy_policy' => 'This is sample privacy policy content for demo purposes.',
                    'about_us' => 'We are committed to service and accountability. This seed content can be edited from the dashboard.',
                    'hero_photo' => Arr::random([
                        '/templates/minimal/assets/images/slider/1.png',
                        '/templates/minimal/assets/images/slider/2.png',
                    ]),
                    'about_photo' => '/templates/minimal/assets/images/about.jpg',
                    'signature_photo' => '/templates/minimal/assets/images/signeture.png',
                    'video_thumb' => '/templates/minimal/assets/images/video-thumb.jpg',
                ]
            );
        }
    }
}

