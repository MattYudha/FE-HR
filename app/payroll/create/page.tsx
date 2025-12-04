import dynamic from 'next/dynamic';
import { Loader } from '@/components/shared/Loader';
import AuthGuard from '@/components/shared/AuthGuard'; // AuthGuard is now default export

const CreatePayrollPageContent = dynamic(() => import('./content'), {
  ssr: false,
  loading: () => <Loader />,
});

export default function CreatePayrollPage() {
  return (
    <AuthGuard allowedRoles={['admin']}> {/* Assuming specific roles */}
      <CreatePayrollPageContent />
    </AuthGuard>
  );
}