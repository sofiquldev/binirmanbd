<?php

namespace App\Livewire\Candidate;

use App\Models\Candidate;
use App\Models\Template;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class TemplateSelector extends Component
{
    public ?Candidate $candidate = null;
    public Collection $templates;
    public ?int $templateId = null;

    public function mount(): void
    {
        $this->candidate = Auth::user()?->candidate;
        $this->templates = Template::query()->where('is_active', true)->orderBy('name')->get();
        $this->templateId = $this->candidate?->template_id;
    }

    public function selectTemplate(int $templateId): void
    {
        if (! $this->candidate) {
            $this->addError('candidate', __('No candidate profile linked to your account.'));
            return;
        }

        $template = $this->templates->firstWhere('id', $templateId);

        if (! $template) {
            $this->addError('templateId', __('Invalid template selection.'));
            return;
        }

        $this->candidate->update(['template_id' => $templateId]);
        $this->templateId = $templateId;

        $this->dispatch('template-selected', templateId: $templateId);
        $this->dispatch('banner-message', message: __('Template updated successfully.'));
    }

    public function render()
    {
        return view('livewire.candidate.template-selector', [
            'templates' => $this->templates,
            'currentTemplateId' => $this->templateId,
        ]);
    }
}
