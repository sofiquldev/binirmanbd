<?php

namespace App\Services;

use App\Models\Candidate;
use App\Models\Template;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use ZipArchive;

class TemplateService
{
    protected string $templatesPath;
    protected string $locale = 'bn';

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
     * Prepare template data for Blade views
     */
    /**
     * Prepare template data for Blade views
     */
    public function prepareTemplateData(Candidate $candidate, ?string $templateSlug = null, array $pageData = []): array
    {
        $templateSlug = $templateSlug ?? $candidate->template?->slug ?? 'minimal';
        
        // Determine locale: query param > cookie > candidate default > browser preferred > fallback bn
        $queryLang = request()->query('lang');
        $cookieLang = request()->cookie('preferred_language');
        $requestedLang = $queryLang ?? $cookieLang;
        $locale = $this->resolveLocale($candidate, $requestedLang);
        
        // Set Laravel's application locale for translations
        app()->setLocale($locale);
        
        // Load candidate relationships
        $candidate->load([
            'party',
            'constituency.district',
            'manifestos' => function ($query) {
                $query->where('is_visible', true)
                    ->latest()
                    ->limit(12);
            },
            'pageContent',
            'testimonials' => function ($query) {
                $query->where('is_featured', true)
                    ->latest()
                    ->limit(6);
            },
        ]);

        // Helper function for translation
        $translate = function ($en, $bn) use ($locale) {
            return $this->translate($en, $bn, $locale);
        };

        // Prepare fun facts
        $funfactDefaults = [
            ['label' => 'Total People lived in our city', 'number' => '35', 'suffix' => 'K'],
            ['label' => 'Square kilometers region covers', 'number' => '12', 'suffix' => 'K'],
            ['label' => 'Private & domestic garden land', 'number' => '25', 'suffix' => '%'],
            ['label' => 'Average Costs of Home Ownership', 'number' => '8', 'suffix' => 'th'],
        ];

        $rawFunfacts = $candidate->pageContent?->funfacts ?? [];
        $funfacts = [];
        for ($i = 0; $i < 4; $i++) {
            $item = $rawFunfacts[$i] ?? [];
            $funfacts[$i] = [
                'label' => $item['title'] ?? $item['label'] ?? $funfactDefaults[$i]['label'],
                'number' => $item['number'] ?? $item['value'] ?? $funfactDefaults[$i]['number'],
                'suffix' => $item['suffix'] ?? $funfactDefaults[$i]['suffix'],
            ];
        }

        // Prepare images (fallback to global brand logo)
        $brandLogo = $candidate->pageContent?->brand_logo
            ?? $candidate->pageContent?->signature_photo
            ?? ($candidate->image ? asset($candidate->image) : asset('assets/media/brand-logos/binirman-logo.png'));

        $footerImage = $candidate->pageContent?->footer_banner
            ?? $candidate->pageContent?->hero_photo
            ?? $candidate->pageContent?->about_photo
            ?? ($candidate->image ? asset($candidate->image) : url('/templates/minimal/assets/images/footer-parallax.jpg'));

        // Prepare manifestos HTML
        $manifestosHtml = $this->generateManifestoCards($candidate, $locale);
        
        // Prepare testimonials HTML
        $testimonialsData = $this->generateTestimonialsData($candidate, $locale);

        // Template asset base URL
        $assetBaseUrl = url('/templates/' . $templateSlug);

        return array_merge([
            'candidate' => $candidate,
            'templateSlug' => $templateSlug,
            'locale' => $locale,
            'assetBaseUrl' => $assetBaseUrl,
            
            // Candidate data (translated)
            'candidateName' => $translate($candidate->name ?? '', $candidate->name_bn ?? ''),
            'candidateNameBn' => $candidate->name_bn ?? '',
            'candidateImage' => $candidate->image ? asset($candidate->image) : '',
            'campaignSlogan' => $translate($candidate->campaign_slogan ?? '', $candidate->campaign_slogan_bn ?? ''),
            'campaignSloganBn' => $candidate->campaign_slogan_bn ?? '',
            'about' => $translate($candidate->about ?? '', $candidate->about_bn ?? ''),
            'aboutBn' => $candidate->about_bn ?? '',
            'history' => $translate($candidate->history ?? '', $candidate->history_bn ?? ''),
            'historyBn' => $candidate->history_bn ?? '',
            'campaignGoals' => $translate($candidate->campaign_goals ?? '', $candidate->campaign_goals_bn ?? ''),
            'campaignGoalsBn' => $candidate->campaign_goals_bn ?? '',
            
            // Party & Constituency
            'partyName' => $translate($candidate->party?->name ?? '', $candidate->party?->name_bn ?? ''),
            'partyNameBn' => $candidate->party?->name_bn ?? '',
            'partyLogo' => $candidate->party?->logo ? asset($candidate->party->logo) : null,
            'constituencyName' => $translate($candidate->constituency?->name ?? '', $candidate->constituency?->name_bn ?? ''),
            'constituencyNameBn' => $candidate->constituency?->name_bn ?? '',
            
            // URLs
            'donationUrl' => url('/c/' . $candidate->id . '/donate'),
            'feedbackUrl' => url('/c/' . $candidate->id . '/f'),
            'baseUrl' => url('/'),
            
            // Images
            'heroImage' => $candidate->pageContent?->hero_photo ?? ($candidate->image ? asset($candidate->image) : ''),
            'aboutImage' => $candidate->pageContent?->about_photo ?? ($candidate->image ? asset($candidate->image) : ''),
            'signatureImage' => $candidate->pageContent?->signature_photo ?? $assetBaseUrl . '/assets/images/signeture.png',
            'brandLogo' => $brandLogo,
            'footerImage' => $footerImage,
            
            // Content
            'missionText' => $candidate->pageContent?->mission ?? '',
            'visionText' => $candidate->pageContent?->vision ?? '',
            'videoUrl' => $candidate->pageContent?->video_url ?? 'https://www.youtube.com/embed/2lmv6ZDm0vw',
            'videoThumb' => $candidate->pageContent?->video_thumb ?? '',
            
            // Fun facts
            'funfacts' => $funfacts,
            
            // Manifestos & Testimonials
            'manifestosHtml' => $manifestosHtml,
            'testimonials' => $testimonialsData,
            
            // Custom CSS/JS
            'customCss' => $candidate->pageContent?->custom_css ?? '',
            'customJs' => $candidate->pageContent?->custom_js ?? '',
        ], $pageData);
    }

    /**
     * Generate manifestos HTML
     */
    protected function generateManifestoCards(Candidate $candidate, string $locale): string
    {
        $manifestos = $candidate->manifestos ?? collect();

        if ($manifestos->isEmpty()) {
            return '<div class="grid"><div class="wpo-service-item"><div class="wpo-service-text"><h2>Manifesto coming soon</h2><p>Manifesto items will appear here once published.</p></div></div></div>';
        }

        return $manifestos->map(function ($manifesto) use ($locale) {
            $title = e($this->translate($manifesto->title ?? 'Manifesto', $manifesto->title_bn ?? null, $locale));
            $description = Str::limit(
                strip_tags($this->translate($manifesto->description ?? '', $manifesto->description_bn ?? null, $locale)),
                150
            );

            return '<div class="grid"><div class="wpo-service-item"><div class="wpo-service-text"><h2>' . $title . '</h2><p>' . $description . '</p></div></div></div>';
        })->implode("\n");
    }

    /**
     * Generate testimonials data
     */
    protected function generateTestimonialsData(Candidate $candidate, string $locale): array
    {
        $testimonials = $candidate->testimonials ?? collect();
        
        if ($testimonials->isEmpty()) {
            return [
                'images' => '<div class="testimonial-img"><img src="assets/images/testimonial/1.png" alt=""></div>',
                'items' => '<div class="wpo-testimonial-item"><div class="wpo-testimonial-text"><i class="fi flaticon-right-quote-sign"></i><p>Testimonials will appear here once published.</p><div class="wpo-testimonial-text-btm"><div class="wpo-testimonial-text-btm-img"><img src="assets/images/testimonial/thumb1.png" alt=""></div><div class="wpo-testimonial-text-btm-info"><h3>Coming Soon</h3><span>Testimonials</span></div></div></div></div>',
            ];
        }

        $images = $testimonials->map(function ($testimonial) use ($locale) {
            $photoUrl = $this->getImageUrl(
                $testimonial->photo_url ?? $testimonial->avatar_url,
                'assets/images/testimonial/1.png'
            );
            $alt = e($this->translate(
                $testimonial->name ?? 'Testimonial',
                $testimonial->author_name_bn ?? $testimonial->name_bn ?? $testimonial->name ?? 'Testimonial',
                $locale
            ));
            
            return '<div class="testimonial-img"><img src="' . $photoUrl . '" alt="' . $alt . '" onerror="this.src=\'assets/images/testimonial/1.png\'"></div>';
        })->implode("\n");

        $items = $testimonials->map(function ($testimonial) use ($locale) {
            $quote = e($this->translate($testimonial->quote ?? '', $testimonial->content_bn ?? '', $locale));
            $name = e($this->translate($testimonial->name ?? 'Anonymous', $testimonial->author_name_bn ?? '', $locale));
            $designation = e($this->translate($testimonial->designation ?? '', $testimonial->author_designation_bn ?? '', $locale));
            
            $avatarUrl = $this->getImageUrl(
                $testimonial->avatar_url ?? $testimonial->photo_url,
                'assets/images/testimonial/thumb1.png'
            );
            
            return '<div class="wpo-testimonial-item"><div class="wpo-testimonial-text"><i class="fi flaticon-right-quote-sign"></i><p>"' . $quote . '"</p><div class="wpo-testimonial-text-btm"><div class="wpo-testimonial-text-btm-img"><img src="' . $avatarUrl . '" alt="' . $name . '" onerror="this.src=\'assets/images/testimonial/thumb1.png\'"></div><div class="wpo-testimonial-text-btm-info"><h3>' . $name . '</h3><span>' . $designation . '</span></div></div></div></div>';
        })->implode("\n");

        return [
            'images' => $images,
            'items' => $items,
        ];
    }

    /**
     * Replace template variables with candidate data
     */
    protected function replaceVariables(string $html, Candidate $candidate, array $config, array $pageData = []): string
    {
        $candidate->load([
            'party',
            'constituency.district',
            'manifestos' => function ($query) {
                $query->where('is_visible', true)
                    ->latest()
                    ->limit(12);
            },
            'pageContent',
            'testimonials' => function ($query) {
                $query->where('is_featured', true)
                    ->latest()
                    ->limit(6);
            },
        ]);

        $variables = $config['variables'] ?? [];
        $baseUrl = url('/');
        $locale = $this->locale ?? 'bn';
        $translate = function ($en, $bn) use ($locale) {
            return $this->translate($en, $bn, $locale);
        };

        foreach ($variables as $key => $pattern) {
            $value = $this->getVariableValue($pattern, $candidate, $baseUrl);
            $html = str_replace('{{' . $key . '}}', $value, $html);
        }

        // Also replace direct variable patterns
        // Prepare fun facts with fallbacks and support for legacy keys
        $funfactDefaults = [
            ['label' => 'Total People lived in our city', 'number' => '35', 'suffix' => 'K'],
            ['label' => 'Square kilometers region covers', 'number' => '12', 'suffix' => 'K'],
            ['label' => 'Private & domestic garden land', 'number' => '25', 'suffix' => '%'],
            ['label' => 'Average Costs of Home Ownership', 'number' => '8', 'suffix' => 'th'],
        ];

        $rawFunfacts = $candidate->pageContent?->funfacts ?? [];
        $funfacts = [];
        for ($i = 0; $i < 4; $i++) {
            $item = $rawFunfacts[$i] ?? [];
            $label = $item['title'] ?? $item['label'] ?? $funfactDefaults[$i]['label'];
            $number = $item['number'] ?? $item['value'] ?? $funfactDefaults[$i]['number'];
            $suffix = $item['suffix'] ?? $funfactDefaults[$i]['suffix'];
            $value = trim($number . (strlen($suffix) ? ' ' . $suffix : ''));

            $funfacts[$i] = [
                'label' => $label,
                'number' => $number,
                'suffix' => $suffix,
                'value' => $value, // combined for legacy placeholders
            ];
        }

        // Prefer dedicated logo asset; then signature; then candidate image; finally template default.
        $brandLogo = $candidate->pageContent?->brand_logo
            ?? $candidate->pageContent?->signature_photo
            ?? ($candidate->image ? asset($candidate->image) : url('/templates/politian/assets/images/logo.svg'));

        // Footer banner prefers dedicated banner, then hero/about imagery; fallback to candidate image then template default.
        $footerImage = $candidate->pageContent?->footer_banner
            ?? $candidate->pageContent?->hero_photo
            ?? $candidate->pageContent?->about_photo
            ?? ($candidate->image ? asset($candidate->image) : url('/templates/politian/assets/images/footer-parallax.jpg'));

        $customCssBlock = $candidate->pageContent?->custom_css
            ? '<style>' . $candidate->pageContent?->custom_css . '</style>'
            : '';

        $customJsBlock = $candidate->pageContent?->custom_js
            ? '<script>' . $candidate->pageContent?->custom_js . '</script>'
            : '';

        $replacements = [
            '{{candidate.name}}' => $translate($candidate->name ?? '', $candidate->name_bn ?? ''),
            '{{candidate.name_bn}}' => $candidate->name_bn ?? '',
            '{{candidate.image}}' => $candidate->image ? asset($candidate->image) : '',
            '{{candidate.campaign_slogan}}' => $translate($candidate->campaign_slogan ?? '', $candidate->campaign_slogan_bn ?? ''),
            '{{candidate.campaign_slogan_bn}}' => $candidate->campaign_slogan_bn ?? '',
            '{{candidate.about}}' => nl2br(e($translate($candidate->about ?? '', $candidate->about_bn ?? ''))),
            '{{candidate.about_bn}}' => nl2br(e($candidate->about_bn ?? '')),
            '{{candidate.history}}' => nl2br(e($translate($candidate->history ?? '', $candidate->history_bn ?? ''))),
            '{{candidate.history_bn}}' => nl2br(e($candidate->history_bn ?? '')),
            '{{candidate.campaign_goals}}' => nl2br(e($translate($candidate->campaign_goals ?? '', $candidate->campaign_goals_bn ?? ''))),
            '{{candidate.campaign_goals_bn}}' => nl2br(e($candidate->campaign_goals_bn ?? '')),
            '{{candidate.party.name}}' => $translate($candidate->party?->name ?? '', $candidate->party?->name_bn ?? ''),
            '{{candidate.party.name_bn}}' => $candidate->party?->name_bn ?? '',
            '{{candidate.constituency.name}}' => $translate($candidate->constituency?->name ?? '', $candidate->constituency?->name_bn ?? ''),
            '{{candidate.constituency.name_bn}}' => $candidate->constituency?->name_bn ?? '',
            '{{donation_url}}' => url('/c/' . $candidate->id . '/donate'),
            '{{feedback_url}}' => url('/c/' . $candidate->id . '/f'),
            '{{url(\'/c/\' ~ candidate.id ~ \'/donate\')}}' => url('/c/' . $candidate->id . '/donate'),
            '{{url(\'/c/\' ~ candidate.id ~ \'/f\')}}' => url('/c/' . $candidate->id . '/f'),
            '{{url(\'/\')}}' => $baseUrl,
            '{{base_url}}' => $baseUrl,
            '{{hero_image}}' => $candidate->pageContent?->hero_photo ?? ($candidate->image ? asset($candidate->image) : ''),
            '{{about_image}}' => $candidate->pageContent?->about_photo ?? ($candidate->image ? asset($candidate->image) : ''),
            '{{signature_image}}' => $candidate->pageContent?->signature_photo ?? 'assets/images/signeture.png',
            '{{mission_text}}' => nl2br(e($candidate->pageContent?->mission ?? '')),
            '{{vision_text}}' => nl2br(e($candidate->pageContent?->vision ?? '')),
            '{{funfact_1_label}}' => $funfacts[0]['label'],
            '{{funfact_1_number}}' => $funfacts[0]['number'],
            '{{funfact_1_suffix}}' => $funfacts[0]['suffix'],
            '{{funfact_1_value}}' => $funfacts[0]['value'],
            '{{funfact_2_label}}' => $funfacts[1]['label'],
            '{{funfact_2_number}}' => $funfacts[1]['number'],
            '{{funfact_2_suffix}}' => $funfacts[1]['suffix'],
            '{{funfact_2_value}}' => $funfacts[1]['value'],
            '{{funfact_3_label}}' => $funfacts[2]['label'],
            '{{funfact_3_number}}' => $funfacts[2]['number'],
            '{{funfact_3_suffix}}' => $funfacts[2]['suffix'],
            '{{funfact_3_value}}' => $funfacts[2]['value'],
            '{{funfact_4_label}}' => $funfacts[3]['label'],
            '{{funfact_4_number}}' => $funfacts[3]['number'],
            '{{funfact_4_suffix}}' => $funfacts[3]['suffix'],
            '{{funfact_4_value}}' => $funfacts[3]['value'],
            '{{video_url}}' => $candidate->pageContent?->video_url ?? 'https://www.youtube.com/embed/2lmv6ZDm0vw',
            '{{video_thumb}}' => $candidate->pageContent?->video_thumb ?? '',
            '{{privacy_policy}}' => nl2br(e($candidate->pageContent?->privacy_policy ?? '')),
            '{{about_us_text}}' => nl2br(e($candidate->pageContent?->about_us ?? '')),
            '{{brand_logo}}' => $brandLogo,
            '{{footer_image}}' => $footerImage,
            '{{custom_css}}' => $candidate->pageContent?->custom_css ?? '',
            '{{custom_js}}' => $candidate->pageContent?->custom_js ?? '',
            '{{custom_css_block}}' => $customCssBlock,
            '{{custom_js_block}}' => $customJsBlock,
            '{{current_locale}}' => $locale,
        ];

        foreach ($replacements as $search => $replace) {
            $html = str_replace($search, $replace, $html);
        }

        // Replace page_data variables
        foreach ($pageData as $key => $value) {
            $html = str_replace('{{page_data.' . $key . '}}', $value, $html);
        }

        $html = $this->replaceManifestoCards($html, $candidate);
        $html = $this->replaceTestimonials($html, $candidate);

        return $html;
    }

    /**
     * Replace manifesto placeholder with generated cards
     */
    protected function replaceManifestoCards(string $html, Candidate $candidate): string
    {
        if (!str_contains($html, '{{manifesto_cards}}')) {
            return $html;
        }

        $manifestos = $candidate->manifestos ?? collect();

        if ($manifestos->isEmpty()) {
            $fallback = <<<HTML
                    <div class="grid">
                        <div class="wpo-service-item">
                            <div class="wpo-service-text">
                                <h2>Manifesto coming soon</h2>
                                <p>Manifesto items will appear here once published.</p>
                            </div>
                        </div>
                    </div>
            HTML;

            return str_replace('{{manifesto_cards}}', $fallback, $html);
        }

        $locale = $this->locale ?? 'bn';
        $cards = $manifestos->map(function ($manifesto) use ($locale) {
            $title = e($this->translate($manifesto->title ?? 'Manifesto', $manifesto->title_bn ?? null, $locale));
            $description = Str::limit(
                strip_tags($this->translate($manifesto->description ?? '', $manifesto->description_bn ?? null, $locale)),
                150
            );

            return <<<HTML
                    <div class="grid">
                        <div class="wpo-service-item">
                            <div class="wpo-service-text">
                                <h2>{$title}</h2>
                                <p>{$description}</p>
                            </div>
                        </div>
                    </div>
            HTML;
        })->implode("\n");

        return str_replace('{{manifesto_cards}}', $cards, $html);
    }

    /**
     * Replace testimonial placeholders with generated content
     */
    protected function replaceTestimonials(string $html, Candidate $candidate): string
    {
        // Ensure testimonials are loaded
        if (!$candidate->relationLoaded('testimonials')) {
            $candidate->load([
                'testimonials' => function ($query) {
                    $query->where('is_featured', true)
                        ->latest()
                        ->limit(6);
                },
            ]);
        }
        
        $testimonials = $candidate->testimonials ?? collect();
        $locale = $this->locale ?? 'bn';

        // Replace testimonial images (left slide)
        if (str_contains($html, '{{testimonial_images}}')) {
            if ($testimonials->isEmpty()) {
                $fallbackImages = <<<HTML
                                        <div class="testimonial-img">
                                            <img src="assets/images/testimonial/1.png" alt="">
                                        </div>
                                        <div class="testimonial-img">
                                            <img src="assets/images/testimonial/2.png" alt="">
                                        </div>
                                        <div class="testimonial-img">
                                            <img src="assets/images/testimonial/3.png" alt="">
                                        </div>
            HTML;
                $html = str_replace('{{testimonial_images}}', $fallbackImages, $html);
            } else {
                $images = $testimonials->map(function ($testimonial) use ($locale) {
                    $photoUrl = $this->getImageUrl(
                        $testimonial->photo_url ?? $testimonial->avatar_url,
                        'assets/images/testimonial/1.png'
                    );
                    $alt = e($this->translate(
                        $testimonial->name ?? 'Testimonial',
                        $testimonial->author_name_bn ?? $testimonial->name_bn ?? $testimonial->name ?? 'Testimonial',
                        $locale
                    ));
                    
                    return <<<HTML
                                        <div class="testimonial-img">
                                            <img src="{$photoUrl}" alt="{$alt}" onerror="this.src='assets/images/testimonial/1.png'">
                                        </div>
            HTML;
                })->implode("\n");
                
                $html = str_replace('{{testimonial_images}}', $images, $html);
            }
        }

        // Replace testimonial items (right slide)
        if (str_contains($html, '{{testimonial_items}}')) {
            if ($testimonials->isEmpty()) {
                $fallbackItems = <<<HTML
                                    <div class="wpo-testimonial-item">
                                        <div class="wpo-testimonial-text">
                                            <i class="fi flaticon-right-quote-sign"></i>
                                            <p>Testimonials will appear here once published.</p>
                                            <div class="wpo-testimonial-text-btm">
                                                <div class="wpo-testimonial-text-btm-img">
                                                    <img src="assets/images/testimonial/thumb1.png" alt="">
                                                </div>
                                                <div class="wpo-testimonial-text-btm-info">
                                                    <h3>Coming Soon</h3>
                                                    <span>Testimonials</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
            HTML;
                $html = str_replace('{{testimonial_items}}', $fallbackItems, $html);
            } else {
                $items = $testimonials->map(function ($testimonial) use ($locale) {
                    $quote = e($this->translate($testimonial->quote ?? '', $testimonial->content_bn ?? '', $locale));
                    $name = e($this->translate($testimonial->name ?? 'Anonymous', $testimonial->author_name_bn ?? '', $locale));
                    $designation = e($this->translate($testimonial->designation ?? '', $testimonial->author_designation_bn ?? '', $locale));
                    
                    $avatarUrl = $this->getImageUrl(
                        $testimonial->avatar_url ?? $testimonial->photo_url,
                        'assets/images/testimonial/thumb1.png'
                    );
                    
                    return <<<HTML
                                    <div class="wpo-testimonial-item">
                                        <div class="wpo-testimonial-text">
                                            <i class="fi flaticon-right-quote-sign"></i>
                                            <p>"{$quote}"</p>
                                            <div class="wpo-testimonial-text-btm">
                                                <div class="wpo-testimonial-text-btm-img">
                                                    <img src="{$avatarUrl}" alt="{$name}" onerror="this.src='assets/images/testimonial/thumb1.png'">
                                                </div>
                                                <div class="wpo-testimonial-text-btm-info">
                                                    <h3>{$name}</h3>
                                                    <span>{$designation}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
            HTML;
                })->implode("\n");
                
                $html = str_replace('{{testimonial_items}}', $items, $html);
            }
        }

        return $html;
    }

    /**
     * Get image URL, handling both absolute and relative URLs
     */
    protected function getImageUrl(?string $url, string $fallback = ''): string
    {
        if (empty($url)) {
            return $fallback;
        }

        // If already absolute URL, return as is
        if (preg_match('/^(https?:|\/\/)/', $url)) {
            return $url;
        }

        // Otherwise, use asset() helper
        return asset($url);
    }

    /**
     * Choose value based on locale (bn/en) with graceful fallback.
     */
    protected function translate(?string $enValue, ?string $bnValue, string $locale): string
    {
        $enValue = $enValue ?? '';
        $bnValue = $bnValue ?? '';

        if ($locale === 'bn') {
            return $bnValue !== '' ? $bnValue : $enValue;
        }

        return $enValue !== '' ? $enValue : $bnValue;
    }

    /**
     * Decide which locale to use for rendering.
     */
    protected function resolveLocale(Candidate $candidate, ?string $requested = null): string
    {
        $supported = $candidate->supported_languages ?? ['bn', 'en'];
        if (empty($supported)) {
            $supported = ['bn', 'en'];
        }

        $normalize = function (?string $locale): ?string {
            if (!$locale) {
                return null;
            }
            $locale = strtolower($locale);
            return str_starts_with($locale, 'bn') ? 'bn' : (str_starts_with($locale, 'en') ? 'en' : null);
        };

        $allowed = collect($supported)
            ->map($normalize)
            ->filter()
            ->unique()
            ->values()
            ->all();

        if (empty($allowed)) {
            $allowed = ['bn', 'en'];
        }

        $requestedLocale = $normalize($requested);
        if ($requestedLocale && in_array($requestedLocale, $allowed, true)) {
            return $requestedLocale;
        }

        $defaultLocale = $normalize($candidate->default_locale ?? null);
        if ($defaultLocale && in_array($defaultLocale, $allowed, true)) {
            return $defaultLocale;
        }

        $preferred = $normalize(request()->getPreferredLanguage($allowed));
        if ($preferred && in_array($preferred, $allowed, true)) {
            return $preferred;
        }

        return 'bn';
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

