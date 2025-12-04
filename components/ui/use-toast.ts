'use client';

import { toast as sonnerToast } from 'sonner';

interface Toast {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export function useToast() {
  const toast = ({ title, description, variant }: Toast) => {
    sonnerToast(title, {
      description,
      // You can customize the toast appearance based on variant here
      // For example, adding a class for destructive variant
      className: variant === 'destructive' ? 'bg-red-500 text-white' : '',
    });
  };

  return { toast };
}
