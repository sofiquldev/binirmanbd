<?php

namespace Database\Seeders;

use App\Models\District;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DistrictsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Divisions (Bangla name + slug)
        $divisions = [
            ['name' => 'ঢাকা', 'slug' => 'dhaka'],
            ['name' => 'চট্টগ্রাম', 'slug' => 'chittagong'],
            ['name' => 'রাজশাহী', 'slug' => 'rajshahi'],
            ['name' => 'খুলনা', 'slug' => 'khulna'],
            ['name' => 'বরিশাল', 'slug' => 'barisal'],
            ['name' => 'সিলেট', 'slug' => 'sylhet'],
            ['name' => 'রংপুর', 'slug' => 'rangpur'],
            ['name' => 'ময়মনসিংহ', 'slug' => 'mymensingh'],
        ];

        // Districts grouped by Bangla division name
        $districts = [
            // Dhaka Division
            'ঢাকা' => ['ঢাকা', 'গাজীপুর', 'নারায়ণগঞ্জ', 'টাঙ্গাইল', 'মানিকগঞ্জ', 'মুন্সিগঞ্জ', 'ফরিদপুর', 'মাদারীপুর'],

            // Chittagong Division
            'চট্টগ্রাম' => ['চট্টগ্রাম', 'কক্সবাজার', 'কুমিল্লা', 'ফেনী', 'নোয়াখালী', 'ব্রাহ্মণবাড়িয়া', 'লক্ষ্মীপুর'],

            // Rajshahi Division
            'রাজশাহী' => ['রাজশাহী', 'বগুড়া', 'পাবনা', 'জয়পুরহাট', 'চাঁপাইনবাবগঞ্জ', 'নাটোর', 'সিরাজগঞ্জ'],

            // Khulna Division
            'খুলনা' => ['খুলনা', 'যশোর', 'বাগেরহাট', 'কুষ্টিয়া', 'মেহেরপুর', 'মাগুরা'],

            // Barisal Division
            'বরিশাল' => ['বরিশাল', 'পটুয়াখালী', 'ভোলা', 'পিরোজপুর', 'ঝালকাঠি', 'বরগুনা'],

            // Sylhet Division
            'সিলেট' => ['সিলেট', 'মৌলভীবাজার', 'হবিগঞ্জ', 'সুনামগঞ্জ'],

            // Rangpur Division
            'রংপুর' => ['রংপুর', 'দিনাজপুর', 'কুড়িগ্রাম', 'লালমনিরহাট', 'নীলফামারী', 'গাইবান্ধা', 'ঠাকুরগাঁও', 'পঞ্চগড়'],

            // Mymensingh Division
            'ময়মনসিংহ' => ['ময়মনসিংহ', 'শেরপুর', 'নেত্রকোণা', 'জামালপুর'],
        ];

        foreach ($divisions as $division) {
            $divisionNameBn = $division['name'];
            $divisionSlug = $division['slug'];

            if (!isset($districts[$divisionNameBn])) {
                continue;
            }

            foreach ($districts[$divisionNameBn] as $districtNameBn) {
                District::updateOrCreate(
                    ['slug' => Str::slug($districtNameBn)],
                    [
                        // Store Bangla name in both fields for now
                        'name' => $districtNameBn,
                        'name_bn' => $districtNameBn,
                        'slug' => Str::slug($districtNameBn),
                        'division' => Str::title($divisionSlug),
                        'division_bn' => $divisionNameBn,
                    ],
                );
            }
        }
    }
}


