import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { Attendance, AttendanceSummary } from '@/src/types';

interface AttendanceResponse {
  attendances: Attendance[];
  summary: AttendanceSummary;
}

const fetchAttendancesAndSummary = async (date: string): Promise<AttendanceResponse> => {
  const [attendanceRes, summaryRes] = await Promise.all([
    apiClient.get(`/api/attendance?date=${date}`),
    apiClient.get(`/api/attendance/summary?date=${date}`),
  ]);
  return {
    attendances: attendanceRes.data,
    summary: summaryRes.data,
  };
};

const updateAttendanceStatus = async ({ attendanceId, status }: { attendanceId: string; status: string }) => {
  const response = await apiClient.put(`/attendance/${attendanceId}`, { status });
  return response.data;
};

export const useAttendances = (date: string) => {
  return useQuery<AttendanceResponse>({
    queryKey: ['attendances', date],
    queryFn: () => fetchAttendancesAndSummary(date),
    enabled: !!date,
  });
};

export const useUpdateAttendanceStatus = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, { attendanceId: string; status: string; date: string }>({
    mutationFn: updateAttendanceStatus,
    onSuccess: (data, variables) => {
      // Invalidate both the specific attendance and the list for the current date
      queryClient.invalidateQueries({ queryKey: ['attendances', variables.date] });
    },
  });
};
