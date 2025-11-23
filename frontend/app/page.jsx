'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Check if user is super-admin
        const userRoles = user?.abilities || user?.roles?.map((r) => r.slug || r.name) || [];
        if (userRoles.includes('super-admin')) {
          router.push('/admin/dashboard');
        } else {
          router.push('/dashboard');
        }
      } else {
        router.push('/auth/login');
      }
    }
  }, [user, loading, router]);

  return null;
}
