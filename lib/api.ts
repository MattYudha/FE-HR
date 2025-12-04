import axios, { AxiosError } from 'axios';
import useAuthStore from '@/src/stores/authStore';
import { showGlobalLoading, hideGlobalLoading } from '@/components/shared/GlobalLoadingOverlay';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    showGlobalLoading(); // Show loading indicator
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    hideGlobalLoading(); // Hide loading indicator on request error
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    hideGlobalLoading(); // Hide loading indicator on success
    return response;
  },
  (error: AxiosError) => {
    hideGlobalLoading(); // Hide loading indicator on response error
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
