<?php

namespace Database\Seeders;

use App\Models\Template;
use Illuminate\Database\Seeder;

class TemplateSeeder extends Seeder
{
    public function run(): void
    {
        $templates = [
            [
                'name' => 'Modern Momentum',
                'slug' => 'modern',
                'description' => 'Bold hero layout, dynamic news section, optimized for storytelling.',
            ],
            [
                'name' => 'Classic Trust',
                'slug' => 'classic',
                'description' => 'Traditional layout with emphasis on manifesto, party messaging, and endorsements.',
            ],
            [
                'name' => 'Minimal Connect',
                'slug' => 'minimal',
                'description' => 'Lightweight design focused on donation funnels and citizen feedback.',
            ],
        ];

        foreach ($templates as $template) {
            Template::updateOrCreate(
                ['slug' => $template['slug']],
                $template
            );
        }
    }
}
