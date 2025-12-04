import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { KPI } from '@/src/types';

const fetchKpis = async (): Promise<KPI[]> => {
  const response = await apiClient.get('/api/kpi');
  return response.data;
};

const fetchKpiById = async (id: string): Promise<KPI> => {
  const response = await apiClient.get(`/api/kpi/${id}`);
  return response.data;
};

const createKpi = async (newKpiData: Omit<KPI, 'id' | 'lastUpdated'>): Promise<KPI> => {
  const response = await apiClient.post('/api/kpi', newKpiData);
  return response.data;
};

const updateKpi = async (updatedKpiData: Partial<KPI> & { id: string }): Promise<KPI> => {
  const { id, ...data } = updatedKpiData;
  const response = await apiClient.put(`/api/kpi/${id}`, data);
  return response.data;
};

export const useKpis = () => {
  return useQuery<KPI[]>({
    queryKey: ['kpis'],
    queryFn: fetchKpis,
  });
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
