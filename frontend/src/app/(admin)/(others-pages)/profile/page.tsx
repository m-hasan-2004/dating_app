'use client';

import React from 'react';
import FullProfileView from '@/components/profile/FullProfileView';
import WelcomeGuideModal from '@/components/onboarding/WelcomeGuideModal';

export default function Profile() {
  return (
    <>
      <FullProfileView />
      <WelcomeGuideModal />
    </>
  );
}