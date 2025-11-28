'use client';

import Image from 'next/image';
import { QrCode, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { generateQrCodeUrl, getDonationUrl } from '@/lib/utils/qr-code';

/**
 * QR Code Display Component
 * Displays a QR code for donation with download option
 */
export function QrCodeDisplay({ candidateSlug, candidateName, size = 300 }) {
  const donationUrl = getDonationUrl(candidateSlug);
  const qrCodeUrl = generateQrCodeUrl(donationUrl, size);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `donation-qr-${candidateSlug}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!candidateSlug) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <QrCode className="size-12 mx-auto mb-2 opacity-50" />
          <p>No candidate selected</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6 flex flex-col items-center gap-4">
        <div className="border border-dashed border-border rounded-2xl p-4 bg-muted/60">
          <Image
            src={qrCodeUrl}
            alt={`Donation QR code for ${candidateName || candidateSlug}`}
            width={size}
            height={size}
            className="rounded-md bg-white"
          />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-medium">Scan to Donate</p>
          {candidateName && (
            <p className="text-xs text-muted-foreground">{candidateName}</p>
          )}
          <p className="text-xs text-muted-foreground break-all max-w-xs">
            {donationUrl}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="size-4 mr-2" />
          Download QR Code
        </Button>
      </CardContent>
    </Card>
  );
}

