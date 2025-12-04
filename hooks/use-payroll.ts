'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

// =======================
// Interfaces dasar
// =======================

// Sesuaikan dengan response API kamu.
// Minimal isi field yang memang dipakai di UI (PayrollTable, PayrollForm, dll).
export interface Payroll {
  id: string;
  employeeId: string;
  employeeName: string;
  period: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'PENDING' | 'PAID';
  // tambahkan field lain kalau ada
  [key: string]: any;
}

export interface CreatePayrollData {
  employeeId: string;
  period: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  // field lain yang dibutuhkan endpoint create payroll
  [key: string]: any;
}

// =======================
// Recap interfaces
// =======================

export interface DepartmentalRecap {
  department: string;
  totalSalary: number;
  totalPph21: number;
  totalTakeHomePay: number;
  employeeCount: number;
}

export interface PayrollRecap {
  period: string;
  totalPayroll: number;
  totalTax: number;
  totalNet: number;
  totalEmployeesPaid: number;
  departmentalRecap: DepartmentalRecap[];
}

// =======================
// LIST & DETAIL PAYROLL
// =======================

// List payrolls (table utama)
export const usePayrolls = (params?: Record<string, any>) => {
  return useQuery<Payroll[], Error>({
    queryKey: ['payrolls', params],
    queryFn: async () => {
      const { data } = await api.get('/payroll', { params });
      // asumsi backend balikin { data: { data: Payroll[] } } → sesuaikan kalau beda
      return data.data as Payroll[];
    },
  });
};

// Detail payroll (by id)
export const usePayroll = (id?: string) => {
  return useQuery<Payroll, Error>({
    queryKey: ['payroll', id],
    queryFn: async () => {
      const { data } = await api.get(`/payroll/${id}`);
      return data.data as Payroll;
    },
    enabled: !!id,
  });
};

// Create payroll
export const useCreatePayroll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreatePayrollData) => {
      const { data } = await api.post('/payroll', payload);
      return data;
    },
    onSuccess: () => {
      // refresh list setelah create
      queryClient.invalidateQueries({ queryKey: ['payrolls'] });
    },
  });
};

// =======================
// UPDATE STATUS (PAID / PENDING)
// =======================

// Tandai payroll sebagai PAID
export const useMarkPayrollAsPaid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post(`/payroll/${id}/mark-paid`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payrolls'] });
    },
  });
};

// Kembalikan payroll ke PENDING
export const useRevertPayrollToPending = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post(`/payroll/${id}/revert-pending`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payrolls'] });
    },
  });
};

// =======================
// RECAP & REPORT
// =======================

// 1. Fetch Payroll Recap
export const usePayrollRecap = (period: string) => {
  return useQuery<PayrollRecap, Error>({
    queryKey: ['payrollRecap', period],
    queryFn: async () => {
      const { data } = await api.get(`/payroll/recap`, {
        params: { period },
      });
      return data.data as PayrollRecap;
    },
    enabled: !!period,
  });
};

// 2. Export Report (Excel/CSV)
export const exportPayrollReport = async (
  period: string,
  format: 'csv' | 'xlsx',
) => {
  try {
    const response = await api.get(`/payroll/export`, {
      params: { period, format },
      responseType: 'blob', // Penting untuk file download
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

// 3. Download Slip Gaji PDF
export const downloadPayrollSlip = async (id: string, employeeName: string) => {
  try {
    const response = await api.get(`/payroll/${id}/pdf`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `slip-gaji-${employeeName}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading payroll slip', error);
    throw error;
  }
};
