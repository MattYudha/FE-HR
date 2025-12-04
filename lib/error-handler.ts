import { AxiosError } from 'axios';
import { toast } from '@/hooks/use-toast'; // Assuming useToast is globally accessible or passed

interface ApiErrorResponse {
  message?: string;
  error?: string;
  statusCode?: number;
}

export const handleApiError = (error: unknown, title: string = 'Error') => {
  let errorMessage = 'An unexpected error occurred.';

  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiErrorResponse;
    if (apiError && apiError.message) {
      errorMessage = apiError.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  toast({
    title: title,
    description: errorMessage,
    variant: 'destructive',
  });
};
