import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Payroll {
  id: string;
  employeeId: string;
  period: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'PENDING' | 'PAID';
  createdAt: string;
  updatedAt: string;
  employee?: { // Assuming employee details might be nested
    fullName: string;
    position: string;
  };
}

export interface CreatePayrollData {
  employeeId: string;
  period: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
}

export interface BulkGeneratePayrollData {
  period: string;
}

// Fetch all payrolls with optional filters
export const usePayrolls = (filters?: { status?: string; period?: string; search?: string; employeeId?: string }) => {
  return useQuery<Payroll[], Error>({
    queryKey: ['payrolls', filters],
    queryFn: async () => {
      const { data } = await api.get('/payroll', { params: filters });
      return data.data; // Adjust based on actual API response structure
    },
  });
};

// Fetch a single payroll by ID
export const usePayroll = (id: string) => {
  return useQuery<Payroll, Error>({
    queryKey: ['payroll', id],
    queryFn: async () => {
      const { data } = await api.get(`/payroll/${id}`);
      return data.data; // Adjust based on actual API response structure
    },
    enabled: !!id,
  });
};

// Create a new payroll (manual)
export const useCreatePayroll = () => {
  const queryClient = useQueryClient();
  return useMutation<Payroll, Error, CreatePayrollData>({
    mutationFn: async (newPayroll) => {
      const { data } = await api.post('/payroll', newPayroll);
      return data.data; // Adjust based on actual API response structure
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payrolls'] });
    },
  });
};

// Bulk generate payrolls
export const useBulkGeneratePayroll = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, BulkGeneratePayrollData>({
    mutationFn: async (periodData) => {
      await api.post('/payroll/bulk-generate', periodData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payrolls'] });
    },
  });
};

// Mark payroll as paid
export const useMarkPayrollAsPaid = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await api.put(`/payroll/${id}/pay`);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['payrolls'] });
      queryClient.invalidateQueries({ queryKey: ['payroll', id] });
    },
  });
};

// Revert payroll to pending (unpay)
export const useRevertPayrollToPending = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await api.put(`/payroll/${id}/unpay`);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['payrolls'] });
      queryClient.invalidateQueries({ queryKey: ['payroll', id] });
    },
  });
};

// Export payroll report (CSV/XLSX) - this will trigger a file download
export const exportPayrollReport = async (period: string, format: 'csv' | 'xlsx') => {
  try {
    const response = await api.get(`/payroll/export`, {
      params: { period, format },
      responseType: 'blob', // Important for file downloads
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `payroll-report-${period}.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting payroll report', error);
    throw error;
  }
};

// Download PDF payroll slip - this will trigger a file download
export const downloadPayrollSlip = async (id: string) => {
  try {
    const response = await api.get(`/payroll/${id}/pdf`, {
      responseType: 'blob', // Important for file downloads
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `payroll-slip-${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading payroll slip', error);
    throw error;
  }
};
