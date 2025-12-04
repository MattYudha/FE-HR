import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

// PERBAIKAN: Update interface sesuai response backend
interface DashboardSummary {
  totalEmployees: number;
  payrollPaid: number;
  payrollPending: number;
  approvalPending: number;
  attendanceToday: {
    // UBAH INI
    present: number;
    total: number;
  };
  kpiAverageScore: number;
}

interface PayrollTrendData {
  month: string;
  countPaid: number;
  totalPaid: number;
}

export const useDashboardSummary = () => {
  return useQuery<DashboardSummary, Error>({
    queryKey: ['dashboardSummary'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/summary');
      return data.data;
    },
  });
};

export const usePayrollTrend = () => {
  return useQuery<PayrollTrendData[], Error>({
    queryKey: ['payrollTrend'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/payroll-trend');
      return data.data;
    },
  });
};
