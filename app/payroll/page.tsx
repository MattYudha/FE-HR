import { type Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Loader } from '@/components/shared/Loader';

const AuthGuard = dynamic(() => import('@/components/shared/AuthGuard'), {
  ssr: false,
  loading: () => <Loader />,
});

const PayrollPageContent = dynamic(() => import('./content'), {
  ssr: false,
  loading: () => <Loader />,
});

export const metadata: Metadata = {
  title: 'Payroll Management',
};

export default function PayrollPage() {
  return (
    <AuthGuard allowedRoles={['admin']}>
      <PayrollPageContent />
    </AuthGuard>
  );
}