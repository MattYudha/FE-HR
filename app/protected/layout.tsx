'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/shared/MainLayout';
import useAuthStore from '@/src/stores/authStore';
import GlobalLoadingOverlay from '@/components/shared/GlobalLoadingOverlay';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { token, user } = useAuthStore();

  useEffect(() => {
    // If the token is not present and the user data is not loaded, redirect to login.
    // This check runs on the client-side.
    if (!token || !user) {
      router.push('/login');
    }
  }, [token, user, router]);

  // Render nothing or a loading spinner while the check is performed
  if (!token || !user) {
    return <GlobalLoadingOverlay />;
  }

  // If authenticated, render the main layout with the page content
  return <MainLayout>{children}</MainLayout>;
}
