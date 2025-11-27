<?php

namespace Database\Seeders;

use App\Models\Candidate;
use App\Models\BusinessHour;
use App\Models\Template;
use App\Models\User;
use App\Models\Party;
use App\Models\Constituency;
use App\Models\District;
use HasinHayder\Tyro\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Stancl\Tenancy\Database\Models\Tenant;
use Stancl\Tenancy\Database\Models\Domain;

class CandidatesSeeder extends Seeder
{
    public function run(): void
    {
        $templates = Template::all();
        $candidateAdminRole = Role::where('slug', User::ROLE_CANDIDATE_ADMIN)->first();

        // Create Parties
        $parties = [
            [
                'name' => 'Awami League',
                'name_bn' => 'আওয়ামী লীগ',
                'slug' => 'awami-league',
                'about' => 'The Awami League is one of the major political parties in Bangladesh.',
                'about_bn' => 'আওয়ামী লীগ বাংলাদেশের অন্যতম প্রধান রাজনৈতিক দল।',
                'history' => 'Founded in 1949, the Awami League has played a significant role in Bangladesh\'s independence movement.',
                'history_bn' => '১৯৪৯ সালে প্রতিষ্ঠিত, আওয়ামী লীগ বাংলাদেশের স্বাধীনতা আন্দোলনে গুরুত্বপূর্ণ ভূমিকা পালন করেছে।',
                'is_active' => true,
            ],
            [
                'name' => 'BNP',
                'name_bn' => 'বিএনপি',
                'slug' => 'bnp',
                'about' => 'Bangladesh Nationalist Party is a major political party in Bangladesh.',
                'about_bn' => 'বাংলাদেশ জাতীয়তাবাদী দল বাংলাদেশের একটি প্রধান রাজনৈতিক দল।',
                'history' => 'Founded in 1978, BNP has been a key player in Bangladesh politics.',
                'history_bn' => '১৯৭৮ সালে প্রতিষ্ঠিত, বিএনপি বাংলাদেশের রাজনীতিতে একটি গুরুত্বপূর্ণ ভূমিকা পালন করেছে।',
                'is_active' => true,
            ],
            [
                'name' => 'Jatiya Party',
                'name_bn' => 'জাতীয় পার্টি',
                'slug' => 'jatiya-party',
                'about' => 'Jatiya Party is a political party in Bangladesh.',
                'about_bn' => 'জাতীয় পার্টি বাংলাদেশের একটি রাজনৈতিক দল।',
                'history' => 'Founded in 1986, Jatiya Party has participated in various governments.',
                'history_bn' => '১৯৮৬ সালে প্রতিষ্ঠিত, জাতীয় পার্টি বিভিন্ন সরকারে অংশগ্রহণ করেছে।',
                'is_active' => true,
            ],
        ];

        $partyMap = [];
        foreach ($parties as $partyData) {
            $party = Party::firstOrCreate(
                ['slug' => $partyData['slug']],
                $partyData
            );
            $partyMap[$partyData['slug']] = $party->id;
        }

        // Create Constituencies
        $constituencies = [
            [
                'name' => 'Dhaka-1',
                'name_bn' => 'ঢাকা-১',
                'slug' => 'dhaka-1',
                'district' => 'Dhaka',
                'district_bn' => 'ঢাকা',
                'about' => 'Dhaka-1 is a parliamentary constituency in Dhaka district.',
                'about_bn' => 'ঢাকা-১ ঢাকা জেলার একটি সংসদীয় আসন।',
                'is_active' => true,
            ],
            [
                'name' => 'Chittagong-2',
                'name_bn' => 'চট্টগ্রাম-২',
                'slug' => 'chittagong-2',
                'district' => 'Chittagong',
                'district_bn' => 'চট্টগ্রাম',
                'about' => 'Chittagong-2 is a parliamentary constituency in Chittagong district.',
                'about_bn' => 'চট্টগ্রাম-২ চট্টগ্রাম জেলার একটি সংসদীয় আসন।',
                'is_active' => true,
            ],
            [
                'name' => 'Sylhet-1',
                'name_bn' => 'সিলেট-১',
                'slug' => 'sylhet-1',
                'district' => 'Sylhet',
                'district_bn' => 'সিলেট',
                'about' => 'Sylhet-1 is a parliamentary constituency in Sylhet district.',
                'about_bn' => 'সিলেট-১ সিলেট জেলার একটি সংসদীয় আসন।',
                'is_active' => true,
            ],
            [
                'name' => 'Rajshahi-3',
                'name_bn' => 'রাজশাহী-৩',
                'slug' => 'rajshahi-3',
                'district' => 'Rajshahi',
                'district_bn' => 'রাজশাহী',
                'about' => 'Rajshahi-3 is a parliamentary constituency in Rajshahi district.',
                'about_bn' => 'রাজশাহী-৩ রাজশাহী জেলার একটি সংসদীয় আসন।',
                'is_active' => true,
            ],
            [
                'name' => 'Khulna-2',
                'name_bn' => 'খুলনা-২',
                'slug' => 'khulna-2',
                'district' => 'Khulna',
                'district_bn' => 'খুলনা',
                'about' => 'Khulna-2 is a parliamentary constituency in Khulna district.',
                'about_bn' => 'খুলনা-২ খুলনা জেলার একটি সংসদীয় আসন।',
                'is_active' => true,
            ],
        ];

        // Map districts by slug for foreign key (district_id)
        $districtMap = District::pluck('id', 'slug'); // ['dhaka' => 1, ...]

        $constituencyMap = [];
        foreach ($constituencies as $constituencyData) {
            // Determine district slug from Bangla name if available, otherwise from English name
            $districtNameForSlug = $constituencyData['district_bn'] ?? $constituencyData['district'] ?? null;
            $districtSlug = $districtNameForSlug ? \Illuminate\Support\Str::slug($districtNameForSlug) : null;
            $districtId = $districtSlug && isset($districtMap[$districtSlug])
                ? $districtMap[$districtSlug]
                : null;

            $payload = [
                'name' => $constituencyData['name'],
                'name_bn' => $constituencyData['name_bn'] ?? null,
                'slug' => $constituencyData['slug'],
                'district_id' => $districtId,
                'about' => $constituencyData['about'] ?? null,
                'about_bn' => $constituencyData['about_bn'] ?? null,
                'history' => $constituencyData['history'] ?? null,
                'history_bn' => $constituencyData['history_bn'] ?? null,
                'is_active' => $constituencyData['is_active'] ?? true,
            ];

            $constituency = Constituency::firstOrCreate(
                ['slug' => $payload['slug']],
                $payload
            );
            $constituencyMap[$payload['slug']] = $constituency->id;
        }

        $candidates = [
            [
                'name' => 'Ahmed Rahman',
                'name_bn' => 'আহমেদ রহমান',
                'slug' => 'ahmed-rahman',
                'constituency_slug' => 'dhaka-1',
                'party_slug' => 'awami-league',
                'campaign_slogan' => 'Progress for All',
                'campaign_slogan_bn' => 'সবার জন্য অগ্রগতি',
                'campaign_goals' => 'Improving infrastructure, education, and healthcare in Dhaka-1.',
                'campaign_goals_bn' => 'ঢাকা-১ এ অবকাঠামো, শিক্ষা ও স্বাস্থ্যসেবা উন্নত করা।',
                'about' => 'Ahmed Rahman is a dedicated public servant with years of experience in local governance and community development.',
                'about_bn' => 'আহমেদ রহমান একজন নিবেদিতপ্রাণ সরকারি কর্মকর্তা যিনি স্থানীয় শাসন ও সম্প্রদায় উন্নয়নে বছরের পর বছর অভিজ্ঞতা রয়েছে।',
                'history' => 'Ahmed Rahman has served the community for over 20 years, working on various development projects and initiatives.',
                'history_bn' => 'আহমেদ রহমান ২০ বছরেরও বেশি সময় ধরে সম্প্রদায়ের সেবা করেছেন, বিভিন্ন উন্নয়ন প্রকল্প ও উদ্যোগে কাজ করেছেন।',
                'subdomain' => 'ahmed-rahman',
                'whatsapp_number' => '+8801712345678',
                'translator_enabled' => true,
            ],
            [
                'name' => 'Fatima Begum',
                'name_bn' => 'ফাতিমা বেগম',
                'slug' => 'fatima-begum',
                'constituency_slug' => 'chittagong-2',
                'party_slug' => 'bnp',
                'campaign_slogan' => 'Empowerment Through Unity',
                'campaign_slogan_bn' => 'ঐক্যের মাধ্যমে ক্ষমতায়ন',
                'campaign_goals' => 'Women empowerment, youth development, and economic growth.',
                'campaign_goals_bn' => 'নারী ক্ষমতায়ন, যুব উন্নয়ন ও অর্থনৈতিক প্রবৃদ্ধি।',
                'about' => 'Fatima Begum is a strong advocate for women\'s rights and social justice.',
                'about_bn' => 'ফাতিমা বেগম নারী অধিকার ও সামাজিক ন্যায়বিচারের একজন শক্তিশালী প্রবক্তা।',
                'history' => 'Fatima Begum has been involved in social work and women\'s empowerment for over 15 years.',
                'history_bn' => 'ফাতিমা বেগম ১৫ বছরেরও বেশি সময় ধরে সামাজিক কাজ ও নারী ক্ষমতায়নে জড়িত রয়েছেন।',
                'subdomain' => 'fatima-begum',
                'whatsapp_number' => '+8801712345679',
                'translator_enabled' => true,
            ],
            [
                'name' => 'Karim Hossain',
                'name_bn' => 'করিম হোসেন',
                'slug' => 'karim-hossain',
                'constituency_slug' => 'sylhet-1',
                'party_slug' => 'jatiya-party',
                'campaign_slogan' => 'Development First',
                'campaign_slogan_bn' => 'উন্নয়ন প্রথম',
                'campaign_goals' => 'Focusing on regional development and job creation.',
                'campaign_goals_bn' => 'আঞ্চলিক উন্নয়ন ও কর্মসংস্থান সৃষ্টিতে মনোনিবেশ।',
                'about' => 'Karim Hossain is a business leader and community organizer focused on economic development.',
                'about_bn' => 'করিম হোসেন একজন ব্যবসায়ী নেতা ও সম্প্রদায় সংগঠক যিনি অর্থনৈতিক উন্নয়নে মনোনিবেশ করেছেন।',
                'history' => 'Karim Hossain has been instrumental in several regional development projects.',
                'history_bn' => 'করিম হোসেন বেশ কয়েকটি আঞ্চলিক উন্নয়ন প্রকল্পে গুরুত্বপূর্ণ ভূমিকা পালন করেছেন।',
                'subdomain' => 'karim-hossain',
                'whatsapp_number' => '+8801712345680',
                'translator_enabled' => false,
            ],
            [
                'name' => 'Rashida Akter',
                'name_bn' => 'রাশিদা আক্তার',
                'slug' => 'rashida-akter',
                'constituency_slug' => 'rajshahi-3',
                'party_slug' => 'awami-league',
                'campaign_slogan' => 'Education for All',
                'campaign_slogan_bn' => 'সবার জন্য শিক্ষা',
                'campaign_goals' => 'Promoting quality education and skill development.',
                'campaign_goals_bn' => 'মানসম্মত শিক্ষা ও দক্ষতা উন্নয়ন প্রচার।',
                'about' => 'Rashida Akter is an educator and advocate for quality education and skill development.',
                'about_bn' => 'রাশিদা আক্তার একজন শিক্ষাবিদ ও মানসম্মত শিক্ষা ও দক্ষতা উন্নয়নের প্রবক্তা।',
                'history' => 'Rashida Akter has worked in the education sector for over 18 years.',
                'history_bn' => 'রাশিদা আক্তার ১৮ বছরেরও বেশি সময় ধরে শিক্ষা খাতে কাজ করেছেন।',
                'subdomain' => 'rashida-akter',
                'whatsapp_number' => '+8801712345681',
                'translator_enabled' => true,
            ],
            [
                'name' => 'Mohammad Ali',
                'name_bn' => 'মোহাম্মদ আলী',
                'slug' => 'mohammad-ali',
                'constituency_slug' => 'khulna-2',
                'party_slug' => 'bnp',
                'campaign_slogan' => 'Sustainable Growth',
                'campaign_slogan_bn' => 'টেকসই প্রবৃদ্ধি',
                'campaign_goals' => 'Environmental protection and sustainable development.',
                'campaign_goals_bn' => 'পরিবেশ সুরক্ষা ও টেকসই উন্নয়ন।',
                'about' => 'Mohammad Ali is an environmental activist and advocate for sustainable development.',
                'about_bn' => 'মোহাম্মদ আলী একজন পরিবেশ কর্মী ও টেকসই উন্নয়নের প্রবক্তা।',
                'history' => 'Mohammad Ali has been working on environmental issues for over 12 years.',
                'history_bn' => 'মোহাম্মদ আলী ১২ বছরেরও বেশি সময় ধরে পরিবেশগত বিষয়ে কাজ করেছেন।',
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

            // Get party and constituency IDs
            $partyId = $partyMap[$data['party_slug']] ?? null;
            $constituencyId = $constituencyMap[$data['constituency_slug']] ?? null;

            // Create or update candidate
            $candidate = Candidate::updateOrCreate(
                ['slug' => $data['slug']],
                [
                    'tenant_id' => $tenant->id,
                    'name' => $data['name'],
                    'name_bn' => $data['name_bn'],
                    'party_id' => $partyId,
                    'constituency_id' => $constituencyId,
                    'template_id' => $templates->random()->id,
                    'campaign_slogan' => $data['campaign_slogan'],
                    'campaign_slogan_bn' => $data['campaign_slogan_bn'],
                    'campaign_goals' => $data['campaign_goals'],
                    'campaign_goals_bn' => $data['campaign_goals_bn'],
                    'about' => $data['about'],
                    'about_bn' => $data['about_bn'],
                    'history' => $data['history'],
                    'history_bn' => $data['history_bn'],
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

            if ($candidateAdminRole && !$user->hasRole(User::ROLE_CANDIDATE_ADMIN)) {
                $user->roles()->attach($candidateAdminRole->id);
            }
        }
    }
}
