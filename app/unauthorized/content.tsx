'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

export default function UnauthorizedPageContent() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <ShieldAlert className="mb-6 h-24 w-24 text-red-500" />
      <h1 className="text-4xl font-bold text-gray-900">Unauthorized Access</h1>
      <p className="mt-4 text-lg text-gray-600">
        You do not have permission to access this page.
      </p>
      <Button className="mt-8" onClick={() => router.push('/dashboard')}>
        Go to Dashboard
      </Button>
    </div>
  );
}
