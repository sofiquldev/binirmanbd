<?php

namespace App\Services;

use App\Models\Candidate;
use App\Models\Template;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use ZipArchive;

class TemplateService
{
    protected string $templatesPath;

    public function __construct()
    {
        $this->templatesPath = public_path('templates');
    }

    /**
     * Get all available templates
     */
    public function getAvailableTemplates(): array
    {
        $templates = [];
        $directories = File::directories($this->templatesPath);

        foreach ($directories as $directory) {
            $templateSlug = basename($directory);
            $configPath = $directory . '/template.json';

            if (File::exists($configPath)) {
                $config = json_decode(File::get($configPath), true);
                if ($config) {
                    $templates[] = [
                        'slug' => $templateSlug,
                        'name' => $config['name'] ?? $templateSlug,
                        'description' => $config['description'] ?? '',
                        'preview_image' => $this->getTemplatePreviewUrl($templateSlug, $config['preview_image'] ?? 'thumb.jpg'),
                        'version' => $config['version'] ?? '1.0.0',
                        'author' => $config['author'] ?? '',
                    ];
                }
            }
        }

        return $templates;
    }

    /**
     * Get template configuration
     */
    public function getTemplateConfig(string $slug): ?array
    {
        $configPath = $this->templatesPath . '/' . $slug . '/template.json';
        
        if (!File::exists($configPath)) {
            return null;
        }

        return json_decode(File::get($configPath), true);
    }

    /**
     * Render template for candidate
     */
    public function renderTemplate(Candidate $candidate, ?string $templateSlug = null): string
    {
        $templateSlug = $templateSlug ?? $candidate->template?->slug ?? 'politian';
        $config = $this->getTemplateConfig($templateSlug);

        if (!$config) {
            throw new \Exception("Template '{$templateSlug}' not found");
        }

        $entryFile = $config['entry_file'] ?? 'index.html';
        $templatePath = $this->templatesPath . '/' . $templateSlug . '/' . $entryFile;

        if (!File::exists($templatePath)) {
            throw new \Exception("Template entry file '{$entryFile}' not found");
        }

        $html = File::get($templatePath);
        
        // Replace template variables
        $html = $this->replaceVariables($html, $candidate, $config);
        
        // Update asset paths
        $html = $this->updateAssetPaths($html, $templateSlug);

        return $html;
    }

    /**
     * Replace template variables with candidate data
     */
    protected function replaceVariables(string $html, Candidate $candidate, array $config): string
    {
        $candidate->load(['party', 'constituency.district']);

        $variables = $config['variables'] ?? [];
        $baseUrl = url('/');

        foreach ($variables as $key => $pattern) {
            $value = $this->getVariableValue($pattern, $candidate, $baseUrl);
            $html = str_replace('{{' . $key . '}}', $value, $html);
        }

        // Also replace direct variable patterns
        $replacements = [
            '{{candidate.name}}' => $candidate->name ?? '',
            '{{candidate.name_bn}}' => $candidate->name_bn ?? '',
            '{{candidate.image}}' => $candidate->image ? asset($candidate->image) : '',
            '{{candidate.campaign_slogan}}' => $candidate->campaign_slogan ?? '',
            '{{candidate.campaign_slogan_bn}}' => $candidate->campaign_slogan_bn ?? '',
            '{{candidate.about}}' => nl2br(e($candidate->about ?? '')),
            '{{candidate.about_bn}}' => nl2br(e($candidate->about_bn ?? '')),
            '{{candidate.history}}' => nl2br(e($candidate->history ?? '')),
            '{{candidate.history_bn}}' => nl2br(e($candidate->history_bn ?? '')),
            '{{candidate.campaign_goals}}' => nl2br(e($candidate->campaign_goals ?? '')),
            '{{candidate.campaign_goals_bn}}' => nl2br(e($candidate->campaign_goals_bn ?? '')),
            '{{candidate.party.name}}' => $candidate->party?->name ?? '',
            '{{candidate.party.name_bn}}' => $candidate->party?->name_bn ?? '',
            '{{candidate.constituency.name}}' => $candidate->constituency?->name ?? '',
            '{{candidate.constituency.name_bn}}' => $candidate->constituency?->name_bn ?? '',
            '{{donation_url}}' => url('/c/' . $candidate->id . '/donate'),
            '{{feedback_url}}' => url('/c/' . $candidate->id . '/f'),
            '{{url(\'/c/\' ~ candidate.id ~ \'/donate\')}}' => url('/c/' . $candidate->id . '/donate'),
            '{{url(\'/c/\' ~ candidate.id ~ \'/f\')}}' => url('/c/' . $candidate->id . '/f'),
            '{{url(\'/\')}}' => $baseUrl,
            '{{base_url}}' => $baseUrl,
        ];

        foreach ($replacements as $search => $replace) {
            $html = str_replace($search, $replace, $html);
        }

        return $html;
    }

    /**
     * Get variable value from pattern
     */
    protected function getVariableValue(string $pattern, Candidate $candidate, string $baseUrl): string
    {
        // Handle URL patterns
        if (str_contains($pattern, 'url(')) {
            if (str_contains($pattern, 'donate')) {
                return url('/c/' . $candidate->id . '/donate');
            }
            if (str_contains($pattern, '/f')) {
                return url('/c/' . $candidate->id . '/f');
            }
            return $baseUrl;
        }

        // Handle candidate data patterns
        $path = str_replace(['{{', '}}'], '', $pattern);
        $parts = explode('.', $path);
        
        $value = $candidate;
        foreach ($parts as $part) {
            if (is_object($value) && isset($value->$part)) {
                $value = $value->$part;
            } elseif (is_array($value) && isset($value[$part])) {
                $value = $value[$part];
            } else {
                return '';
            }
        }

        return (string) $value;
    }

    /**
     * Update asset paths in HTML
     */
    protected function updateAssetPaths(string $html, string $templateSlug): string
    {
        $templateUrl = url('/templates/' . $templateSlug);
        
        // Update relative asset paths (avoid double-processing)
        // Match href/src/action attributes with relative paths (not starting with http://, https://, //, /, or #)
        // Also exclude paths that already contain the template URL to prevent duplication
        $html = preg_replace_callback(
            '/(href|src|action)=["\']([^"\']+)["\']/',
            function ($matches) use ($templateUrl) {
                $attribute = $matches[1];
                $path = $matches[2];
                
                // Skip if already absolute URL, protocol-relative, absolute path, or anchor
                if (preg_match('/^(https?:|\/\/|\/|#)/', $path)) {
                    return $matches[0]; // Return unchanged
                }
                
                // Skip if already contains the template URL (prevent duplication)
                if (str_contains($path, $templateUrl)) {
                    return $matches[0]; // Return unchanged
                }
                
                // Prepend template URL to relative path
                return $attribute . '="' . $templateUrl . '/' . ltrim($path, '/') . '"';
            },
            $html
        );

        return $html;
    }

    /**
     * Get template preview URL
     */
    protected function getTemplatePreviewUrl(string $slug, string $image): string
    {
        return url('/templates/' . $slug . '/' . $image);
    }

    /**
     * Extract and install template from ZIP
     */
    public function installTemplateFromZip(string $zipPath, string $templateSlug): bool
    {
        $zip = new ZipArchive();
        
        if ($zip->open($zipPath) !== true) {
            throw new \Exception('Failed to open ZIP file');
        }

        $extractPath = $this->templatesPath . '/' . $templateSlug;
        
        // Create directory if it doesn't exist
        if (!File::isDirectory($extractPath)) {
            File::makeDirectory($extractPath, 0755, true);
        }

        // Extract files
        $zip->extractTo($extractPath);
        $zip->close();

        // Verify template.json exists
        if (!File::exists($extractPath . '/template.json')) {
            File::deleteDirectory($extractPath);
            throw new \Exception('Template JSON file not found in ZIP');
        }

        // Sync template to database
        $this->syncTemplateToDatabase($templateSlug);

        return true;
    }

    /**
     * Sync template to database
     */
    protected function syncTemplateToDatabase(string $slug): void
    {
        $config = $this->getTemplateConfig($slug);
        
        if (!$config) {
            return;
        }

        Template::updateOrCreate(
            ['slug' => $slug],
            [
                'name' => $config['name'] ?? $slug,
                'description' => $config['description'] ?? '',
                'preview_image' => $this->getTemplatePreviewUrl($slug, $config['preview_image'] ?? 'thumb.jpg'),
                'is_active' => true,
            ]
        );
    }
}

