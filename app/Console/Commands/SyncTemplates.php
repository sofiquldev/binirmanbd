<?php

namespace App\Console\Commands;

use App\Models\Template;
use App\Services\TemplateService;
use Illuminate\Console\Command;

class SyncTemplates extends Command
{
    protected $signature = 'templates:sync';
    protected $description = 'Sync templates from filesystem to database';

    public function handle(TemplateService $templateService)
    {
        $this->info('Syncing templates...');
        
        $templates = $templateService->getAvailableTemplates();
        
        foreach ($templates as $templateData) {
            $template = Template::updateOrCreate(
                ['slug' => $templateData['slug']],
                [
                    'name' => $templateData['name'],
                    'description' => $templateData['description'],
                    'preview_image' => $templateData['preview_image'],
                    'is_active' => true,
                ]
            );
            
            $this->info("Synced template: {$template->name} ({$template->slug})");
        }
        
        $this->info('Template sync completed!');
        return 0;
    }
}

