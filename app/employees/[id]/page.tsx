import dynamic from 'next/dynamic';
import { Loader } from '@/components/shared/Loader';
import AuthGuard from '@/components/shared/AuthGuard'; // AuthGuard is now default export

const EmployeeDetailPageContent = dynamic(() => import('./content'), {
  ssr: false,
  loading: () => <Loader />,
});

export default function EmployeeDetailPage() {
  return (
    <AuthGuard allowedRoles={['admin', 'employee']}> {/* Assuming specific roles */}
      <EmployeeDetailPageContent />
    </AuthGuard>
  );
}

// Required for `output: 'export'` with dynamic routes
export async function generateStaticParams() {
  return [];
}