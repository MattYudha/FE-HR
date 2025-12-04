'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { Attendance, AttendanceSummary } from '@/src/types';

// Re-export type yang dipakai di komponen
export type AttendanceRecord = Attendance;

export interface AttendanceFilter {
  from?: string;
  to?: string;
  employeeId?: string;
}

// ======================================================================
// 1. DASHBOARD – Absensi Harian per tanggal
// ======================================================================
export const useDailyAttendance = (date: string) => {
  return useQuery({
    queryKey: ['dailyAttendance', date],
    queryFn: async () => {
      const [list, summary] = await Promise.all([
        apiClient.get(`/api/attendance`, { params: { date } }),
        apiClient.get(`/api/attendance/summary`, { params: { date } }),
      ]);

      return {
        attendances: list.data.data ?? list.data,
        summary: (summary.data.data ?? summary.data) as
          | AttendanceSummary
          | unknown,
      };
    },
    enabled: !!date,
  });
};

// ======================================================================
// 2. DETAIL – Riwayat Absensi per Karyawan
// ======================================================================
export const useEmployeeAttendance = (employeeId: string) => {
  return useQuery<AttendanceRecord[], Error>({
    queryKey: ['employeeAttendance', employeeId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/attendance`, {
        params: { employeeId },
      });
      const data = response.data.data ?? response.data;
      return Array.isArray(data) ? data : [];
    },
    enabled: !!employeeId,
  });
};

// ======================================================================
// 3. UPDATE STATUS ABSENSI
// ======================================================================
export const useUpdateAttendanceStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      attendanceId,
      status,
    }: {
      attendanceId: string;
      status: string;
    }) => apiClient.put(`/attendance/${attendanceId}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyAttendance'] });
      queryClient.invalidateQueries({ queryKey: ['employeeAttendance'] });
      queryClient.invalidateQueries({ queryKey: ['myAttendance'] });
      queryClient.invalidateQueries({ queryKey: ['allAttendance'] });
    },
  });
};

// ======================================================================
// 4. HOOK UNTUK AttendanceRecordTable
// ======================================================================

// 4A. My attendance (user biasa)
export const useMyAttendance = (filters?: AttendanceFilter) => {
  return useQuery<AttendanceRecord[], Error>({
    queryKey: ['myAttendance', filters],
    queryFn: async () => {
      const response = await apiClient.get('/api/attendance/me', {
        params: filters,
      });
      const data = response.data.data ?? response.data;
      return Array.isArray(data) ? data : [];
    },
  });
};

// 4B. All attendance (HR / Admin)
export const useAllAttendance = (filters?: AttendanceFilter) => {
  return useQuery<AttendanceRecord[], Error>({
    queryKey: ['allAttendance', filters],
    queryFn: async () => {
      const response = await apiClient.get('/api/attendance', {
        params: filters,
      });
      const data = response.data.data ?? response.data;
      return Array.isArray(data) ? data : [];
    },
    enabled: !!filters, // hanya jalan kalau filter di-pass (sesuai kondisi di komponen)
  });
};

// ======================================================================
// 5. OPTIONAL: Check-in, Check-out (kalau kamu pakai di tempat lain)
// ======================================================================
export const useCheckIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post('/api/attendance/checkin');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myAttendance'] });
      queryClient.invalidateQueries({ queryKey: ['dailyAttendance'] });
      queryClient.invalidateQueries({ queryKey: ['allAttendance'] });
    },
  });
};

export const useCheckOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post('/api/attendance/checkout');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myAttendance'] });
      queryClient.invalidateQueries({ queryKey: ['dailyAttendance'] });
      queryClient.invalidateQueries({ queryKey: ['allAttendance'] });
    },
  });
};
