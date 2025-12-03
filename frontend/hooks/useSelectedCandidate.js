'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';

/**
 * Hook to get the currently selected candidate from localStorage
 * Falls back to user's single candidate if available
 */
export function useSelectedCandidate() {
  const { user, loading: authLoading } = useAuth();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    const loadCandidate = async () => {
      try {
        // First, try to get from localStorage
        const storedCandidateId = localStorage.getItem('selected_candidate_id');
        const storedCandidate = localStorage.getItem('selected_candidate');

        if (storedCandidateId && storedCandidate) {
          try {
            const parsed = JSON.parse(storedCandidate);
            // Verify the candidate still exists and user has access
            const response = await api.get('/candidates/my-candidates');
            const userCandidates = response.data.data || [];
            
            // Include single candidate_id if available (backward compatibility)
            const allCandidates = userCandidates;
            if (user?.candidate && !allCandidates.find(c => c.id === user.candidate.id)) {
              allCandidates.push(user.candidate);
            }

            const foundCandidate = allCandidates.find(c => c.id === parseInt(storedCandidateId));
            
            if (foundCandidate) {
              setCandidate(foundCandidate);
              setLoading(false);
              return;
            }
          } catch (e) {
            // Invalid stored data, continue to fetch
          }
        }

        // If no stored candidate or invalid, fetch user's candidates
        const response = await api.get('/candidates/my-candidates');
        const candidates = response.data.data || [];
        
        // Include single candidate_id if available (backward compatibility)
        let allCandidates = candidates;
        if (user?.candidate && !allCandidates.find(c => c.id === user.candidate.id)) {
          allCandidates = [...candidates, user.candidate];
        }

        // Remove duplicates
        allCandidates = allCandidates.filter((c, index, self) => 
          index === self.findIndex((t) => t.id === c.id)
        );

        if (allCandidates.length === 1) {
          // Auto-select if only one candidate
          const singleCandidate = allCandidates[0];
          localStorage.setItem('selected_candidate_id', singleCandidate.id.toString());
          localStorage.setItem('selected_candidate', JSON.stringify(singleCandidate));
          setCandidate(singleCandidate);
        } else if (allCandidates.length > 1) {
          // Multiple candidates - use stored or first one
          if (storedCandidateId) {
            const found = allCandidates.find(c => c.id === parseInt(storedCandidateId));
            if (found) {
              setCandidate(found);
            } else {
              // Stored candidate no longer valid, clear it
              localStorage.removeItem('selected_candidate_id');
              localStorage.removeItem('selected_candidate');
              setCandidate(null);
            }
          } else {
            setCandidate(null);
          }
        } else {
          setCandidate(null);
        }
      } catch (error) {
        console.error('Failed to load candidate:', error);
        setCandidate(null);
      } finally {
        setLoading(false);
      }
    };

    loadCandidate();
  }, [authLoading, user]);

  return { candidate, loading };
}

