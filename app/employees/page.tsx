import { type Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Loader } from '@/components/shared/Loader';

const AuthGuard = dynamic(() => import('@/components/shared/AuthGuard'), {
  ssr: false,
  loading: () => <Loader />,
});

const EmployeesPageContent = dynamic(() => import('./content'), {
  ssr: false,
  loading: () => <Loader />,
});

export const metadata: Metadata = {
  title: 'Employees Management',
};

export default function EmployeesPage() {
  return (
    <AuthGuard allowedRoles={['admin']}>
      <EmployeesPageContent />
    </AuthGuard>
  );
}
