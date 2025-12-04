'use client';

import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Loader } from './Loader';

export default function GlobalLoadingOverlay() {
  const { isLoading } = useAuth();

  if (!isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Loader />
    </div>
  );
}