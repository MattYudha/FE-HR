import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';

interface SummaryData {
  totalEmployees: number;
  payrollPaid: number;
  payrollPending: number;
  approvalPending: number;
  attendanceToday: number;
  kpiAverageScore: number;
}

interface PayrollTrendData {
  month: string;
  totalPayroll: number;
  totalTax: number;
}

interface AttendanceTodayData {
  present: number;
  total: number;
}

interface KpiAverageData {
  averageScore: number;
  averageTarget: number;
}


const fetchSummary = async (): Promise<SummaryData> => {
  const response = await apiClient.get('/dashboard/summary');
  return response.data;
};

const fetchPayrollTrend = async (): Promise<PayrollTrendData[]> => {
  const response = await apiClient.get('/dashboard/payroll-trend');
  return response.data;
};

const fetchAttendanceToday = async (): Promise<AttendanceTodayData> => {
  const response = await apiClient.get('/api/dashboard/attendance-today');
  return response.data;
};

const fetchKpiAverage = async (): Promise<KpiAverageData> => {
    // Implement API call to /dashboard/kpi-average once backend is ready
    return Promise.resolve({ averageScore: 0, averageTarget: 0 });
};


export const useSummary = () => {
  return useQuery<SummaryData>({
    queryKey: ['dashboardSummary'],
    queryFn: fetchSummary,
  });
};

export const usePayrollTrend = () => {
  return useQuery<PayrollTrendData[]>({
    queryKey: ['payrollTrend'],
    queryFn: fetchPayrollTrend,
  });
};

export const useAttendanceToday = () => {
    return useQuery<AttendanceTodayData>({
        queryKey: ['attendanceToday'],
        queryFn: fetchAttendanceToday,
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });
};

export const useKpiAverage = () => {
    return useQuery<KpiAverageData>({
        queryKey: ['kpiAverage'],
        queryFn: fetchKpiAverage,
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });
};
