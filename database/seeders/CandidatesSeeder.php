<?php

namespace Database\Seeders;

use App\Models\Candidate;
use App\Models\BusinessHour;
use App\Models\Template;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Stancl\Tenancy\Database\Models\Tenant;
use Stancl\Tenancy\Database\Models\Domain;

class CandidatesSeeder extends Seeder
{
    public function run(): void
    {
        $templates = Template::all();
        $candidateAdminRole = Role::where('name', User::ROLE_CANDIDATE_ADMIN)->first();

        $candidates = [
            [
                'name' => 'Ahmed Rahman',
                'name_bn' => 'আহমেদ রহমান',
                'slug' => 'ahmed-rahman',
                'constituency' => 'Dhaka-1',
                'constituency_bn' => 'ঢাকা-১',
                'party' => 'Awami League',
                'party_bn' => 'আওয়ামী লীগ',
                'campaign_slogan' => 'Progress for All',
                'campaign_slogan_bn' => 'সবার জন্য অগ্রগতি',
                'campaign_goals' => 'Improving infrastructure, education, and healthcare in Dhaka-1.',
                'campaign_goals_bn' => 'ঢাকা-১ এ অবকাঠামো, শিক্ষা ও স্বাস্থ্যসেবা উন্নত করা।',
                'subdomain' => 'ahmed-rahman',
                'whatsapp_number' => '+8801712345678',
                'translator_enabled' => true,
            ],
            [
                'name' => 'Fatima Begum',
                'name_bn' => 'ফাতিমা বেগম',
                'slug' => 'fatima-begum',
                'constituency' => 'Chittagong-2',
                'constituency_bn' => 'চট্টগ্রাম-২',
                'party' => 'BNP',
                'party_bn' => 'বিএনপি',
                'campaign_slogan' => 'Empowerment Through Unity',
                'campaign_slogan_bn' => 'ঐক্যের মাধ্যমে ক্ষমতায়ন',
                'campaign_goals' => 'Women empowerment, youth development, and economic growth.',
                'campaign_goals_bn' => 'নারী ক্ষমতায়ন, যুব উন্নয়ন ও অর্থনৈতিক প্রবৃদ্ধি।',
                'subdomain' => 'fatima-begum',
                'whatsapp_number' => '+8801712345679',
                'translator_enabled' => true,
            ],
            [
                'name' => 'Karim Hossain',
                'name_bn' => 'করিম হোসেন',
                'slug' => 'karim-hossain',
                'constituency' => 'Sylhet-1',
                'constituency_bn' => 'সিলেট-১',
                'party' => 'Jatiya Party',
                'party_bn' => 'জাতীয় পার্টি',
                'campaign_slogan' => 'Development First',
                'campaign_slogan_bn' => 'উন্নয়ন প্রথম',
                'campaign_goals' => 'Focusing on regional development and job creation.',
                'campaign_goals_bn' => 'আঞ্চলিক উন্নয়ন ও কর্মসংস্থান সৃষ্টিতে মনোনিবেশ।',
                'subdomain' => 'karim-hossain',
                'whatsapp_number' => '+8801712345680',
                'translator_enabled' => false,
            ],
            [
                'name' => 'Rashida Akter',
                'name_bn' => 'রাশিদা আক্তার',
                'slug' => 'rashida-akter',
                'constituency' => 'Rajshahi-3',
                'constituency_bn' => 'রাজশাহী-৩',
                'party' => 'Awami League',
                'party_bn' => 'আওয়ামী লীগ',
                'campaign_slogan' => 'Education for All',
                'campaign_slogan_bn' => 'সবার জন্য শিক্ষা',
                'campaign_goals' => 'Promoting quality education and skill development.',
                'campaign_goals_bn' => 'মানসম্মত শিক্ষা ও দক্ষতা উন্নয়ন প্রচার।',
                'subdomain' => 'rashida-akter',
                'whatsapp_number' => '+8801712345681',
                'translator_enabled' => true,
            ],
            [
                'name' => 'Mohammad Ali',
                'name_bn' => 'মোহাম্মদ আলী',
                'slug' => 'mohammad-ali',
                'constituency' => 'Khulna-2',
                'constituency_bn' => 'খুলনা-২',
                'party' => 'BNP',
                'party_bn' => 'বিএনপি',
                'campaign_slogan' => 'Sustainable Growth',
                'campaign_slogan_bn' => 'টেকসই প্রবৃদ্ধি',
                'campaign_goals' => 'Environmental protection and sustainable development.',
                'campaign_goals_bn' => 'পরিবেশ সুরক্ষা ও টেকসই উন্নয়ন।',
                'subdomain' => 'mohammad-ali',
                'whatsapp_number' => '+8801712345682',
                'translator_enabled' => true,
            ],
        ];

        foreach ($candidates as $index => $data) {
            // Create or get tenant
            $tenantId = 'tenant-' . ($index + 1);
            $tenant = Tenant::firstOrCreate(
                ['id' => $tenantId],
                ['id' => $tenantId]
            );

            // Create or get domain
            $domainName = $data['subdomain'] . '.binirmanbd.test';
            Domain::firstOrCreate(
                ['domain' => $domainName],
                [
                    'domain' => $domainName,
                    'tenant_id' => $tenant->id,
                ]
            );

            // Create or update candidate
            $candidate = Candidate::updateOrCreate(
                ['slug' => $data['slug']],
                [
                    'tenant_id' => $tenant->id,
                    'name' => $data['name'],
                    'name_bn' => $data['name_bn'],
                    'constituency' => $data['constituency'],
                    'constituency_bn' => $data['constituency_bn'],
                    'party' => $data['party'],
                    'party_bn' => $data['party_bn'],
                    'template_id' => $templates->random()->id,
                    'campaign_slogan' => $data['campaign_slogan'],
                    'campaign_slogan_bn' => $data['campaign_slogan_bn'],
                    'campaign_goals' => $data['campaign_goals'],
                    'campaign_goals_bn' => $data['campaign_goals_bn'],
                    'primary_domain' => $domainName,
                    'whatsapp_number' => $data['whatsapp_number'],
                    'translator_enabled' => $data['translator_enabled'],
                ]
            );

            // Create business hours (delete existing first to avoid duplicates)
            BusinessHour::where('candidate_id', $candidate->id)->delete();
            $days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            foreach ($days as $day) {
                BusinessHour::create([
                    'tenant_id' => $tenant->id,
                    'candidate_id' => $candidate->id,
                    'day_of_week' => $day,
                    'is_closed' => $day === 'sunday',
                    'opens_at' => $day !== 'sunday' ? '09:00' : null,
                    'closes_at' => $day !== 'sunday' ? '17:00' : null,
                ]);
            }

            // Create or update candidate admin user
            $userEmail = strtolower($data['slug']) . '@binirmanbd.com';
            $user = User::firstOrCreate(
                ['email' => $userEmail],
                [
                    'name' => $data['name'] . ' Admin',
                    'password' => Hash::make('password'),
                    'candidate_id' => $candidate->id,
                ]
            );

            if ($candidateAdminRole && !$user->hasRole($candidateAdminRole->name)) {
                $user->assignRole($candidateAdminRole);
            }
        }
    }
}
