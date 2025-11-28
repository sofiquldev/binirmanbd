'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, Users, User, ExternalLink } from 'lucide-react';

export function EntityDetailModal({ type, id, open, onOpenChange }) {
  const router = useRouter();
  const [entity, setEntity] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && id) {
      fetchEntity();
    } else {
      setEntity(null);
    }
  }, [open, id, type]);

  const fetchEntity = async () => {
    setLoading(true);
    try {
      let endpoint = '';
      switch (type) {
        case 'candidate':
          endpoint = `/candidates/${id}`;
          break;
        case 'constituency':
          endpoint = `/constituencies/${id}`;
          break;
        case 'party':
          endpoint = `/parties/${id}`;
          break;
        default:
          return;
      }

      const response = await api.get(endpoint);
      setEntity(response.data);
    } catch (error) {
      console.error(`Failed to fetch ${type} details:`, error);
      alert(
        error.response?.data?.message ||
          `Failed to load ${type} details. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 flex-wrap">
            {loading ? (
              <Skeleton className="h-6 w-48" />
            ) : (
              <>
                <span>{entity?.name || `${type} Details`}</span>
                {type === 'candidate' && entity?.id && (
                  <>
                    <span className="text-muted-foreground/50">
                      #{entity.id}
                    </span>
                    <Link
                      href={`/admin/candidates/${entity.id}`}
                      className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center transform translate-y-[-2px]"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenChange(false);
                      }}
                    >
                      <ExternalLink className="size-4" />
                    </Link>
                    
                  </>
                )}
              </>
            )}
          </DialogTitle>
          {entity?.name_bn && (
            <DialogDescription>{entity.name_bn}</DialogDescription>
          )}
        </DialogHeader>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : entity ? (
          <div className="space-y-4">
            {/* Candidate Details */}
            {type === 'candidate' && (
              <>
                {entity.party && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="size-4 text-muted-foreground" />
                    <span className="font-semibold">Party: </span>
                    <button
                      type="button"
                      className="text-primary hover:underline cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenChange(false);
                        // Navigate to candidates page with party filter
                        router.push(`/admin/candidates?party_id=${entity.party.id}`);
                      }}
                    >
                      {entity.party.name}
                      {entity.party.name_bn && ` (${entity.party.name_bn})`}
                    </button>
                  </div>
                )}
                {entity.constituency && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="size-4 text-muted-foreground" />
                    <span className="font-semibold">Constituency: </span>
                    <button
                      type="button"
                      className="text-primary hover:underline cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenChange(false);
                        // Navigate to candidates page with constituency filter
                        router.push(`/admin/candidates?constituency_id=${entity.constituency.id}`);
                      }}
                    >
                      {entity.constituency.name}
                      {entity.constituency.name_bn &&
                        ` (${entity.constituency.name_bn})`}
                    </button>
                  </div>
                )}
                {entity.email && (
                  <div className="text-sm">
                    <span className="font-semibold">Email: </span>
                    <a
                      href={`mailto:${entity.email}`}
                      className="text-primary hover:underline"
                    >
                      {entity.email}
                    </a>
                  </div>
                )}
                {entity.about && (
                  <div>
                    <h3 className="text-sm font-semibold mb-1">About</h3>
                    <p className="text-sm text-secondary-foreground whitespace-pre-line">
                      {entity.about}
                    </p>
                  </div>
                )}
                {entity.about_bn && (
                  <div>
                    <h3 className="text-sm font-semibold mb-1">About (Bangla)</h3>
                    <p className="text-sm text-secondary-foreground whitespace-pre-line">
                      {entity.about_bn}
                    </p>
                  </div>
                )}
                {entity.history && (
                  <div>
                    <h3 className="text-sm font-semibold mb-1">History</h3>
                    <p className="text-sm text-secondary-foreground whitespace-pre-line">
                      {entity.history}
                    </p>
                  </div>
                )}
                {entity.campaign_slogan && (
                  <div>
                    <h3 className="text-sm font-semibold mb-1">
                      Campaign Slogan
                    </h3>
                    <p className="text-sm text-secondary-foreground italic">
                      "{entity.campaign_slogan}"
                    </p>
                  </div>
                )}
                {entity.campaign_goals && (
                  <div>
                    <h3 className="text-sm font-semibold mb-1">Campaign Goals</h3>
                    <p className="text-sm text-secondary-foreground whitespace-pre-line">
                      {entity.campaign_goals}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Constituency Details */}
            {type === 'constituency' && (
              <>
                {entity.district && (
                  <div className="text-sm">
                    <span className="font-semibold">District: </span>
                    <span>{entity.district.name}</span>
                    {entity.district.name_bn && (
                      <span className="text-secondary-foreground">
                        {' '}
                        ({entity.district.name_bn})
                      </span>
                    )}
                  </div>
                )}
                {entity.population && (
                  <div className="text-sm">
                    <span className="font-semibold">Population: </span>
                    <span>{entity.population.toLocaleString()}</span>
                  </div>
                )}
                {entity.about && (
                  <div>
                    <h3 className="text-sm font-semibold mb-1">About</h3>
                    <p className="text-sm text-secondary-foreground whitespace-pre-line">
                      {entity.about}
                    </p>
                  </div>
                )}
                {Array.isArray(entity.candidates) &&
                  entity.candidates.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold mb-2">
                        Candidates ({entity.candidates.length})
                      </h3>
                      <div className="space-y-1">
                        {entity.candidates.map((candidate) => (
                          <div
                            key={candidate.id}
                            className="flex items-center justify-between text-sm border-b border-border/60 py-1.5"
                          >
                            <div>
                              <div className="font-medium">
                                {candidate.name || 'Unnamed candidate'}
                              </div>
                              {candidate.slug && (
                                <div className="text-xs text-secondary-foreground">
                                  {candidate.slug}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </>
            )}

            {/* Party Details */}
            {type === 'party' && (
              <>
                {entity.about && (
                  <div>
                    <h3 className="text-sm font-semibold mb-1">About</h3>
                    <p className="text-sm text-secondary-foreground whitespace-pre-line">
                      {entity.about}
                    </p>
                  </div>
                )}
                {Array.isArray(entity.candidates) &&
                  entity.candidates.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold mb-2">
                        Candidates ({entity.candidates.length})
                      </h3>
                      <div className="space-y-1">
                        {entity.candidates.map((candidate) => (
                          <div
                            key={candidate.id}
                            className="flex items-center justify-between text-sm border-b border-border/60 py-1.5"
                          >
                            <div>
                              <div className="font-medium">
                                {candidate.name || 'Unnamed candidate'}
                              </div>
                              {candidate.slug && (
                                <div className="text-xs text-secondary-foreground">
                                  {candidate.slug}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </>
            )}

            {!entity.about &&
              (!entity.candidates || entity.candidates.length === 0) &&
              type !== 'candidate' && (
                <p className="text-sm text-muted-foreground">
                  No additional information available for this {type} yet.
                </p>
              )}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            No {type} selected
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

