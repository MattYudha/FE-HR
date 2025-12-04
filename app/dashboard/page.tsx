import { type Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Loader } from '@/components/shared/Loader';

const AuthGuard = dynamic(() => import('@/components/shared/AuthGuard'), {
  ssr: false,
  loading: () => <Loader />,
});

const DashboardPageContent = dynamic(() => import('./content'), {
  ssr: false,
  loading: () => <Loader />,
});

export const metadata: Metadata = {
  title: 'Dashboard Overview',
};

export default function DashboardPage() {
  return (
    <AuthGuard allowedRoles={['admin']}>
      <DashboardPageContent />
    </AuthGuard>
  );
}
