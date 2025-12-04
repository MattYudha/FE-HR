import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

interface DashboardSummary {
  totalEmployees: number;
  totalPayroll: number;
  averageKpi: number;
  attendanceToday: number;
}

interface PayrollTrendData {
  period: string;
  totalPayroll: number;
}

export const useDashboardSummary = () => {
  return useQuery<DashboardSummary, Error>({
    queryKey: ['dashboardSummary'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/summary');
      return data.data; // Adjust based on actual API response structure
    },
  });
};

export const usePayrollTrend = () => {
  return useQuery<PayrollTrendData[], Error>({
    queryKey: ['payrollTrend'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/payroll-trend');
      return data.data; // Adjust based on actual API response structure
    },
  });
};
