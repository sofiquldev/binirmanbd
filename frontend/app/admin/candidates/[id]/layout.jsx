'use client';

import { Fragment, useEffect, useMemo } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { useCandidatesStore } from '@/stores/use-candidates-store';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ExternalLink,
  ArrowLeft,
  MapPin,
  Users,
  Mail,
  Settings,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';

// UserHero Component
function UserHero({ image, name, info }) {
  const { theme } = useTheme();

  const buildInfo = (info) => {
    return info.map((item, index) => {
      return (
        <div className="flex gap-1.25 items-center" key={`info-${index}`}>
          {item.icon && (
            <item.icon size={16} className="text-muted-foreground text-sm" />
          )}
          {item.email ? (
            <Link
              href={`mailto:${item.email}`}
              className="text-secondary-foreground font-medium hover:text-primary"
            >
              {item.email}
            </Link>
          ) : (
            <span className="text-secondary-foreground font-medium">
              {item.label}
            </span>
          )}
        </div>
      );
    });
  };

  return (
    <div
      className="bg-center bg-cover bg-no-repeat"
      style={{
        backgroundImage:
          theme === 'dark'
            ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
            : 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
      }}
    >
      <div className="container">
        <div className="flex flex-col items-center gap-2 lg:gap-3.5 py-4 lg:pt-5 lg:pb-10">
          {image}
          <div className="flex items-center gap-1.5">
            <div className="text-lg leading-5 font-semibold text-mono">
              {name}
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-1 lg:gap-4.5 text-sm">
            {buildInfo(info)}
          </div>
        </div>
      </div>
    </div>
  );
}

// Tab Navigation Component
function TabNavigation({ candidateId, activeTab }) {
  const tabs = [
    { value: 'overview', label: 'Overview', path: `/admin/candidates/${candidateId}` },
    { value: 'feedbacks', label: 'Feedbacks', path: `/admin/candidates/${candidateId}/feedbacks` },
    { value: 'donates', label: 'Donates', path: `/admin/candidates/${candidateId}/donates` },
    { value: 'projects', label: 'Projects', path: `/admin/candidates/${candidateId}/projects` },
    { value: 'events', label: 'Events', path: `/admin/candidates/${candidateId}/events` },
    { value: 'notices', label: 'Notices', path: `/admin/candidates/${candidateId}/notices` },
    { value: 'photo-gallery', label: 'Photo Gallery', path: `/admin/candidates/${candidateId}/photo-gallery` },
    { value: 'contacts', label: 'Contacts', path: `/admin/candidates/${candidateId}/contacts` },
  ];

  return (
    <div className="w-full border-b border-border mb-5 overflow-auto">
      <nav className="flex gap-8 min-w-max">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <Link
              key={tab.value}
              href={tab.path}
              className={`relative inline-flex items-center py-3 px-1 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-primary border-b-2 border-transparent hover:border-primary/50'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default function CandidateLayout({ children }) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const { candidate, loading, fetchCandidate } = useCandidatesStore();
  const candidateId = params.id;

  useEffect(() => {
    if (candidateId) {
      fetchCandidate(candidateId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidateId]);

  // Determine active tab from pathname
  const activeTab = useMemo(() => {
    if (pathname.endsWith('/feedbacks')) return 'feedbacks';
    if (pathname.endsWith('/donates')) return 'donates';
    if (pathname.endsWith('/projects')) return 'projects';
    if (pathname.endsWith('/events')) return 'events';
    if (pathname.endsWith('/notices')) return 'notices';
    if (pathname.endsWith('/photo-gallery')) return 'photo-gallery';
    if (pathname.endsWith('/contacts')) return 'contacts';
    return 'overview';
  }, [pathname]);

  // Get landing page URL
  const getLandingPageUrl = () => {
    if (!candidate?.slug) return '#';
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://binirman.test/api/v1';
    const baseUrl = apiUrl.replace('/api/v1', '');
    return `${baseUrl}/c/${candidate.slug}`;
  };

  if (loading && !candidate) {
    return (
      <div className="container">
        <div className="grid gap-5 lg:gap-7.5">
          <Skeleton className="h-32" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="container">
        <div className="grid gap-5 lg:gap-7.5">
          <div className="text-center py-12">
            <p className="text-secondary-foreground">Candidate not found</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.push('/admin/candidates')}
            >
              <ArrowLeft className="size-4 me-2" />
              Back to Candidates
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Build hero image
  const image = candidate.image ? (
    <img
      src={candidate.image}
      alt={candidate.name}
      className="rounded-full border-3 border-green-500 size-[100px] shrink-0 object-cover"
    />
  ) : (
    <div className="flex items-center justify-center rounded-full border-3 border-green-500 size-[100px] shrink-0 bg-accent/60">
      <span className="text-3xl font-semibold text-muted-foreground">
        {candidate.name?.charAt(0) || 'C'}
      </span>
    </div>
  );

  // Build hero info
  const heroInfo = [
    candidate?.party && { label: candidate.party.name, icon: Users },
    candidate?.constituency && {
      label: candidate.constituency.name,
      icon: MapPin,
    },
    candidate?.email && { email: candidate.email, icon: Mail },
  ].filter(Boolean);

  return (
    <Fragment>
      <UserHero name={candidate.name} image={image} info={heroInfo} />

      <div className="container">
        <div className="flex flex-wrap items-center justify-between gap-5 pb-7.5 border-b">
          <div className="flex items-center gap-2.5">
            {candidate.name_bn && (
              <span className="text-sm text-secondary-foreground">
                {candidate.name_bn}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2.5">
            {candidate.slug && (
              <Button variant="outline" asChild>
                <a
                  href={getLandingPageUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="size-4 me-2" />
                  Landing Page
                </a>
              </Button>
            )}
            <Button onClick={() => router.push(`/admin/candidates/${candidate.id}/edit`)}>
              <Settings className="size-4 me-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      <div className="container">
        <TabNavigation candidateId={candidateId} activeTab={activeTab} />
        {children}
      </div>
    </Fragment>
  );
}

