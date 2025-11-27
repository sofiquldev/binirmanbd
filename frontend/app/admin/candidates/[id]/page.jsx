'use client';

import { Fragment, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useCandidatesStore } from '@/stores/use-candidates-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { MessageSquare, QrCode, Globe } from 'lucide-react';
import Link from 'next/link';

// Statistics Component
function Statistics({ items }) {
  return (
    <Card>
      <CardContent>
        <div className="flex lg:px-10 py-1.5 gap-2">
          {items.map((item, index) => (
            <Fragment key={index}>
              <div className="grid grid-cols-1 place-content-center flex-1 gap-1 text-center">
                <span className="text-mono text-2xl lg:text-2xl leading-none font-semibold">
                  {item.number}
                </span>
                <span className="text-secondary-foreground text-sm">
                  {item.label}
                </span>
              </div>
              {index < items.length - 1 && (
                <span className="not-last:border-e border-e-input my-1"></span>
              )}
            </Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Highlights Component
function Highlights({ candidate }) {
  const items = [
    candidate?.party && {
      label: 'Party:',
      info: candidate.party.name,
    },
    candidate?.constituency && {
      label: 'Constituency:',
      info: candidate.constituency.name,
    },
    candidate?.constituency?.district && {
      label: 'District:',
      info: candidate.constituency.district.name_bn || candidate.constituency.district.name,
    },
    candidate?.slug && {
      label: 'Slug:',
      info: candidate.slug,
    },
    candidate?.whatsapp_number && {
      label: 'WhatsApp:',
      info: candidate.whatsapp_number,
    },
    candidate?.template && {
      label: 'Template:',
      info: candidate.template.name || `Template ${candidate.template.id}`,
    },
  ].filter(Boolean);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Highlights</CardTitle>
      </CardHeader>
      <CardContent className="pt-3.5 pb-3.5">
        <Table>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index} className="border-0">
                <TableCell className="text-sm text-secondary-foreground pb-3 pe-4 lg:pe-10 py-2">
                  {item.label}
                </TableCell>
                <TableCell className="text-sm text-mono pb-3 py-2">
                  {item.info}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// Candidate Profile Component
function CandidateProfile({ candidate, getLandingPageUrl, getFeedbackQrUrl }) {
  const rows = [
    candidate?.slug && {
      icon: Globe,
      text: getLandingPageUrl(),
      info: true,
      label: 'Landing Page',
    },
    candidate?.slug && {
      icon: QrCode,
      text: getFeedbackQrUrl(),
      info: true,
      label: 'Feedback QR',
    },
    candidate?.whatsapp_number && {
      icon: MessageSquare,
      text: candidate.whatsapp_number,
      info: false,
      label: 'WhatsApp',
    },
    candidate?.primary_domain && {
      icon: Globe,
      text: candidate.primary_domain,
      info: false,
      label: 'Primary Domain',
    },
  ].filter(Boolean);

  const renderRows = (row, index) => {
    return (
      <div key={index} className="flex items-center gap-2.5">
        <span>
          <row.icon className="text-lg text-muted-foreground" size={18} />
        </span>
        {row.info ? (
          <Link
            href={row.text}
            target="_blank"
            rel="noopener noreferrer"
            className="link text-sm font-medium"
          >
            {row.text}
          </Link>
        ) : (
          <span className="text-sm text-mono">{row.text}</span>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Candidate Profile</CardTitle>
      </CardHeader>
      <CardContent>
        {candidate?.about && (
          <div className="grid gap-2.5 mb-7">
            <div className="text-base font-semibold text-mono">About</div>
            <p className="text-sm text-foreground leading-5.5 whitespace-pre-line">
              {candidate.about}
            </p>
          </div>
        )}

        {rows.length > 0 && (
          <div className="flex flex-col gap-2.5 mb-7">
            {rows.map((row, index) => renderRows(row, index))}
          </div>
        )}

        {candidate?.history && (
          <div className="grid gap-2.5 mb-7">
            <div className="text-base font-semibold text-mono">History</div>
            <p className="text-sm text-foreground leading-5.5 whitespace-pre-line">
              {candidate.history}
            </p>
          </div>
        )}

        {candidate?.campaign_goals && (
          <div className="flex flex-col gap-4 mb-2.5">
            <div className="text-base font-semibold text-mono">Campaign Goals</div>
            <p className="text-sm text-foreground leading-5.5 whitespace-pre-line">
              {candidate.campaign_goals}
            </p>
          </div>
        )}

        {candidate?.campaign_slogan && (
          <div className="flex flex-col gap-4 mt-4">
            <div className="text-base font-semibold text-mono">Campaign Slogan</div>
            <p className="text-sm text-foreground italic leading-5.5">
              "{candidate.campaign_slogan}"
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Additional Details Component
function AdditionalDetails({ candidate, getFeedbackQrUrl }) {
  const items = [
    candidate?.primary_domain && {
      label: 'Primary Domain',
      value: candidate.primary_domain,
    },
    candidate?.custom_domain && {
      label: 'Custom Domain',
      value: candidate.custom_domain,
    },
    candidate?.template && {
      label: 'Template',
      value: candidate.template.name || `Template ${candidate.template.id}`,
    },
    candidate?.slug && {
      label: 'Feedback QR URL',
      value: getFeedbackQrUrl(),
      link: true,
    },
  ].filter(Boolean);

  if (items.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Details</CardTitle>
      </CardHeader>
      <CardContent className="kt-scrollable-x-auto pb-3 p-0">
        <Table className="align-middle text-sm text-muted-foreground">
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="py-2 min-w-36 text-secondary-foreground font-normal">
                  {item.label}
                </TableCell>
                <TableCell className="py-2 text-secondary-foreground text-sm font-normal">
                  {item.link ? (
                    <Link
                      href={item.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {item.value}
                    </Link>
                  ) : (
                    item.value
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// Overview Page Component
export default function CandidateOverviewPage() {
  const params = useParams();
  const { candidate } = useCandidatesStore();
  const candidateId = params.id;

  // Get landing page URL
  const getLandingPageUrl = () => {
    if (!candidate?.slug) return '#';
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://binirman.test/api/v1';
    const baseUrl = apiUrl.replace('/api/v1', '');
    return `${baseUrl}/c/${candidate.slug}`;
  };

  // Get feedback QR code URL
  const getFeedbackQrUrl = () => {
    if (!candidate?.slug) return '#';
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://binirman.test/api/v1';
    const baseUrl = apiUrl.replace('/api/v1', '');
    return `${baseUrl}/c/${candidate.slug}/feedback`;
  };

  if (!candidate) {
    return null;
  }

  // Build statistics
  const statsItems = [
    {
      number: Array.isArray(candidate.donations) ? candidate.donations.length : 0,
      label: 'Donations',
    },
    {
      number: Array.isArray(candidate.events) ? candidate.events.length : 0,
      label: 'Events',
    },
    {
      number: Array.isArray(candidate.contactMessages)
        ? candidate.contactMessages.length
        : 0,
      label: 'Messages',
    },
    {
      number: candidate.feedback_count || 0,
      label: 'Feedback',
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-7.5">
      {/* Statistics - Full Width */}
      <div className="col-span-1 lg:col-span-3">
        <Statistics items={statsItems} />
      </div>

      {/* Left Column */}
      <div className="col-span-1">
        <div className="flex flex-col gap-5 lg:gap-7.5">
          <Highlights candidate={candidate} />
          <AdditionalDetails
            candidate={candidate}
            getFeedbackQrUrl={getFeedbackQrUrl}
          />
        </div>
      </div>

      {/* Right Column */}
      <div className="col-span-1 lg:col-span-2">
        <div className="flex flex-col gap-5 lg:gap-7.5">
          <CandidateProfile
            candidate={candidate}
            getLandingPageUrl={getLandingPageUrl}
            getFeedbackQrUrl={getFeedbackQrUrl}
          />
        </div>
      </div>
    </div>
  );
}
