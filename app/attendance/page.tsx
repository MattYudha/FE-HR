import dynamic from 'next/dynamic';
import { Loader } from '@/components/shared/Loader';

const AuthGuard = dynamic(() => import('@/components/shared/AuthGuard'), {
  ssr: false,
  loading: () => <Loader />,
});

const AttendancePageContent = dynamic(() => import('./content'), {
  ssr: false,
  loading: () => <Loader />,
});

export default function AttendancePage() {
  return (
    <AuthGuard allowedRoles={['admin', 'employee']}>
      <AttendancePageContent />
    </AuthGuard>
  );
}