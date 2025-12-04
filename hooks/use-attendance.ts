import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  checkInTime: string;
  checkOutTime: string | null;
  status: 'PRESENT' | 'ABSENT' | 'LEAVE'; // Assuming these statuses
  employee?: { // Assuming employee details might be nested
    fullName: string;
    position: string;
  };
}

// Fetch my attendance records
export const useMyAttendance = (filters?: { from?: string; to?: string }) => {
  return useQuery<AttendanceRecord[], Error>({
    queryKey: ['myAttendance', filters],
    queryFn: async () => {
      const { data } = await api.get('/attendance/me', { params: filters });
      return data.data; // Adjust based on actual API response structure
    },
  });
};

// Fetch all attendance records (for HR/Admin)
export const useAllAttendance = (filters?: { from?: string; to?: string; employeeId?: string }) => {
  return useQuery<AttendanceRecord[], Error>({
    queryKey: ['allAttendance', filters],
    queryFn: async () => {
      const { data } = await api.get('/attendance', { params: filters }); // Assuming /attendance endpoint for all
      return data.data; // Adjust based on actual API response structure
    },
  });
};

// Check In
export const useCheckIn = () => {
  const queryClient = useQueryClient();
  return useMutation<AttendanceRecord, Error, void>({
    mutationFn: async () => {
      const { data } = await api.post('/attendance/check-in');
      return data.data; // Adjust based on actual API response structure
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myAttendance'] });
      queryClient.invalidateQueries({ queryKey: ['allAttendance'] });
    },
  });
};

// Check Out
export const useCheckOut = () => {
  const queryClient = useQueryClient();
  return useMutation<AttendanceRecord, Error, void>({
    mutationFn: async () => {
      const { data } = await api.post('/attendance/check-out');
      return data.data; // Adjust based on actual API response structure
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myAttendance'] });
      queryClient.invalidateQueries({ queryKey: ['allAttendance'] });
    },
  });
};
