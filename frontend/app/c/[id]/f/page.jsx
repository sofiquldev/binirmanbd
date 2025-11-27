'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import api from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_URL || 'http://binirman.test';
};

export default function CandidateFeedbackQrPage() {
  const params = useParams();
  const id = params?.id;
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchCandidate = async () => {
      try {
        // Public candidate info (limited fields). If you create a dedicated
        // public endpoint, change this URL to `/public/candidates/${id}`.
        const res = await api.get(`/candidates/${id}`);
        setCandidate(res.data);
      } catch (e) {
        console.error('Failed to load candidate:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id]);

  const baseUrl = getBaseUrl();
  const feedbackUrl = `${baseUrl}/c/${id}/feedback`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
    feedbackUrl,
  )}`;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted">
        <div className="w-full max-w-xl px-4">
          <Skeleton className="h-40 w-full mb-6" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted px-4 py-10">
      <div className="w-full max-w-xl space-y-6">
        {/* Banner with candidate image */}
        <Card className="overflow-hidden border-none shadow-lg shadow-black/5">
          <div className="relative h-40 w-full bg-gradient-to-r from-primary/80 to-primary">
            {candidate?.image && (
              <Image
                src={candidate.image}
                alt={candidate.name || 'Candidate'}
                fill
                className="object-cover opacity-80"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-background/40 to-background/10" />
            <div className="relative z-10 h-full flex flex-col justify-center px-6">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                Feedback Form
              </p>
              <h1 className="text-2xl font-semibold text-mono">
                {candidate?.name || 'Candidate'}
              </h1>
              {candidate?.party?.name && (
                <p className="text-xs text-secondary-foreground mt-1">
                  {candidate.party.name}
                  {candidate?.constituency?.name
                    ? ` • ${candidate.constituency.name}`
                    : ''}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* QR + instructions */}
        <Card className="shadow-sm">
          <CardContent className="py-6 flex flex-col items-center gap-4">
            <div className="border border-dashed border-border rounded-2xl p-4 bg-muted/60">
              <Image
                src={qrSrc}
                alt="Feedback QR code"
                width={260}
                height={260}
                className="rounded-md bg-white"
              />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-medium text-mono">
                Scan this QR to give feedback
              </p>
              <p className="text-xs text-muted-foreground break-all">
                {feedbackUrl}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


