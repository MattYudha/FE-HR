import dynamic from 'next/dynamic';
import { Loader } from '@/components/shared/Loader';

const UnauthorizedPageContent = dynamic(() => import('./content'), {
  ssr: false,
  loading: () => <Loader />,
});

export default function UnauthorizedPage() {
  return <UnauthorizedPageContent />;
}