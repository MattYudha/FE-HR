import dynamic from 'next/dynamic';
import { Loader } from '@/components/shared/Loader';

const HomePageContent = dynamic(() => import('./content'), {
  ssr: false,
  loading: () => <Loader />,
});

export default function Home() {
  return <HomePageContent />;
}