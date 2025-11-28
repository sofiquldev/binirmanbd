<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PaymentMethodsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $paymentMethods = [
            [
                'code' => 'default',
                'name' => 'Default',
                'name_bn' => 'ডিফল্ট',
                'description' => 'Default payment method',
                'description_bn' => 'ডিফল্ট পেমেন্ট পদ্ধতি',
                'is_active' => true,
                'requires_credentials' => false,
                'is_online' => false,
                'config_fields' => null,
                'sort_order' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'bank',
                'name' => 'Bank Transfer',
                'name_bn' => 'ব্যাংক ট্রান্সফার',
                'description' => 'Direct bank transfer',
                'description_bn' => 'সরাসরি ব্যাংক ট্রান্সফার',
                'is_active' => true,
                'requires_credentials' => false,
                'is_online' => false,
                'config_fields' => json_encode([
                    'bank_name',
                    'bank_account_name',
                    'bank_account_number',
                    'bank_routing_number',
                    'bank_branch',
                ]),
                'sort_order' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'bkash',
                'name' => 'bKash',
                'name_bn' => 'বিকাশ',
                'description' => 'bKash mobile banking',
                'description_bn' => 'বিকাশ মোবাইল ব্যাংকিং',
                'is_active' => true,
                'requires_credentials' => false,
                'is_online' => false,
                'config_fields' => json_encode([
                    'bkash_number',
                    'bkash_account_type',
                ]),
                'sort_order' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'sslcommerz',
                'name' => 'SSLCommerz',
                'name_bn' => 'এসএসএল কমার্স',
                'description' => 'SSLCommerz payment gateway',
                'description_bn' => 'এসএসএল কমার্স পেমেন্ট গেটওয়ে',
                'is_active' => true,
                'requires_credentials' => true,
                'is_online' => true,
                'config_fields' => json_encode([
                    'sslcommerz_store_id',
                    'sslcommerz_store_password',
                    'sslcommerz_is_sandbox',
                ]),
                'sort_order' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'nagad',
                'name' => 'Nagad',
                'name_bn' => 'নগদ',
                'description' => 'Nagad mobile banking',
                'description_bn' => 'নগদ মোবাইল ব্যাংকিং',
                'is_active' => true,
                'requires_credentials' => false,
                'is_online' => false,
                'config_fields' => json_encode([
                    'nagad_number',
                    'nagad_account_type',
                ]),
                'sort_order' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'rocket',
                'name' => 'Rocket',
                'name_bn' => 'রকেট',
                'description' => 'DBBL Rocket mobile banking',
                'description_bn' => 'ডিবিবিএল রকেট মোবাইল ব্যাংকিং',
                'is_active' => true,
                'requires_credentials' => false,
                'is_online' => false,
                'config_fields' => json_encode([
                    'rocket_number',
                    'rocket_account_type',
                ]),
                'sort_order' => 5,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'cash',
                'name' => 'Cash',
                'name_bn' => 'নগদ',
                'description' => 'Cash payment',
                'description_bn' => 'নগদ পেমেন্ট',
                'is_active' => true,
                'requires_credentials' => false,
                'is_online' => false,
                'config_fields' => null,
                'sort_order' => 6,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($paymentMethods as $method) {
            DB::table('payment_methods')->updateOrInsert(
                ['code' => $method['code']],
                $method
            );
        }
    }
}
