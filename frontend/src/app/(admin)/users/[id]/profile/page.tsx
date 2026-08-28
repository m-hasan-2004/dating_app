'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import FullProfileView from '@/components/profile/FullProfileView';

export default function UserProfilePage() {
  const params = useParams();
  const userId = params?.id as string;

  return <FullProfileView userId={userId} backUrl="/users" />;
}