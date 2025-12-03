'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

export default function CandidateSelectPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);

  useEffect(() => {
    if (!authLoading && user) {
      fetchCandidates();
    }
  }, [authLoading, user]);

  useEffect(() => {
    // Check if there's a stored candidate selection
    const storedCandidateId = localStorage.getItem('selected_candidate_id');
    if (storedCandidateId) {
      setSelectedCandidateId(parseInt(storedCandidateId));
    }
  }, []);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const response = await api.get('/candidates/my-candidates');
      const candidatesData = response.data.data || [];
      
      // If user has candidates from the many-to-many relationship
      if (candidatesData.length > 0) {
        setCandidates(candidatesData);
        
        // If only one candidate, auto-select and redirect
        if (candidatesData.length === 1) {
          const candidate = candidatesData[0];
          selectCandidate(candidate);
          return;
        }
        
        // Check if there's a stored selection that matches
        const storedCandidateId = localStorage.getItem('selected_candidate_id');
        if (storedCandidateId) {
          const storedCandidate = candidatesData.find(
            (c) => c.id === parseInt(storedCandidateId)
          );
          if (storedCandidate) {
            selectCandidate(storedCandidate);
            return;
          }
        }
      } else {
        // Fallback: check if user has a single candidate_id (backward compatibility)
        if (user?.candidate) {
          setCandidates([user.candidate]);
          selectCandidate(user.candidate);
          return;
        }
      }
    } catch (error) {
      console.error('Failed to fetch candidates:', error);
      toast.error('Failed to load candidates');
    } finally {
      setLoading(false);
    }
  };

  const selectCandidate = (candidate) => {
    // Store in localStorage
    localStorage.setItem('selected_candidate_id', candidate.id.toString());
    localStorage.setItem('selected_candidate', JSON.stringify(candidate));
    
    // Redirect to candidate dashboard
    router.push('/candidate/dashboard');
  };

  const handleSelect = (candidate) => {
    selectCandidate(candidate);
  };

  if (authLoading || loading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>No Candidates Assigned</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You don't have any candidates assigned to your account. Please contact an administrator.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="size-5" />
            Select Candidate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              You have access to multiple candidates. Please select which candidate you want to manage.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {candidates.map((candidate) => {
                const isSelected = selectedCandidateId === candidate.id;
                return (
                  <div
                    key={candidate.id}
                    onClick={() => handleSelect(candidate)}
                    className={cn(
                      'relative border-2 rounded-lg p-4 cursor-pointer transition-all',
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <div className="bg-primary text-primary-foreground rounded-full p-1">
                          <Check className="size-4" />
                        </div>
                      </div>
                    )}
                    {candidate.image ? (
                      <img
                        src={candidate.image}
                        alt={candidate.name}
                        className="w-full h-32 object-cover rounded-md mb-3"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-32 bg-muted rounded-md mb-3 flex items-center justify-center">
                        <User className="size-12 text-muted-foreground" />
                      </div>
                    )}
                    <h3 className="font-semibold text-sm mb-1">{candidate.name}</h3>
                    {candidate.name_bn && (
                      <p className="text-xs text-muted-foreground mb-2">{candidate.name_bn}</p>
                    )}
                    {candidate.party && (
                      <p className="text-xs text-muted-foreground">
                        {candidate.party.name}
                      </p>
                    )}
                    {candidate.constituency && (
                      <p className="text-xs text-muted-foreground">
                        {candidate.constituency.name}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {selectedCandidateId && (
              <div className="flex justify-end pt-4 border-t">
                <Button onClick={() => {
                  const candidate = candidates.find(c => c.id === selectedCandidateId);
                  if (candidate) {
                    selectCandidate(candidate);
                  }
                }}>
                  Continue
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

