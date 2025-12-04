'use client';

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { User } from '@/src/types'; // Sesuaikan path ini dengan struktur project kamu

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // LOGOUT dipisah sebagai function declaration (aman dipanggil dari mana saja di bawah)
  function logout() {
    Cookies.remove('token');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
    router.push('/login');
  }

  const fetchUser = async (authToken: string) => {
    try {
      api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      const response = await api.get('/users/me');

      const data = response.data.data;

      setUser({
        ...data,
        // pastikan null → undefined supaya aman dipakai di AvatarImage (string | undefined)
        profilePictureUrl: data.profilePictureUrl ?? undefined,
      });
    } catch (error) {
      console.error('Failed to fetch user data', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = Cookies.get('token');

    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    setToken(storedToken);
    void fetchUser(storedToken);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data.data;

      Cookies.set('token', newToken, { expires: 7 });
      setToken(newToken);

      setUser({
        ...userData,
        profilePictureUrl: userData.profilePictureUrl ?? undefined,
      });

      api.defaults.headers.common['Authorization'] = `Bearer newToken`;

      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const isAuthenticated = !!user && !!token;

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
