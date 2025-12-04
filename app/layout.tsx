import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic'; // Added dynamic import
import { Toaster } from '@/components/ui/toaster';
import { Providers } from '@/components/shared/Providers';
import { Loader } from '@/components/shared/Loader'; // Import Loader for fallback

const GlobalLoadingOverlay = dynamic(() => import('@/components/shared/GlobalLoadingOverlay'), {
  ssr: false,
  loading: () => <Loader />,
});

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HR System - Employee Management',
  description: 'Complete HR management system for employees, payroll, KPI, and more',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
        <GlobalLoadingOverlay />
      </body>
    </html>
  );
}
