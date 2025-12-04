import dynamic from 'next/dynamic';
import { Loader } from '@/components/shared/Loader';
import AuthGuard from '@/components/shared/AuthGuard'; // AuthGuard is now default export

const BulkGeneratePayrollPageContent = dynamic(() => import('./content'), {
  ssr: false,
  loading: () => <Loader />,
});

export default function BulkGeneratePayrollPage() {
  return (
    <AuthGuard allowedRoles={['admin']}> {/* Assuming specific roles */}
      <BulkGeneratePayrollPageContent />
    </AuthGuard>
  );
}