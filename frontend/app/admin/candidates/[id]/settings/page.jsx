'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function SettingsIndexPage() {
  const params = useParams();
  const router = useRouter();
  const candidateId = params.id;

  useEffect(() => {
    // Redirect to profile settings by default
    router.replace(`/admin/candidates/${candidateId}/settings/profile`);
  }, [candidateId, router]);

  return null;
}
