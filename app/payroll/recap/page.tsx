import { type Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Loader } from '@/components/shared/Loader';

const AuthGuard = dynamic(() => import('@/components/shared/AuthGuard'), {
  ssr: false,
  loading: () => <Loader />,
});

const PayrollRecapPageContent = dynamic(() => import('./content'), {
  ssr: false,
  loading: () => <Loader />,
});

export const metadata: Metadata = {
  title: 'Payroll Recap',
};

export default function PayrollRecapPage() {
  return (
    <AuthGuard allowedRoles={['admin']}>
      <PayrollRecapPageContent />
    </AuthGuard>
  );
}