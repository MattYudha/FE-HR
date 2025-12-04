import dynamic from 'next/dynamic';
import { Loader } from '@/components/shared/Loader';

const LoginPageContent = dynamic(() => import('./content'), {
  ssr: false,
  loading: () => <Loader />,
});

export default function LoginPage() {
  return <LoginPageContent />;
}