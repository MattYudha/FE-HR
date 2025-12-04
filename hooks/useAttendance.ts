import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { Attendance, AttendanceSummary } from '@/src/types';

// Hook 1: Untuk Dashboard (Per Tanggal)
export const useDailyAttendance = (date: string) => {
  return useQuery({
    queryKey: ['dailyAttendance', date],
    queryFn: async () => {
      const [list, summary] = await Promise.all([
        apiClient.get(`/api/attendance?date=${date}`),
        apiClient.get(`/api/attendance/summary?date=${date}`),
      ]);
      return {
        attendances: list.data,
        summary: summary.data,
      };
    },
    enabled: !!date,
  });
};

// Hook 2: Untuk Halaman Detail Karyawan (History Absensi)
export const useEmployeeAttendance = (employeeId: string) => {
  return useQuery<Attendance[]>({
    queryKey: ['employeeAttendance', employeeId],
    queryFn: async () => {
      const response = await apiClient.get(
        `/api/attendance?employeeId=${employeeId}`,
      );
      return Array.isArray(response.data)
        ? response.data
        : response.data.data || [];
    },
    enabled: !!employeeId,
  });
};

// Hook 3: Update Status (Admin/Approval)
export const useUpdateAttendanceStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      attendanceId,
      status,
    }: {
      attendanceId: string;
      status: string;
    }) =>
      // PERHATIKAN: Saya tambahkan /api/ agar konsisten dengan yang lain
      apiClient.put(`/api/attendance/${attendanceId}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyAttendance'] });
      queryClient.invalidateQueries({ queryKey: ['employeeAttendance'] });
    },
  });
};

// --- TAMBAHAN YANG HILANG ---

// Hook 4: Get My Attendance (Untuk User yang sedang login)
export const useMyAttendance = () => {
  return useQuery({
    queryKey: ['myAttendance'],
    queryFn: async () => {
      // Pastikan endpoint ini sesuai backend kamu (misal: /api/attendance/me atau /api/attendance/today)
      const response = await apiClient.get('/api/attendance/today');
      return response.data;
    },
  });
};

// Hook 5: Check In
export const useCheckIn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiClient.post('/api/attendance/check-in', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myAttendance'] });
    },
  });
};

// Hook 6: Check Out
export const useCheckOut = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) =>
      apiClient.post('/api/attendance/check-out', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myAttendance'] });
    },
  });
};
