'use client';

import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { Loader2 } from 'lucide-react';

interface LoadingState {
  count: number;
  show: () => void;
  hide: () => void;
}

const useLoadingStore = create<LoadingState>((set) => ({
  count: 0,
  show: () => set((state) => ({ count: state.count + 1 })),
  hide: () => set((state) => ({ count: Math.max(0, state.count - 1) })),
}));

export default function GlobalLoadingOverlay() {
  const { count } = useLoadingStore();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Debounce to prevent flashing for very fast requests
    let timeout: NodeJS.Timeout;
    if (count > 0) {
      timeout = setTimeout(() => setVisible(true), 200); // Show after 200ms
    } else {
      setVisible(false);
    }
    return () => clearTimeout(timeout);
  }, [count]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex flex-col items-center p-4 rounded-lg shadow-lg bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-gray-800" />
        <p className="mt-3 text-gray-800">Loading...</p>
      </div>
    </div>
  );
}

export const showGlobalLoading = () => useLoadingStore.getState().show();
export const hideGlobalLoading = () => useLoadingStore.getState().hide();
