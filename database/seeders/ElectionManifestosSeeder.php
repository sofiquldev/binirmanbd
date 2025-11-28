<?php

namespace Database\Seeders;

use App\Models\Candidate;
use App\Models\ElectionManifesto;
use App\Models\ElectionManifestoCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ElectionManifestosSeeder extends Seeder
{
    public function run(): void
    {
        $candidates = Candidate::all();

        if ($candidates->isEmpty()) {
            $this->command->warn('No candidates found. Please run CandidatesSeeder first.');
            return;
        }

        $categoriesData = [
            [
                'name' => 'Education',
                'name_bn' => 'শিক্ষা',
                'description' => 'Educational policies and initiatives',
                'description_bn' => 'শিক্ষা নীতি ও উদ্যোগ',
                'manifestos' => [
                    [
                        'title' => 'Free Education for All',
                        'title_bn' => 'সবার জন্য বিনামূল্যে শিক্ষা',
                        'description' => 'We will ensure free and quality education for all children up to grade 12, including free textbooks, uniforms, and meals.',
                        'description_bn' => 'আমরা ১২শ শ্রেণী পর্যন্ত সব শিশুর জন্য বিনামূল্যে এবং মানসম্মত শিক্ষা নিশ্চিত করব, যার মধ্যে বিনামূল্যে পাঠ্যপুস্তক, ইউনিফর্ম এবং খাবার অন্তর্ভুক্ত থাকবে।',
                    ],
                    [
                        'title' => 'Digital Learning Infrastructure',
                        'title_bn' => 'ডিজিটাল শিক্ষা অবকাঠামো',
                        'description' => 'Establish modern computer labs and digital learning platforms in all schools to prepare students for the digital age.',
                        'description_bn' => 'সব স্কুলে আধুনিক কম্পিউটার ল্যাব এবং ডিজিটাল শিক্ষা প্ল্যাটফর্ম স্থাপন করে শিক্ষার্থীদের ডিজিটাল যুগের জন্য প্রস্তুত করা।',
                    ],
                ],
            ],
            [
                'name' => 'Healthcare',
                'name_bn' => 'স্বাস্থ্যসেবা',
                'description' => 'Healthcare policies and medical services',
                'description_bn' => 'স্বাস্থ্যসেবা নীতি ও চিকিৎসা সেবা',
                'manifestos' => [
                    [
                        'title' => 'Universal Health Coverage',
                        'title_bn' => 'সর্বজনীন স্বাস্থ্য কভারেজ',
                        'description' => 'Implement comprehensive health insurance for all citizens, ensuring access to quality healthcare services.',
                        'description_bn' => 'সব নাগরিকের জন্য ব্যাপক স্বাস্থ্য বীমা বাস্তবায়ন করে মানসম্মত স্বাস্থ্যসেবার সুযোগ নিশ্চিত করা।',
                    ],
                    [
                        'title' => 'Modern Hospital Facilities',
                        'title_bn' => 'আধুনিক হাসপাতাল সুবিধা',
                        'description' => 'Build and upgrade hospitals with modern medical equipment and trained healthcare professionals.',
                        'description_bn' => 'আধুনিক চিকিৎসা সরঞ্জাম এবং প্রশিক্ষিত স্বাস্থ্যসেবা পেশাদারদের সাথে হাসপাতাল নির্মাণ ও উন্নয়ন।',
                    ],
                ],
            ],
            [
                'name' => 'Infrastructure',
                'name_bn' => 'অবকাঠামো',
                'description' => 'Infrastructure development and maintenance',
                'description_bn' => 'অবকাঠামো উন্নয়ন ও রক্ষণাবেক্ষণ',
                'manifestos' => [
                    [
                        'title' => 'Road Network Development',
                        'title_bn' => 'সড়ক নেটওয়ার্ক উন্নয়ন',
                        'description' => 'Develop and maintain a comprehensive road network connecting all villages and towns for better connectivity.',
                        'description_bn' => 'সব গ্রাম ও শহরকে সংযুক্ত করার জন্য একটি ব্যাপক সড়ক নেটওয়ার্ক উন্নয়ন ও রক্ষণাবেক্ষণ।',
                    ],
                    [
                        'title' => 'Clean Water Supply',
                        'title_bn' => 'পরিষ্কার পানি সরবরাহ',
                        'description' => 'Ensure access to clean and safe drinking water for all households through modern water supply systems.',
                        'description_bn' => 'আধুনিক পানি সরবরাহ ব্যবস্থার মাধ্যমে সব পরিবারের জন্য পরিষ্কার এবং নিরাপদ পানীয় জলের সুযোগ নিশ্চিত করা।',
                    ],
                ],
            ],
            [
                'name' => 'Employment',
                'name_bn' => 'কর্মসংস্থান',
                'description' => 'Employment opportunities and job creation',
                'description_bn' => 'কর্মসংস্থানের সুযোগ ও চাকরি সৃষ্টি',
                'manifestos' => [
                    [
                        'title' => 'Youth Employment Program',
                        'title_bn' => 'যুব কর্মসংস্থান কর্মসূচি',
                        'description' => 'Create job opportunities for youth through skill development programs and entrepreneurship support.',
                        'description_bn' => 'দক্ষতা উন্নয়ন কর্মসূচি এবং উদ্যোক্তা সহায়তার মাধ্যমে যুবকদের জন্য কর্মসংস্থানের সুযোগ সৃষ্টি করা।',
                    ],
                    [
                        'title' => 'Women Empowerment in Workforce',
                        'title_bn' => 'কর্মক্ষেত্রে নারী ক্ষমতায়ন',
                        'description' => 'Promote women participation in the workforce with equal opportunities and fair wages.',
                        'description_bn' => 'সমান সুযোগ এবং ন্যায্য মজুরির সাথে কর্মক্ষেত্রে নারীদের অংশগ্রহণ বৃদ্ধি করা।',
                    ],
                ],
            ],
            [
                'name' => 'Agriculture',
                'name_bn' => 'কৃষি',
                'description' => 'Agricultural development and farmer support',
                'description_bn' => 'কৃষি উন্নয়ন ও কৃষক সহায়তা',
                'manifestos' => [
                    [
                        'title' => 'Modern Farming Techniques',
                        'title_bn' => 'আধুনিক কৃষি কৌশল',
                        'description' => 'Introduce modern farming techniques and provide subsidies for agricultural equipment and seeds.',
                        'description_bn' => 'আধুনিক কৃষি কৌশল চালু করা এবং কৃষি সরঞ্জাম ও বীজের জন্য ভর্তুকি প্রদান করা।',
                    ],
                    [
                        'title' => 'Fair Price for Agricultural Products',
                        'title_bn' => 'কৃষি পণ্যের ন্যায্য মূল্য',
                        'description' => 'Establish fair pricing mechanisms and market access for farmers to ensure profitable agriculture.',
                        'description_bn' => 'কৃষকদের জন্য ন্যায্য মূল্য নির্ধারণ ব্যবস্থা এবং বাজার প্রবেশাধিকার স্থাপন করে লাভজনক কৃষি নিশ্চিত করা।',
                    ],
                ],
            ],
        ];

        // Create categories once (shared across all tenants)
        $categoryMap = [];
        foreach ($categoriesData as $index => $categoryData) {
            $slug = Str::slug($categoryData['name']);
            $category = ElectionManifestoCategory::firstOrCreate(
                ['slug' => $slug],
                [
                    'name' => $categoryData['name'],
                    'name_bn' => $categoryData['name_bn'],
                    'description' => $categoryData['description'],
                    'description_bn' => $categoryData['description_bn'],
                    'is_active' => true,
                    'sort_order' => $index,
                ]
            );
            $categoryMap[$slug] = $category->id;
        }

        // Create manifestos for all candidates
        foreach ($candidates as $candidate) {
            foreach ($categoriesData as $categoryData) {
                $categorySlug = Str::slug($categoryData['name']);
                $categoryId = $categoryMap[$categorySlug];

                foreach ($categoryData['manifestos'] as $manifestoData) {
                    ElectionManifesto::create([
                        'tenant_id' => $candidate->tenant_id,
                        'candidate_id' => $candidate->id,
                        'category_id' => $categoryId,
                        'title' => $manifestoData['title'],
                        'title_bn' => $manifestoData['title_bn'],
                        'description' => $manifestoData['description'],
                        'description_bn' => $manifestoData['description_bn'],
                        'views' => rand(50, 1000),
                        'likes' => rand(10, 500),
                        'dislikes' => rand(0, 50),
                        'is_visible' => true,
                    ]);
                }
            }
        }

        $this->command->info('Election manifestos and categories seeded successfully!');
    }
}
