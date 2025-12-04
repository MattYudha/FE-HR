import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Kpi {
  id: string;
  employeeId: string;
  period: string;
  score: number;
  category: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  employee?: { // Assuming employee details might be nested
    fullName: string;
    position: string;
  };
}

export interface CreateKpiData {
  employeeId: string;
  period: string;
  score: number;
  category: string;
  notes?: string;
}

// Fetch my KPIs
export const useMyKpis = () => {
  return useQuery<Kpi[], Error>({
    queryKey: ['myKpis'],
    queryFn: async () => {
      const { data } = await api.get('/kpi/me');
      return data.data; // Adjust based on actual API response structure
    },
  });
};

// Fetch all KPIs (for HR/Admin)
export const useAllKpis = (filters?: { period?: string; employeeId?: string }) => {
  return useQuery<Kpi[], Error>({
    queryKey: ['allKpis', filters],
    queryFn: async () => {
      const { data } = await api.get('/kpi', { params: filters });
      return data.data; // Adjust based on actual API response structure
    },
  });
};

// Create a new KPI
export const useCreateKpi = () => {
  const queryClient = useQueryClient();
  return useMutation<Kpi, Error, CreateKpiData>({
    mutationFn: async (newKpi) => {
      const { data } = await api.post('/kpi', newKpi);
      return data.data; // Adjust based on actual API response structure
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myKpis'] });
      queryClient.invalidateQueries({ queryKey: ['allKpis'] });
    },
  });
};
