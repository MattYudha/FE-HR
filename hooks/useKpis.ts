import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { KPI } from '@/src/types';

export const useKpis = (filters?: { employeeId?: string; period?: string }) => {
  return useQuery<KPI[]>({
    queryKey: ['kpis', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.employeeId) params.append('employeeId', filters.employeeId);
      if (filters?.period) params.append('period', filters.period);

      // PERBAIKAN: Hapus '/api' di depan, jadi '/kpi' saja
      const response = await apiClient.get(`/kpi?${params.toString()}`);
      return response.data;
    },
  });
};

const fetchKpiById = async (id: string): Promise<KPI> => {
  const response = await apiClient.get(`/kpi/${id}`); // Hapus '/api'
  return response.data;
};

const createKpi = async (
  newKpiData: Omit<KPI, 'id' | 'lastUpdated'>,
): Promise<KPI> => {
  const response = await apiClient.post('/kpi', newKpiData); // Hapus '/api'
  return response.data;
};

const updateKpi = async (
  updatedKpiData: Partial<KPI> & { id: string },
): Promise<KPI> => {
  const { id, ...data } = updatedKpiData;
  const response = await apiClient.put(`/kpi/${id}`, data); // Hapus '/api'
  return response.data;
};

export const useKpi = (id: string) => {
  return useQuery<KPI>({
    queryKey: ['kpi', id],
    queryFn: () => fetchKpiById(id),
    enabled: !!id,
  });
};

export const useCreateKpi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createKpi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpis'] });
    },
  });
};

export const useUpdateKpi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateKpi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['kpis'] });
      queryClient.invalidateQueries({ queryKey: ['kpi', data.id] });
    },
  });
};
