import dynamic from 'next/dynamic';
import { Loader } from '@/components/shared/Loader';
import AuthGuard from '@/components/shared/AuthGuard'; // AuthGuard is now default export

const PayrollDetailPageContent = dynamic(() => import('./content'), {
  ssr: false,
  loading: () => <Loader />,
});

export default function PayrollDetailPage() {
  return (
    <AuthGuard allowedRoles={['admin', 'employee']}> {/* Assuming specific roles */}
      <PayrollDetailPageContent />
    </AuthGuard>
  );
}

// Required for `output: 'export'` with dynamic routes
export async function generateStaticParams() {
  return [];
}