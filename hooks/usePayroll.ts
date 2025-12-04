import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { Payroll, PayrollRecap } from '@/src/types';

const fetchPayrolls = async (): Promise<Payroll[]> => {
  const response = await apiClient.get('/payroll');
  return response.data;
};

const fetchPayrollById = async (id: string): Promise<Payroll> => {
    const response = await apiClient.get(`/payroll/${id}`);
    return response.data;
}

const fetchPayrollRecap = async (period: string): Promise<PayrollRecap> => {
    const response = await apiClient.get(`/payroll/recap?period=${period}`);
    return response.data;
};

export const usePayrolls = () => {
  return useQuery<Payroll[]>({
    queryKey: ['payrolls'],
    queryFn: fetchPayrolls,
  });
};

export const usePayroll = (id: string) => {
    return useQuery<Payroll>({
        queryKey: ['payroll', id],
        queryFn: () => fetchPayrollById(id),
        enabled: !!id, // Only run the query if the id is available
    });
}

export const usePayrollRecap = (period: string) => {
    return useQuery<PayrollRecap>({
        queryKey: ['payrollRecap', period],
        queryFn: () => fetchPayrollRecap(period),
        enabled: !!period, // Only run the query if the period is available
    });
};

export const useUpdatePayrollStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payrollId: string) => apiClient.put(`/payroll/${payrollId}`, { status: 'paid' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payrolls'] });
      // Also invalidate the specific payroll query if it's in the cache
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
    },
  });
};
