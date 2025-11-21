<?php

namespace App\Livewire\Tenant;

use App\Models\KnowledgeEntry;
use Livewire\Component;

class ChatbotWidget extends Component
{
    public string $query = '';
    public array $messages = [];
    public bool $isOpen = false;

    public function mount(): void
    {
        $this->messages[] = [
            'type' => 'bot',
            'text' => __('Hello! I can help answer questions about the candidate, voting locations, dates, and more. Ask me anything!', [], 'en'),
        ];
    }

    public function ask(): void
    {
        if (empty(trim($this->query))) {
            return;
        }

        $this->messages[] = [
            'type' => 'user',
            'text' => $this->query,
        ];

        // Search knowledge base for matching answers
        $answer = $this->findAnswer($this->query);
        
        $this->messages[] = [
            'type' => 'bot',
            'text' => $answer,
        ];

        $this->query = '';
    }

    protected function findAnswer(string $query): string
    {
        $candidateId = $this->getCandidateId();
        
        if (!$candidateId) {
            return __('I apologize, but I cannot find information at this time. Please contact the campaign office directly.', [], 'en');
        }

        $entries = KnowledgeEntry::where('candidate_id', $candidateId)
            ->where('is_active', true)
            ->get();

        $queryLower = strtolower($query);
        
        foreach ($entries as $entry) {
            $questionLower = strtolower($entry->question_en ?? '');
            $keywords = explode(' ', $queryLower);
            
            foreach ($keywords as $keyword) {
                if (strlen($keyword) > 3 && str_contains($questionLower, $keyword)) {
                    return $entry->answer_en ?? $entry->answer_bn ?? __('No answer available.', [], 'en');
                }
            }
        }

        return __('I don\'t have specific information about that. Please contact the campaign office for detailed assistance.', [], 'en');
    }

    protected function getCandidateId(): ?int
    {
        try {
            $tenantId = tenant('id');
            $candidate = \App\Models\Candidate::where('tenant_id', $tenantId)->first();
            return $candidate?->id;
        } catch (\Exception $e) {
            return null;
        }
    }

    public function toggle(): void
    {
        $this->isOpen = !$this->isOpen;
    }

    public function render()
    {
        return view('livewire.tenant.chatbot-widget');
    }
}
