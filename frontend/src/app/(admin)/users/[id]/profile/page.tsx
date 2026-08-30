'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import FullProfileView from '@/components/profile/FullProfileView';

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const userId = params?.id as string;
  const isAdmin = Boolean(user?.is_staff || (user as any)?.is_superuser);

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace(userId ? `/candidates/${userId}` : '/');
    }
  }, [loading, isAdmin, router, userId]);

  if (!isAdmin && !loading) {
    return null;
  }

  return <FullProfileView userId={userId} backUrl="/users" />;
}