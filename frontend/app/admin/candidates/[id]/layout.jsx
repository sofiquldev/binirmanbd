'use client';

import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import {
  ExternalLink,
  ArrowLeft,
  MapPin,
  Users,
  Mail,
  Settings,
  ChevronDown,
} from 'lucide-react';

import { useCandidatesStore } from '@/stores/use-candidates-store';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useOverflowMenu } from '@/hooks/use-overflow-menu';

// UserHero Component
function UserHero({
  image,
  name,
  info,
  candidateId,
  activeTab,
  candidate,
  router,
}) {
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
        <TabNavigation
          candidateId={candidateId}
          activeTab={activeTab}
          candidate={candidate}
          router={router}
        />
      </div>
    </div>
  );
}

// Tab Navigation Component
function TabNavigation({ candidateId, activeTab, candidate, router }) {
  const tabs = useMemo(
    () => [
      {
        value: 'overview',
        label: 'Overview',
        path: `/admin/candidates/${candidateId}`,
      },
      {
        value: 'manifesto',
        label: 'Manifesto',
        path: `/admin/candidates/${candidateId}/manifesto`,
      },
      {
        value: 'feedbacks',
        label: 'Feedbacks',
        path: `/admin/candidates/${candidateId}/feedbacks`,
      },
      {
        value: 'donates',
        label: 'Donates',
        path: `/admin/candidates/${candidateId}/donates`,
      },
      /* {
        value: 'projects',
        label: 'Projects',
        path: `/admin/candidates/${candidateId}/projects`,
      },
      {
        value: 'events',
        label: 'Events',
        path: `/admin/candidates/${candidateId}/events`,
      },
      {
        value: 'notices',
        label: 'Notices',
        path: `/admin/candidates/${candidateId}/notices`,
      },
      {
        value: 'photo-gallery',
        label: 'Photo Gallery',
        path: `/admin/candidates/${candidateId}/photo-gallery`,
      },
      {
        value: 'contacts',
        label: 'Contacts',
        path: `/admin/candidates/${candidateId}/contacts`,
      }, */
    ],
    [candidateId]
  );

  const navRef = useRef(null);
  const tabsRef = useRef(null);
  const moreButtonRef = useRef(null);

  // Use the reusable overflow menu hook
  const { visibleItems: visibleTabs, hiddenItems: hiddenTabs, isMoreOpen, setIsMoreOpen } = useOverflowMenu(tabs, {
    containerRef: navRef,
    itemsRef: tabsRef,
    moreButtonRef: moreButtonRef,
    actionButtonsSelector: '.action-buttons',
    gap: 32, // gap-8 = 2rem = 32px
    padding: 16,
    moreButtonReserveWidth: 80,
  });

  const getLandingPageUrl = () => {
    if (!candidate?.slug) return '#';
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || 'http://binirman.test/api/v1';
    const baseUrl = apiUrl.replace('/api/v1', '');
    return `${baseUrl}/c/${candidate.slug}`;
  };

  const renderTab = (tab, isInDropdown = false) => {
    const isActive = activeTab === tab.value;
    const className = isInDropdown
      ? `w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors ${
          isActive
            ? 'bg-accent text-primary font-medium'
            : 'text-muted-foreground hover:bg-accent hover:text-foreground'
        }`
      : `relative inline-flex items-center py-3 px-1 text-sm font-medium transition-all duration-200 ${
          isActive
            ? 'text-primary border-b-2 border-primary'
            : 'text-muted-foreground hover:text-primary border-b-2 border-transparent hover:border-primary/50'
        }`;

    if (isInDropdown) {
      return (
        <DropdownMenuItem key={tab.value} asChild>
          <Link href={tab.path} className={className}>
            {tab.label}
          </Link>
        </DropdownMenuItem>
      );
    }

    return (
      <Link
        key={tab.value}
        href={tab.path}
        className={className}
        aria-current={isActive ? 'page' : undefined}
      >
        {tab.label}
      </Link>
    );
  };

  return (
    <div className="w-full border-b border-border mb-5">
      <nav
        ref={navRef}
        className="flex items-center gap-8 overflow-hidden relative"
        role="navigation"
        aria-label="Candidate navigation tabs"
      >
        {/* Hidden measurement container - always render all tabs for width calculation */}
        <div
          className="absolute opacity-0 pointer-events-none -z-10 invisible"
          aria-hidden="true"
          data-measurement="true"
        >
          <div className="flex gap-8">
            {tabs.map((tab) => (
              <div
                key={`measure-${tab.value}`}
                className="inline-flex items-center py-3 px-1 text-sm font-medium"
              >
                {tab.label}
              </div>
            ))}
          </div>
        </div>

        {/* Visible tabs container */}
        <div ref={tabsRef} className="flex gap-8 min-w-max">
          {visibleTabs.map((tab) => renderTab(tab))}
        </div>

        {/* More dropdown for hidden tabs */}
        {hiddenTabs.length > 0 && (
          <DropdownMenu open={isMoreOpen} onOpenChange={setIsMoreOpen}>
            <DropdownMenuTrigger asChild>
              <button
                ref={moreButtonRef}
                className="relative inline-flex items-center py-3 px-1 text-sm font-medium transition-all duration-200 text-muted-foreground hover:text-primary border-b-2 border-transparent focus:outline-none rounded-sm"
                aria-label="More navigation options"
                aria-haspopup="true"
                aria-expanded={isMoreOpen}
              >
                More
                <ChevronDown className="ml-1 size-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[150px]">
              {hiddenTabs.map((tab) => renderTab(tab, true))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-2.5 ml-auto action-buttons shrink-0">
          {candidate?.slug && (
            <Button
              variant="outline"
              asChild
              className="max-md:px-2 max-md:[&>a>span]:hidden"
              aria-label="View landing page"
            >
              <a
                href={getLandingPageUrl()}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="size-4 max-md:me-0 me-2" />
                <span className="max-md:hidden">Landing Page</span>
              </a>
            </Button>
          )}
          <Button
            onClick={() => router.push(`/admin/candidates/${candidate.id}/edit`)}
            className="max-md:px-2 max-md:[&>span]:hidden"
            aria-label="Edit candidate settings"
          >
            <Settings className="size-4 max-md:me-0 me-2" />
            <span className="max-md:hidden">Settings</span>
          </Button>
        </div>
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
    if (pathname.endsWith('/manifesto')) return 'manifesto';
    return 'overview';
  }, [pathname]);

  // Loading state
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

  // Not found state
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
      <UserHero
        name={candidate.name}
        image={image}
        info={heroInfo}
        candidateId={candidateId}
        activeTab={activeTab}
        candidate={candidate}
        router={router}
      />
      <div className="container">{children}</div>
    </Fragment>
  );
}
