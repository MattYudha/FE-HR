import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { User } from '@/src/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user: User, token: string) => {
        Cookies.set('auth_token', token, { expires: 1 }); // Expires in 1 day
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        Cookies.remove('auth_token');
        // The redirect should happen on the page, not in the store
        // to allow for more flexible control.
        set({ user: null, token: null, isAuthenticated: false });
        // After state is cleared, redirect.
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      },
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : dummyStorage)), // Conditionally use localStorage
    },
  ),
);

// Dummy storage for server-side to prevent errors
const dummyStorage = {
  getItem: (_name: string) => null,
  setItem: (_name: string, _value: string) => {},
  removeItem: (_name: string) => {},
};

export default useAuthStore;
