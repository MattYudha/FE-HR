import dynamic from 'next/dynamic';
import { Loader } from '@/components/shared/Loader';

const AuthGuard = dynamic(() => import('@/components/shared/AuthGuard'), {
  ssr: false,
  loading: () => <Loader />,
});

const KPIPageContent = dynamic(() => import('./content'), {
  ssr: false,
  loading: () => <Loader />,
});

export default function KPIPage() {
  return (
    <AuthGuard allowedRoles={['admin']}>
      <KPIPageContent />
    </AuthGuard>
  );
}